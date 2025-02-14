import { takeUniqueOrNull, users, type Database } from '@prtctyai/database';
import { eq } from 'drizzle-orm';

export type NewUser = typeof users.$inferInsert;
export type UpdateUser = Omit<NewUser, 'id'>;

export class UserRepo {
    constructor(private database: Database) {}

    async getAll() {
        return this.database
            .select().from(users)
            .all();
    }

    async insert(user: NewUser) {
        return this.database
            .insert(users)
            .values(user)
            .run();
    }

    async delete(id: number) {
        return this.database
            .delete(users)
            .where(eq(users.id, id))
            .run();
    }

    async update(id: number, user: UpdateUser) {
        return this.database
            .update(users)
            .set(user)
            .where(eq(users.id, id))
            .run();
    }

    async findByEmail(email: string) {
        return this.database
            .select().from(users)
            .where(eq(users.email, email))
            .then(takeUniqueOrNull());
    }

    async seed() {
        const dom = await this.database.select().from(users).where(eq(users.email, "dominik@portcity-ai.com")).all();
        console.log("dom", dom);
        if (dom.length > 0) {
            return true;
        }
        return this.database
            .insert(users)
            .values({ name: "Dominik Fretz", email: "dominik@portcity-ai.com",role: "Suer-Admin"}).run();
                
    }
}
