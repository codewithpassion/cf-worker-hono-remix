import { DrizzleD1Database } from 'drizzle-orm/d1';

export type DBType = {
    Variables: DBVariables;
    Bindings: DatabaseBindings;
}

export type DatabaseBindings = { 
    DB: D1Database;
}

export type DBVariables = {
    Database: Database;
}

export type Database = DrizzleD1Database<Record<string, never>>;

