import {  createCookie,  redirect, ActionFunctionArgs } from "@remix-run/cloudflare"
import { sessionStore } from "./sessionStore.server";

export async function logoutAction({ request, context } : ActionFunctionArgs) {

    const cookie = createCookie("__session", { secrets: [context.cloudflare.env.JWT_SECRET] });
    const { getSession,destroySession } = sessionStore(context, cookie);
    const session = await getSession(request.headers.get("Cookie"));
    destroySession(session);

    return redirect("/login");


}