import { and, eq, ne } from 'drizzle-orm';
import { Db } from '../db';
import { bairros, sensores } from '../db/schema';
import { ConflictError, NotFoundError } from '../errors/AppError';
import { SensorInput } from '../schemas';

export class SensorService {
  constructor(private readonly db: Db) {}

  private garantirBairro(bairroId: number): void {
    const bairro = this.db.select().from(bairros).where(eq(bairros.id, bairroId)).get();
    if (!bairro) throw new NotFoundError('Bairro não encontrado');
  }

  private garantirCodigoLivre(codigo: string, ignorarId?: number): void {
    const condicao = ignorarId
      ? and(eq(sensores.codigo, codigo), ne(sensores.id, ignorarId))
      : eq(sensores.codigo, codigo);
    if (this.db.select().from(sensores).where(condicao).get()) {
      throw new ConflictError('Já existe um sensor com este código');
    }
  }

  criar(dados: SensorInput) {
    this.garantirBairro(dados.bairroId);
    this.garantirCodigoLivre(dados.codigo);
    return this.db.insert(sensores).values(dados).returning().get();
  }

  listar(bairroId?: number) {
    const consulta = this.db.select().from(sensores);
    return (bairroId ? consulta.where(eq(sensores.bairroId, bairroId)) : consulta).orderBy(sensores.codigo).all();
  }

  buscarPorId(id: number) {
    const sensor = this.db.select().from(sensores).where(eq(sensores.id, id)).get();
    if (!sensor) throw new NotFoundError('Sensor não encontrado');
    return sensor;
  }

  atualizar(id: number, dados: SensorInput) {
    this.buscarPorId(id);
    this.garantirBairro(dados.bairroId);
    this.garantirCodigoLivre(dados.codigo, id);
    return this.db.update(sensores).set(dados).where(eq(sensores.id, id)).returning().get();
  }

  remover(id: number): void {
    this.buscarPorId(id);
    this.db.delete(sensores).where(eq(sensores.id, id)).run();
  }
}
