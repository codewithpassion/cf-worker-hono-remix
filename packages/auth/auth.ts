import { type Context, Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { UserRepo } from "./repo/user-repo";
import { nanoid } from "nanoid";
import { MagicLinksRepo } from "./repo/magic-links-repo";
import type  { User } from "@prtctyai/database";
import type { AppType } from "./types";
import { emailSenderMiddleware } from "./middleware";
import { TokensRepo } from "./repo/token-repo";

const AppName = "Test App";

const app = new Hono<AppType>();

app.use(emailSenderMiddleware);

const magicLinkValiditySeconds = 60 * 15; // 15 minutes

const superAdmins = ['dominik@portcity-ai.com']

function getRoles(user: User) {
  
  const roles = [];

  if (superAdmins.includes(user.email)) {
    roles.push('Super-Admin')
  }
  if (user.role === 'Admin') {
    roles.push('Admin')
  }
  if (user.role === 'User') {
    roles.push('User')
  }
  return roles;
}

// Login endpoint
app.post('/login', async (c) => {
  const body = await c.req.json()

  const { email, redirectTo } = body as { email?: string, project?: string, redirectTo?: string};
  const unauthorized = c.json({ error: 'Unauthorized' }, 401);

  if (!email) {
    console.log("Email and are required, body", body)
    return unauthorized;
  }

  const usersRepo = new UserRepo(c.var.Database)
  const user = await usersRepo.findByEamil(email)
  if (!user) {
    console.log("User not found", email, body, `user ${user}`)
    return unauthorized;
  }

  const roles = getRoles(user);
  if (roles.length === 0) {
    console.log("User is not a member or admin ", user)
    return unauthorized;
  }

    const token = nanoid(32);
    const expiresAt = new Date(Date.now() + magicLinkValiditySeconds * 1000);
    const magicLinkRepo = new MagicLinksRepo(c.var.Database);

    const origin = c.req.header('origin') || c.req.header('referer') || 'unknown';
    console.log(`Magic link requested from origin: ${origin}`);

    const redirectUrl = `${redirectTo ? redirectTo : origin}?token=${token}`;
    console.log("Redirect URL", redirectUrl);
    await magicLinkRepo.create({ token, email: user.email, expiresAt, redirectUrl });

    const emailRes = await c.var.EmailSender.sendMagicLink({ link: redirectUrl, email: user.email, description: AppName });

    if (!emailRes || emailRes.error) {
      console.error('Failed to send magic link', emailRes)
      return c.json({ message: 'Failed to send magic link' }, 500)
    }

    return c.json({ ok: true, emailRes })

})

app.post('/logout', async (c) => {

  const accessToken = c.req.header('X-Access-Token')
  const refreshToken = c.req.header('X-Refresh-Token')
  const unauthorized = c.json({ error: 'Unauthorized' }, 401);

  if (!accessToken) {
    return c.json({ error: 'Access token is required' }, 400)
  }

  try {
    const payload = await verify(accessToken, c.env.JWT_SECRET)
    if (payload.type !== 'access') {
      console.log("Invalid token type", payload)
      return unauthorized
    }
    if (refreshToken) {
      const refresPayload = await verify(refreshToken, c.env.JWT_SECRET)
      if (refresPayload.type !== 'refresh') {
        console.log("Invalid token type", payload)
        return unauthorized
      }
    }

    const tokenRepo = new TokensRepo(c.var.Database)
    await tokenRepo.delete(accessToken)
    if (refreshToken) {
      await tokenRepo.delete(refreshToken)
    }

    return c.json({ ok: true })

  } catch (error) {
    console.error("Unauthorized", error)
    return unauthorized;
  }

});

app.post('/magic', async (c) => {
  const { token } = await c.req.json()
  const unauthorized = c.json({ error: 'Unauthorized' }, 401);

  if (!token) {
    return c.json({ error: 'Token is required' }, 400)
  }

  try {
    console.info("Validating Magic link token", token)

    const tokensRepo = new TokensRepo(c.var.Database)
    const magicLinksRepo = new MagicLinksRepo(c.var.Database)
    const magicLink = await magicLinksRepo.getByKey(token)
    if (!magicLink) return unauthorized;


    const repo = new UserRepo(c.var.Database)
    const user = await repo.findByEamil(magicLink.email)
    if (!user) return unauthorized

    const roles = getRoles(user);
    const accessToken = await getAccessToken(user, roles, c);
    const refreshToken = await getRefreshToken(user, roles, c);
    await magicLinksRepo.delete(token)
    await tokensRepo.create({ token: accessToken.token, email: user.email, type: 'access' })
    await tokensRepo.create({ token: refreshToken.token, email: user.email, type: 'refresh' })

    return c.json({ accessToken, refreshToken, user: { name: user.name, email: user.email, roles } })

  } catch (error) {
    console.error("Unauthorized", error)
    return unauthorized;
  }
})

app.post('/check', async (c) => {
  const unauthorized = c.json({ error: 'Unauthorized' }, 401);
  const tokenRepo = new TokensRepo(c.var.Database)
  const userRepo = new UserRepo(c.var.Database)

  const accessToken = c.req.header('X-Access-Token')

  if (!accessToken) {
    return c.json({ error: 'Access token is required' }, 401)
  }

  try {
    const payload = await verify(accessToken, c.env.JWT_SECRET)
    if (payload.type !== 'access') {
      return unauthorized
    }
    const email = payload.sub as string

    const user = await userRepo.findByEamil(email)
    if (!user) return unauthorized
    const isExisting = await tokenRepo.findByToken(accessToken)
    if (!isExisting) return unauthorized

    return c.json({ ok: true, user: { name: user.name, email: user.email, roles: payload.roles} })

  } catch (error) {
    console.error('Error during /check', error)
    return unauthorized;
  }
});

app.post('/verify', async (c) => {
  const unauthorized = c.json({ error: 'Unauthorized' }, 401);
  const tokenRepo = new TokensRepo(c.var.Database)
  const userRepo = new UserRepo(c.var.Database)

  const accessToken = c.req.header('X-Access-Token')

  if (!accessToken) {
    return c.json({ error: 'Access token is required' }, 401)
  }

  try {
    const payload = await verify(accessToken, c.env.JWT_SECRET)
    if (payload.type !== 'access') {
      return unauthorized
    }
    const email = payload.sub as string;

    const user = await userRepo.findByEamil(email)
    if (!user) return unauthorized
    const isExisting = await tokenRepo.findByToken(accessToken)
    if (!isExisting) return unauthorized

    await tokenRepo.delete(accessToken)

    const newAccessToken = await getAccessToken(user, payload.roles as string[], c)
    await tokenRepo.create({ token: newAccessToken.token, email: user.email, type: 'access' })

    return c.json({ ok: true, accessToken: newAccessToken, user: { name: user.name, email: user.email, roles: payload.roles, project: payload.project } })
  } catch (error) {
    console.error('Error', error)
    return c.json({ error: 'Invalid token' }, 401)
  }
})

app.post('/refresh', async (c) => {
  const unauthorized = c.json({ error: 'Unauthorized' }, 401);
  const refreshToken = c.req.header('X-Refresh-Token')

  if (!refreshToken) {
    return unauthorized
  }

  try {
    const payload = await verify(refreshToken, c.env.JWT_SECRET)

    if (payload.type !== 'refresh') {
      return unauthorized
    }
    const { roles } = payload as { roles: string[]};

    const userRepo = new UserRepo(c.var.Database)
    const user = await userRepo.findByEamil(payload.sub as string)
    if (!user) return unauthorized

    const tokensRepo = new TokensRepo(c.var.Database)

    const newAccessToken = await getAccessToken(user, roles, c);
    const newRefreshToken = await getRefreshToken(user, roles, c);
    await tokensRepo.create({ token: newAccessToken.token, email: user.email, type: 'access' })
    await tokensRepo.create({ token: newRefreshToken.token, email: user.email, type: 'refresh' })

    return c.json({ accessToken: newAccessToken, refreshToken: newRefreshToken, user: { name: user.name, email: user.email, roles,  } })
  } catch (error) {
    console.error('Error while refreshing token', error)
    return unauthorized
  }
})

function getRefreshTokenPayload(user: User, roles: string[]) {
  return {
    sub: user.email,
    roles,
    type: 'refresh',
    exp: Math.floor(Date.now()) + 60 * 60 * 24 * 7 // 7 days
  }
}

async function getAccessToken(user: User, roles: string[],  c: Context<AppType>) {
  const payload = {
    sub: user.email,
    roles: roles,
    type: 'access',
    exp: Math.floor(Date.now() / 1000) + 60 * 30 // 30 minutes
  }
  const token = await sign(payload, c.env.JWT_SECRET)
  return { token, validTo: payload.exp * 1000, roles: roles }
}

async function getRefreshToken(user: User, roles: string[], c: Context<AppType>) {
  const refreshTokenPayload = getRefreshTokenPayload(user, roles);

  const refreshToken = await sign(
    refreshTokenPayload,
    c.env.JWT_SECRET
  )
  return { token: refreshToken, validTo: refreshTokenPayload.exp * 1000 };
}

export default app; 