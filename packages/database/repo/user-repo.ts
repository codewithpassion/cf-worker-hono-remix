import { takeUniqueOrNull, takeUniqueOrThrow, users, type Database } from '@prtctyai/database';
import { eq} from 'drizzle-orm';

export class UserRepo {
    constructor(private database: Database) {}

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