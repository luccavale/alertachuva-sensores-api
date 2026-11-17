import path from 'node:path';

export const config = {
  port: Number(process.env.PORT ?? 3000),
  databaseFile: process.env.DATABASE_FILE ?? path.resolve(process.cwd(), 'data/alertachuva.db')
};
