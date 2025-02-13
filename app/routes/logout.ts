import {  createCookie,  redirect, ActionFunctionArgs } from "@remix-run/cloudflare"
import { sessionStore } from "../loaders/sessionStore.server";

export async function action({ request, context } : ActionFunctionArgs) {

    const cookie = createCookie("__session", { secrets: [context.cloudflare.env.JWT_SECRET] });
    const { getSession,destroySession } = sessionStore(context, cookie);
    const session = await getSession(request.headers.get("Cookie"));
    destroySession(session);

    return redirect("/login");


}