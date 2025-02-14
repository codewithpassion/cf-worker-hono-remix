import { takeUniqueOrNull, takeUniqueOrThrow, trucks, type Database, type Truck, type NewTruck } from '@prtctyai/database';
import { eq } from 'drizzle-orm';

export type UpdateTruck = Omit<NewTruck, 'id'>;

export class TrucksRepo {
    constructor(private database: Database) { }

    async getAll() {
        return this.database
            .select().from(trucks)
            .all();
    }

    async insert(truck: NewTruck) {
        return this.database
            .insert(trucks)
            .values(truck)
            .run();
    }

    async delete(id: number) {
        return this.database
            .delete(trucks)
            .where(eq(trucks.id, id))
            .run();
    }

    async update(id: number, truck: UpdateTruck) {
        return this.database
            .update(trucks)
            .set(truck)
            .where(eq(trucks.id, id))
            .run();
    }
}
