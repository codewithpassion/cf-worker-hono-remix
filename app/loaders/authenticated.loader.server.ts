// app/loaders/authenticated.loader.js
import {  createCookie, LoaderFunctionArgs, redirect } from "@remix-run/cloudflare"
import { sessionStore } from "./sessionStore.server";

export async function loader({ request, context } : LoaderFunctionArgs) {
    const cookie = createCookie("__session", { secrets: [context.cloudflare.env.JWT_SECRET] });
    const { getSession } = sessionStore(context, cookie);
    const session = await getSession(request.headers.get("Cookie"));
    
    const user = session.get("user");
    console.log("User", user);
  
    if (!user) {
      return redirect("/login");
    }
  
    return Response.json({ user });
  }

