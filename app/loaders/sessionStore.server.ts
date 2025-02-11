import {
    createCookie,
    createWorkersKVSessionStorage,
  } from "@remix-run/cloudflare";

  import type { AppLoadContext, Cookie } from "@remix-run/cloudflare";  
//   // In this example the Cookie is created separately.
//   const sessionCookie = createCookie("__session", {
//     secrets: ["r3m1xr0ck5"],
//     sameSite: true,
    
//   });

const sessionStore = (context: AppLoadContext, cookie: Cookie) => {
    const { getSession, commitSession, destroySession } =
    createWorkersKVSessionStorage({
      // The KV Namespace where you want to store sessions
      kv: context.cloudflare.env.SESSSIONS,
      cookie: cookie,
    });

    return {getSession, commitSession, destroySession}  
}

  
  export { createCookie, sessionStore};
  