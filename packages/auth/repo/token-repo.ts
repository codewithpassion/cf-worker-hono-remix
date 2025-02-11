import { takeUniqueOrThrow, type Database } from '@prtctyai/database';
import {  tokens } from '@prtctyai/database/db/schema';
import { eq} from 'drizzle-orm';

export class TokensRepo {
    
    constructor(private database: Database) {}

    create({email, token,type}: { token: string; email: string; type: 'refresh' | 'access'; }) {
        return this.database
            .insert(tokens)
            .values({ token, email, type })
            .run();
    }

    findByToken(token: string) {
        return this.database
            .select().from(tokens)
            .where(eq(tokens.token, token))
            .then(takeUniqueOrThrow(`Token with token ${token}`));
    }

    async delete(token: string) {
        return this.database
            .delete(tokens)
            .where(eq(tokens.token, token))
            .run();
    }

    // async create({email, expiresAt, redirectUrl,token}: { token: string; email: string; expiresAt: Date; redirectUrl: string; }) {
    //     return this.database
    //         .insert(magicLinks)
    //         .values({ token, email, expiresAt, redirectUrl })
    //         .run();
    // }
  

    // async findByEamil(email: string) {
    //     return this.database
    //         .select().from(users)
    //         .where(eq(users.email, email))
    //         .then(takeUniqueOrThrow(`User with email ${email}`));
    // }
}