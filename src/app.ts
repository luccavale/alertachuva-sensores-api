import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { Db } from './db';
import { swaggerSpec } from './docs/swagger';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { bairrosRoutes } from './routes/bairros.routes';
import { leiturasRoutes } from './routes/leituras.routes';
import { sensoresRoutes } from './routes/sensores.routes';
import { BairroService } from './services/bairro.service';
import { LeituraService } from './services/leitura.service';
import { RiscoService } from './services/risco.service';
import { SensorService } from './services/sensor.service';

// Monta a aplicação recebendo a conexão com o banco (injeção de dependência): facilita os testes.
export function createApp(db: Db) {
  const bairros = new BairroService(db);
  const sensores = new SensorService(db);
  const leituras = new LeituraService(db);
  const risco = new RiscoService(db, bairros);

  const app = express();
  app.use(express.json());

  app.get('/', (_req, res) => res.redirect('/docs'));
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.get('/docs.json', (_req, res) => res.json(swaggerSpec));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/api/v1/bairros', bairrosRoutes(bairros, risco));
  app.use('/api/v1/sensores', sensoresRoutes(sensores));
  app.use('/api/v1/leituras', leiturasRoutes(leituras));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
