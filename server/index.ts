import { Hono } from "hono";
import { reactRouter as remix } from 'remix-hono/handler'
import type { AppLoadContext, RequestHandler } from '@remix-run/cloudflare'
import { staticAssets } from "./staticAssets";
import { Database, usersTable } from "@prtctyai/database";
import type { DbEnv } from "@prtctyai/database";
import { DurableObject } from "@cloudflare/workers-types/experimental";
// import { DurableObject } from 'cloudflare:workers'

// // export { DatabaseObject } from "@prtctyai/database";
// export class DatabaseObject extends DurableObject {

// }


type AppType =  {
	Variables: {},
	Bindings: {} & DbEnv
}

const app = new Hono<AppType>();

let handler: RequestHandler | undefined

app.get('/api', async (c) => {
	const db = Database.get(c.env)
	db.insert(usersTable).values({
				name: 'John',
			age: 30,
			email: 'john@example.com',
		});
	// const db = Database.get(c.env)
	// await db.insert({
	// 		name: 'John',
	// 		age: 30,
	// 		email: 'john@example.com',
	// 	});
	// 	console.log('New user created!');

	return c.json({ hello: 'world' })

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

