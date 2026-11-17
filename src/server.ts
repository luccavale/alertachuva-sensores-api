import { createApp } from './app';
import { config } from './config/env';
import { createDb } from './db';
import { runMigrations } from './db/migrate';

const db = createDb(config.databaseFile);
runMigrations(db); // garante que o banco está atualizado ao iniciar

createApp(db).listen(config.port, () => {
  console.log(`API de Sensores rodando em http://localhost:${config.port}`);
  console.log(`Swagger em http://localhost:${config.port}/docs`);
});
