import { takeUniqueOrNull, takeUniqueOrThrow, trucks, type Database, type Truck } from '@prtctyai/database';
import { eq} from 'drizzle-orm';

export class TrucksRepo {
    constructor(private database: Database) {}

    async getAll() {
        return this.database
            .select().from(trucks)
            .all();
    }

    async insert(truck: Truck) {
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
}