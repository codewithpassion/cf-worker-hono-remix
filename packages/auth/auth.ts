import { type Context, Hono } from "hono";
import { z } from "zod";
import { sign, verify } from "hono/jwt";
import { UserRepo } from "./repo/user-repo";
import { randomBytes } from "crypto";
import { MagicLinksRepo } from "./repo/magic-links-repo";
import type { User } from "@prtctyai/database";
import type { AppType } from "./types";
import { EmailSenderMiddleware } from "./middleware";
import { TokensRepo } from "./repo/token-repo";

const AppName = "Test App";

const loginSchema = z.object({
  email: z.string().email(),
  redirectTo: z.string().url().optional(),
});

const magicSchema = z.object({
  token: z.string().min(1)
});

const app = new Hono<AppType>();

app.use(EmailSenderMiddleware);

const magicLinkValiditySeconds = 60 * 15; // 15 minutes
const superAdmins = ["dominik@portcity-ai.com"];

export function getRoles(user: User) {
  const roles = [];

  if (superAdmins.includes(user.email)) {
    roles.push("Super-Admin");
  }
  if (user.role === "Admin") {
    roles.push("Admin");
  }
  if (user.role === "User") {
    roles.push("User");
  }
  return roles;
}

// Login endpoint
app.post("/login", async (c) => {
  const body = await c.req.json();
  const result = loginSchema.safeParse(body);
  
  if (!result.success) {
    return c.json({ error: result.error.issues }, 400);
  }

  const { email, redirectTo } = result.data;
  const unauthorized = c.json({ error: "Unauthorized" }, 401);

  const usersRepo = new UserRepo(c.var.Database);
  const user = await usersRepo.findByEmail(email);
  if (!user) {
    console.log("User not found", email);
    return unauthorized;
  }

  const roles = getRoles(user);
  if (roles.length === 0) {
    console.log("User is not a member or admin", user);
    return unauthorized;
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + magicLinkValiditySeconds * 1000);
  const magicLinkRepo = new MagicLinksRepo(c.var.Database);

  const origin = c.req.header("origin") || c.req.header("referer") || "unknown";
  console.log(`Magic link requested from origin: ${origin}`);

  const redirectUrl = `${redirectTo ? redirectTo : origin}?token=${token}`;
  console.log("Redirect URL", redirectUrl);
  await magicLinkRepo.create({ token, email: user.email, expiresAt, redirectUrl });

  const emailRes = await c.var.EmailSender.sendMagicLink({ link: redirectUrl, email: user.email, description: AppName });

  if (!emailRes || emailRes.error) {
    console.error("Failed to send magic link", emailRes);
    return c.json({ message: "Failed to send magic link" }, 500);
  }

  return c.json({ ok: true, emailRes });
});

app.post("/magic", async (c) => {
  const body = await c.req.json();
  const result = magicSchema.safeParse(body);
  
  if (!result.success) {
    return c.json({ error: result.error.issues }, 400);
  }

  const { token } = result.data;
  const unauthorized = c.json({ error: "Unauthorized" }, 401);

  try {
    console.info("Validating Magic link token", token);

    const tokensRepo = new TokensRepo(c.var.Database);
    const magicLinksRepo = new MagicLinksRepo(c.var.Database);
    const magicLink = await magicLinksRepo.getByKey(token);
    if (!magicLink) return unauthorized;

    if (new Date(magicLink.expiresAt) < new Date()) {
      console.warn(`Expired magic link attempt for email: ${magicLink.email}`);
      await magicLinksRepo.delete(token);
      return c.json({ error: "Magic link expired" }, 401);
    }

    const repo = new UserRepo(c.var.Database);
    const user = await repo.findByEmail(magicLink.email);
    if (!user) return unauthorized;

    const roles = getRoles(user);
    const accessToken = await getAccessToken(user, roles, c);
    const refreshToken = await getRefreshToken(user, roles, c);

    await magicLinksRepo.delete(token);
    await tokensRepo.create({ token: accessToken.token, email: user.email, type: "access" });
    await tokensRepo.create({ token: refreshToken.token, email: user.email, type: "refresh" });

    // **Set Secure HTTP-Only Cookies**
    c.header("Set-Cookie", `accessToken=${accessToken.token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=1800`);
    c.header("Set-Cookie", `refreshToken=${refreshToken.token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`);

    return c.json({ ok: true, user: { name: user.name, email: user.email, roles } });
  } catch (error) {
    console.error("Unauthorized", error);
    return unauthorized;
  }
});

app.post("/logout", async (c) => {
  c.header("Set-Cookie", `accessToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`);
  c.header("Set-Cookie", `refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`);

  return c.json({ ok: true });
});

app.post("/refresh", async (c) => {
  const unauthorized = c.json({ error: "Unauthorized" }, 401);
  const refreshToken = c.req.header("Cookie")?.match(/refreshToken=([^;]*)/)?.[1];

  if (!refreshToken) {
    return unauthorized;
  }

  try {
    const payload = await verify(refreshToken, c.env.JWT_SECRET);
    if (payload.type !== "refresh") {
      return unauthorized;
    }
    const { roles } = payload as { roles: string[] };

    const userRepo = new UserRepo(c.var.Database);
    const user = await userRepo.findByEmail(payload.sub as string);
    if (!user) return unauthorized;

    const tokensRepo = new TokensRepo(c.var.Database);
    const newAccessToken = await getAccessToken(user, roles, c);
    const newRefreshToken = await getRefreshToken(user, roles, c);

    await tokensRepo.create({ token: newAccessToken.token, email: user.email, type: "access" });
    await tokensRepo.create({ token: newRefreshToken.token, email: user.email, type: "refresh" });

    c.header("Set-Cookie", `accessToken=${newAccessToken.token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=1800`);
    c.header("Set-Cookie", `refreshToken=${newRefreshToken.token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`);

    return c.json({ ok: true });
  } catch (error) {
    console.error("Error while refreshing token", error);
    return unauthorized;
  }
});

async function getAccessToken(user: User, roles: string[], c: Context<AppType>) {
  const payload = {
    sub: user.email,
    roles: roles,
    type: "access",
    exp: Math.floor(Date.now() / 1000) + 60 * 30
  };
  const token = await sign(payload, c.env.JWT_SECRET);
  return { token, validTo: payload.exp * 1000, roles: roles };
}

async function getRefreshToken(user: User, roles: string[], c: Context<AppType>) {
  const payload = {
    sub: user.email,
    roles,
    type: "refresh",
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
  };
  const token = await sign(payload, c.env.JWT_SECRET);
  return { token, validTo: payload.exp * 1000 };
}

export default app;
