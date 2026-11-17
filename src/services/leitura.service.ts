import { and, desc, eq, getTableColumns } from 'drizzle-orm';
import { Db } from '../db';
import { leituras, sensores } from '../db/schema';
import { NotFoundError } from '../errors/AppError';
import { FiltroLeitura, LeituraInput } from '../schemas';

export class LeituraService {
  constructor(private readonly db: Db) {}

  criar(dados: LeituraInput) {
    const sensor = this.db.select().from(sensores).where(eq(sensores.id, dados.sensorId)).get();
    if (!sensor) throw new NotFoundError('Sensor não encontrado');

    return this.db
      .insert(leituras)
      .values({
        sensorId: dados.sensorId,
        chuvaMmH: dados.chuvaMmH,
        nivelAguaCm: dados.nivelAguaCm,
        registradaEm: dados.registradaEm ? new Date(dados.registradaEm).toISOString() : new Date().toISOString()
      })
      .returning()
      .get();
  }

  // Leituras mais recentes primeiro; filtros opcionais por sensor e por bairro.
  listar(filtro: FiltroLeitura) {
    const condicoes = [];
    if (filtro.sensorId) condicoes.push(eq(leituras.sensorId, filtro.sensorId));
    if (filtro.bairroId) condicoes.push(eq(sensores.bairroId, filtro.bairroId));

    return this.db
      .select(getTableColumns(leituras))
      .from(leituras)
      .innerJoin(sensores, eq(leituras.sensorId, sensores.id))
      .where(condicoes.length ? and(...condicoes) : undefined)
      .orderBy(desc(leituras.registradaEm), desc(leituras.id))
      .limit(filtro.limite)
      .all();
  }
}
