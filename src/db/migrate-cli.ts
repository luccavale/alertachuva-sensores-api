import { config } from '../config/env';
import { createDb } from './index';
import { runMigrations } from './migrate';

const db = createDb(config.databaseFile);
runMigrations(db);
console.log(`Migrações aplicadas em ${config.databaseFile}`);
