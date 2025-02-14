import { Hono } from "hono";
import { reactRouter as remix } from 'remix-hono/handler'
import type { AppLoadContext, RequestHandler } from '@remix-run/cloudflare'
import { staticAssets } from "./staticAssets";
import { DbMiddleware, TrucksRepo, users, type DatabaseBindings, type DBVariables } from "@prtctyai/database";
import { auth } from "@prtctyai/auth";
import { EmailSenderMiddleware } from "packages/auth/middleware";
import { EmailSender } from "packages/auth/email/sender";
import { createMiddleware } from "hono/factory";
import { UsersRepo, TokensRepo, MagicLinksRepo } from "@prtctyai/database";

export type AppBindings = {
	EmailSender: EmailSender,
	Repositories: {
		users: UsersRepo,
		token: TokensRepo,
		magicLinks: MagicLinksRepo,
		trucks: TrucksRepo
	}
} & DatabaseBindings

type AppType = {
	// eslint-disable-next-line @typescript-eslint/ban-types
	Variables: {} & DBVariables & Env,
	// eslint-disable-next-line @typescript-eslint/ban-types
	Bindings: AppBindings
}

const RepoMiddleware = createMiddleware(async (c, next) => {
	c.set('Repositories', {
		users: new UsersRepo(c.var.Database),
		token: new TokensRepo(c.var.Database),
		magicLinks: new MagicLinksRepo(c.var.Database),
		trucks: new TrucksRepo(c.var.Database)
	})
	await next()
})

const app = new Hono<AppType>();
app.use(DbMiddleware);
app.use(EmailSenderMiddleware);
app.use(RepoMiddleware);

let handler: RequestHandler | undefined

app.route("/api/auth", auth);

app.get('/api', async (c) => {
	const foo = await c.var.Database.select().from(users).all();
	return c.json({ hello: 'world', foo })
})

app.post("/api/seed", async (c) => {
	const db = c.var.Database;
	const usersRepo = new UserRepo(db);
	return await usersRepo.seed().then(res => {
		return c.json({ success: res });
	})
});

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
							env: c.env,
							var: c.var,
						},
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
					env: c.env,
					var: c.var,
				},
			} as unknown as AppLoadContext
			return handler(c.req.raw, remixContext)
		}
	}
)

// Export the Hono app
export default app;
