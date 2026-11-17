import { config } from '../config/env';
import { bairros } from './schema';
import { createDb } from './index';
import { runMigrations } from './migrate';
import { BairroService } from '../services/bairro.service';
import { SensorService } from '../services/sensor.service';
import { LeituraService } from '../services/leitura.service';

// Dados SIMULADOS (nenhum dado pessoal real) para demonstrar a API.
const db = createDb(config.databaseFile);
runMigrations(db);

if (db.select().from(bairros).all().length > 0) {
  console.log('O banco já possui dados. Seed ignorado.');
  process.exit(0);
}

const bairro = new BairroService(db).criar({ nome: 'Bairro Exemplo', cidade: 'São Paulo' });
const sensor = new SensorService(db).criar({
  codigo: 'SENS-001',
  descricao: 'Sensor de chuva e nível de água (ESP32)',
  bairroId: bairro.id,
  ativo: true
});
const leituras = new LeituraService(db);
const agora = Date.now();
[
  { chuvaMmH: 5, nivelAguaCm: 20, min: 30 },
  { chuvaMmH: 30, nivelAguaCm: 55, min: 20 },
  { chuvaMmH: 12.5, nivelAguaCm: 35, min: 10 }
].forEach(l =>
  leituras.criar({
    sensorId: sensor.id,
    chuvaMmH: l.chuvaMmH,
    nivelAguaCm: l.nivelAguaCm,
    registradaEm: new Date(agora - l.min * 60_000).toISOString()
  })
);
console.log('Seed concluído: 1 bairro, 1 sensor e 3 leituras.');
