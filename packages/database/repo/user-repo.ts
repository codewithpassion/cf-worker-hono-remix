import { takeUniqueOrNull, trucks, trucks, users, type Database } from '@prtctyai/database';
import { eq } from 'drizzle-orm';
import type { ServiceDays } from '../db/schema';

export type NewUser = typeof users.$inferInsert;
export type UpdateUser = Omit<NewUser, 'id'>;

export class UserRepo {
    constructor(private database: Database) { }

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
        if (dom.length === 0) {
            console.log("User already exists");
            this.database
                .insert(users)
                .values({ name: "Dominik Fretz", email: "dominik@portcity-ai.com", role: "Super-Admin" }).run();

        }

        const allTrucks = await this.database.select().from(trucks).all();
        if (allTrucks.length === 0) {

            const regServiceDays: ServiceDays[] = ["Tuesday", "Wednesday", "Thursday", "Friday"];
            const fullServiceDays: ServiceDays[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
            for (let i = 0; i < 7; i++) {
                await this.database
                    .insert(trucks)
                    .values({
                        truck_id: `R-0${i + 1}`,
                        capacity: 2,
                        type: "R",
                        serviceDays: regServiceDays,
                        isActive: true,
                        comment: null,
                    })
                    .run();
            }
            for (let i = 0; i < 6; i++) {
                await this.database
                    .insert(trucks)
                    .values({
                        truck_id: `C-0${i + 1}`,
                        capacity: 3,
                        type: "C",
                        serviceDays: i === 2 || i === 4 ? fullServiceDays : regServiceDays,
                        isActive: true,
                        comment: null,
                    })
                    .run();
            }
        }

        return { success: true };
    }
}
