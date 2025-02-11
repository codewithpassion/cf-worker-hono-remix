import { takeUniqueOrThrow, users, type Database } from '@prtctyai/database';
import { eq} from 'drizzle-orm';

export class UserRepo {
    constructor(private database: Database) {}

    async findByEmail(email: string) {
        return this.database
            .select().from(users)
            .where(eq(users.email, email))
            .then(takeUniqueOrThrow(`User with email ${email}`));
    }
}