import { addresses, type Database, type NewAddress } from '@prtctyai/database';
import { eq } from 'drizzle-orm';

export type UpdateAddress = Omit<NewAddress, 'id'>;

export class AddressesRepo {
    constructor(private database: Database) { }

    async getAll() {
        return this.database
            .select().from(addresses)
            .all();
    }

    async insert(address: NewAddress) {
        return this.database
            .insert(addresses)
            .values(address)
            .run();
    }

    async delete(id: number) {
        return this.database
            .delete(addresses)
            .where(eq(addresses.id, id))
            .run();
    }

    async update(id: number, address: UpdateAddress) {
        console.log("Updating address", id, address);
        return this.database
            .update(addresses)
            .set(address)
            .where(eq(addresses.id, id))
            .run();
    }
}
