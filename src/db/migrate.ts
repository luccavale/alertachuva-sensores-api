import path from 'node:path';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { Db } from './index';

// As migrações (SQL versionado) ficam na pasta /drizzle, geradas por "npm run db:generate".
export const MIGRATIONS_FOLDER = path.resolve(__dirname, '../../drizzle');

export function runMigrations(db: Db): void {
  migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
}
