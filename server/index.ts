import { Hono } from "hono";
import { reactRouter as remix } from 'remix-hono/handler'
import type { AppLoadContext, RequestHandler } from '@remix-run/cloudflare'
import { staticAssets } from "./staticAssets";
import { DbMiddleware, users, type DbEnv, type DBVariables } from "@prtctyai/database";
import { auth } from "@prtctyai/auth";

type AppType =  {
	// eslint-disable-next-line @typescript-eslint/ban-types
	Variables: {} & DBVariables,
	// eslint-disable-next-line @typescript-eslint/ban-types
	Bindings: {} & DbEnv
} 

const app = new Hono<AppType>();
app.use(DbMiddleware);

let handler: RequestHandler | undefined

app.route("/api/auth", auth);

app.get('/api', async (c) => {
	const foo = await c.var.Database.select().from(users).all();
	return c.json({ hello: 'world', foo})
})

app.use(
	async (c, next) => {
		if (process.env.NODE_ENV !== 'development' || import.meta.env.PROD) {
			return staticAssets()(c, next)
		}
		await next()
	},
	async (c, next) => {
		if (process.env.NODE_ENV !== 'development' || import.meta.env.PROD) {
			const serverBuild = await import('../build/server')
			return remix({
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				build: serverBuild,
				mode: 'production',
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				getLoadContext(c) {
					return {
						cloudflare: {
							env: c.env
						}
					}
				}
			})(c, next)
		} else {
			if (!handler) {
				// @ts-expect-error it's not typed
				// eslint-disable-next-line import/no-unresolved
				const build = await import('virtual:remix/server-build')
				const { createRequestHandler } = await import('@remix-run/cloudflare')
				handler = createRequestHandler(build, 'development')
			}
			const remixContext = {
				cloudflare: {
					env: c.env
				}
			} as unknown as AppLoadContext
			return handler(c.req.raw, remixContext)
		}
	}
)

// Export the Hono app
export default app;
