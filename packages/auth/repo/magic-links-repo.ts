import { takeUniqueOrThrow, type Database } from '@prtctyai/database';
import { magicLinks } from '@prtctyai/database/db/schema';
import { eq} from 'drizzle-orm';

export class MagicLinksRepo {
    
    constructor(private database: Database) {}

    async create({email, expiresAt, redirectUrl,token}: { token: string; email: string; expiresAt: Date; redirectUrl: string; }) {
        return this.database
            .insert(magicLinks)
            .values({ token, email, expiresAt, redirectUrl })
            .run();
    }

    async delete(token: string) {  
        return this.database
            .delete(magicLinks)
            .where(eq(magicLinks.token, token))
            .run();
    }

    async getByKey(token: string) {
        return this.database
            .select().from(magicLinks)
            .where(eq(magicLinks.token, token))
            .then(takeUniqueOrThrow(`Magic link with token ${token}`));
    }  
}