import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

export type Db = BetterSQLite3Database<typeof schema>;

// Abre a conexão com o SQLite (arquivo ou ':memory:' nos testes).
export function createDb(file: string): Db {
  if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
  const sqlite = new Database(file);
  sqlite.pragma('foreign_keys = ON');
  return drizzle(sqlite, { schema });
}
