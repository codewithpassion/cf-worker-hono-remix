import {createMiddleware} from 'hono/factory'
import type { DBType } from './Database'
import { drizzle } from 'drizzle-orm/d1'

const DbMiddleware = createMiddleware<DBType>(async (c, next) => {
    c.set('Database', drizzle(c.env.DB))
    await next()
})

export { DbMiddleware }