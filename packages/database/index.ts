export type { DatabaseBindings, DBVariables, Database } from './Database';
export { DbMiddleware } from './Middleware';
export { users, tokens, type User, type Token } from './db/schema';

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