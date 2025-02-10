import { drizzle } from 'drizzle-orm/d1';

export type DbEnv = { 
    DB: D1Database;
}

export class Database {
    static get(env: DbEnv) {
        const db = drizzle(env.DB);
        
        return db;
    }
}


// /// <reference types="@cloudflare/workers-types" />
// import { drizzle, DrizzleSqliteDODatabase } from 'drizzle-orm/durable-sqlite';
// import { DurableObject } from 'cloudflare:workers'
// import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
// import migrations from './drizzle/migrations';
// import { usersTable } from './db/schema';

// export type DbEnv = { 
//     DATABASE_OBJECT: DurableObjectNamespace<DatabaseObject>;
// }

// export class DatabaseObject<E extends DbEnv = DbEnv> extends DurableObject {
// 	storage: DurableObjectStorage;
// 	db: DrizzleSqliteDODatabase<any>;

// 	constructor(ctx: DurableObjectState, env: E) {
// 		super(ctx, env);
// 		this.storage = ctx.storage;
// 		this.db = drizzle(this.storage, { logger: false });
// 	}

//     async migrate() {
//         migrate(this.db, migrations);
//     }

// 	async insert(user: typeof usersTable.$inferInsert) {
//         await this.db.insert(usersTable).values(user);
//     }

// 	async select() {
//         return this.db.select().from(usersTable);
//     }
// }

// export class Database {
//     static get<E extends DbEnv = DbEnv>(env: DbEnv): DurableObjectStub<DatabaseObject<E>> {
// 		const id: DurableObjectId = env.DATABASE_OBJECT.idFromName('durable-object');
// 		const stub = env.DATABASE_OBJECT.get(id);
//         stub.migrate();


//         return stub;
//     }
// }

// // export default {
// // 	/**
// // 	 * This is the standard fetch handler for a Cloudflare Worker
// // 	 *
// // 	 * @param request - The request submitted to the Worker from the client
// // 	 * @param env - The interface to reference bindings declared in wrangler.toml
// // 	 * @param ctx - The execution context of the Worker
// // 	 * @returns The response to be sent back to the client
// // 	 */
// // 	async fetch(request: Request, env: Env): Promise<Response> {
// // 		const id: DurableObjectId = env.DATABASE_OBJECT.idFromName('durable-object');
// // 		const stub = env.DATABASE_OBJECT.get(id);
// // 		await stub.migrate();

// // 		await stub.insert({
// // 			name: 'John',
// // 			age: 30,
// // 			email: 'john@example.com',
// // 		});
// // 		console.log('New user created!');
	
// // 		const users = await stub.select();
// // 		console.log('Getting all users from the database: ', users);

// //         return new Response();
// //     }
// // }
