import { sql } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Domínio: Bairro 1:N Sensor 1:N Leitura

export const bairros = sqliteTable('bairros', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
  cidade: text('cidade').notNull().default('São Paulo'),
  criadoEm: text('criado_em').notNull().default(sql`(CURRENT_TIMESTAMP)`)
});

export const sensores = sqliteTable('sensores', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  codigo: text('codigo').notNull().unique(),
  descricao: text('descricao'),
  ativo: integer('ativo', { mode: 'boolean' }).notNull().default(true),
  bairroId: integer('bairro_id')
    .notNull()
    .references(() => bairros.id, { onDelete: 'cascade' })
});

export const leituras = sqliteTable('leituras', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sensorId: integer('sensor_id')
    .notNull()
    .references(() => sensores.id, { onDelete: 'cascade' }),
  chuvaMmH: real('chuva_mm_h').notNull(),
  nivelAguaCm: real('nivel_agua_cm').notNull(),
  registradaEm: text('registrada_em').notNull()
});
