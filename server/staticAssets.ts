import { createMiddleware } from "hono/factory";
import { cacheHeader } from "pretty-cache-header";
interface StaticAssetsOptions {
    cache?: Parameters<typeof cacheHeader>[0];
}
export function staticAssets(options: StaticAssetsOptions = {}) {
    return createMiddleware(async (c, next) => {
        const binding = c.env?.ASSETS as Fetcher | undefined;

        if (!binding) throw new ReferenceError("The binding ASSETS is not set.");

        let response: Response;

        // c.req.raw.headers.delete("if-none-match");

        try {
            response = (await binding.fetch(
                c.req.url,
                c.req.raw.clone() as unknown as RequestInit,
            )) as unknown as globalThis.Response;

            // If the request failed, we just call the next middleware
            if (response.status >= 400) return await next();

            response = new Response(response.body, response);

            // If cache options are configured, we set the cache-control header
            if (options.cache) {
                response.headers.set("cache-control", cacheHeader(options.cache));
            }

            return response;
        } catch {
            return await next();
        }
    });
}