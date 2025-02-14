export type { DatabaseBindings, DBVariables, Database } from './Database';
export { DbMiddleware } from './Middleware';
export { 
    users, tokens, trucks, magicLinks,
    type User, 
    type Token,
    type Truck
 } from './db/schema';

 import repo from './repo';
 export { repo };

 import { UserRepo } from './repo/user-repo';
import { TokensRepo } from './repo/token-repo';
import { TrucksRepo } from './repo/trucks-repo';
import { MagicLinksRepo } from './repo/magic-links-repo';

 export { 
    UserRepo,
    TokensRepo,
    TrucksRepo,
    MagicLinksRepo
  };


export const takeUniqueOrThrow = (message: string) => {
    return <T>(values: T[]): T => {
        if (values.length !== 1)
            throw new Error(`Found non unique or inexistent value: ${message}`);
        return values[0]!;
    };
}

export const takeUniqueOrNull = () => {
    return <T>(values: T[]): T | null => {
        if (values.length !== 1) {
            return null
        }
        return values[0]!;
    };
}