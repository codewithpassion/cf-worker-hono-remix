export type { DatabaseBindings, DBVariables, Database } from './Database';
export { DbMiddleware } from './Middleware';
export {
    users, tokens, trucks, magicLinks, addresses,
    type User,
    type Token,
    type Truck,
    type NewTruck,
    type Address,
    type NewAddress
} from './db/schema';

import repo from './repo';
export { repo };

import { UsersRepo } from './repo/users-repo';
import { TokensRepo } from './repo/token-repo';
import { TrucksRepo } from './repo/trucks-repo';
import { MagicLinksRepo } from './repo/magic-links-repo';
import { AddressesRepo } from './repo/addresses-repo';

export {
    UsersRepo,
    TokensRepo,
    TrucksRepo,
    MagicLinksRepo,
    AddressesRepo
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
