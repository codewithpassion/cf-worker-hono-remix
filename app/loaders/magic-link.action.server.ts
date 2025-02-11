import { ActionFunctionArgs, createCookie, LoaderFunctionArgs, redirect, } from "@remix-run/cloudflare"
import { User } from "packages/database";
import { z } from "zod";
import { randomBytes } from "crypto";
import { sessionStore } from "~/loaders/sessionStore.server";


const loginSchema = z.object({
    email: z.string().email(),
});

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

const unauthorized = Response.json({ error: "Unauthorized" }, { status: 401 });

export async function action({ request, context }: ActionFunctionArgs) {

    const body = await request.formData();
    const result = loginSchema.safeParse(Object.fromEntries(body.entries()));

    if (!result.success) {
        console.log("Invalid email address", result.error);
        return redirect("/login");
    }


    const user = await context.cloudflare.var.Repositories.user.findByEmail(result.data.email);
    if (!user) {
        console.log("User not found", result.data.email);
        return unauthorized;
    }


    const roles = getRoles(user);
    if (roles.length === 0) {
        console.log("User is not a member or admin", user);
        return unauthorized;
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + magicLinkValiditySeconds * 1000);
    const magicLinkRepo = context.cloudflare.var.Repositories.magicLinks;

    const origin = request.headers.get("origin") || request.headers.get("referer") || "unknown";
    console.log(`Magic link requested from origin: ${origin}`);

    const redirectUrl = `${origin}/login/magic?token=${token}`;
    console.log("Redirect URL", redirectUrl);
    await magicLinkRepo.create({ token, email: user.email, expiresAt, redirectUrl });

    const emailRes = await context.cloudflare.var.EmailSender.sendMagicLink({ link: redirectUrl, email: user.email, description: "Test App" });

    if (!emailRes || emailRes.error) {
        console.error("Failed to send magic link", emailRes);
        return Response.json({ message: "Failed to send magic link" }, { status: 500 });
    }

    return Response.json({ success: true });
}

export async function verifyMagicLinkToken({ request, context, redirectTo, token }: LoaderFunctionArgs & { token: string, redirectTo: string }) {

    try {
        console.info("Validating Magic link token", token);

        const magicLink = await context.cloudflare.var.Repositories.magicLinks.getByKey(token);
        if (!magicLink) return unauthorized;

        if (new Date(magicLink.expiresAt) < new Date()) {
            console.warn(`Expired magic link attempt for email: ${magicLink.email}`);
            await context.cloudflare.var.Repositories.magicLinks.delete(token);
            return Response.json({ error: "Magic link expired" }, { status: 401 });
        }
        const user = await context.cloudflare.var.Repositories.user.findByEmail(magicLink.email);
        if (!user) return unauthorized;
        await context.cloudflare.var.Repositories.magicLinks.delete(token);
        const roles = getRoles(user);

        const cookie = createCookie("__session", { secrets: [context.cloudflare.env.JWT_SECRET] });
        const {getSession, commitSession} = sessionStore(context, cookie);
        const session = await getSession(request.headers.get("Cookie"));
        session.set("user", user);
        session.set("roles", roles);
        const header = await commitSession(session);

        return redirect(redirectTo, {
            headers: {
                "Set-Cookie": header,
            },
        })


    } catch (error) {
        console.error("Error validating magic link", error);
        return unauthorized;
    }
}