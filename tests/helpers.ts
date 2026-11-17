import request from 'supertest';
import { createApp } from '../src/app';
import { createDb } from '../src/db';
import { runMigrations } from '../src/db/migrate';

// Cada arquivo de teste usa um banco SQLite em memória, já com as migrações aplicadas.
export function criarAmbiente() {
  const db = createDb(':memory:');
  runMigrations(db);
  const api = request(createApp(db));

  let contador = 0;
  const criarBairro = async (nome = 'Bairro Teste') => (await api.post('/api/v1/bairros').send({ nome })).body;
  const criarSensor = async (bairroId: number) => {
    contador += 1;
    return (await api.post('/api/v1/sensores').send({ codigo: `SENS-${String(contador).padStart(3, '0')}`, bairroId })).body;
  };
  const enviarLeitura = async (sensorId: number, chuvaMmH: number, nivelAguaCm: number, registradaEm?: string) =>
    api.post('/api/v1/leituras').send({ sensorId, chuvaMmH, nivelAguaCm, registradaEm });

  return { db, api, criarBairro, criarSensor, enviarLeitura };
}
