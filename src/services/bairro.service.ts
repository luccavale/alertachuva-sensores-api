import { eq } from 'drizzle-orm';
import { Db } from '../db';
import { bairros } from '../db/schema';
import { NotFoundError } from '../errors/AppError';
import { BairroInput } from '../schemas';

export class BairroService {
  constructor(private readonly db: Db) {}

  criar(dados: BairroInput) {
    return this.db.insert(bairros).values(dados).returning().get();
  }

  listar() {
    return this.db.select().from(bairros).orderBy(bairros.nome).all();
  }

  buscarPorId(id: number) {
    const bairro = this.db.select().from(bairros).where(eq(bairros.id, id)).get();
    if (!bairro) throw new NotFoundError('Bairro não encontrado');
    return bairro;
  }

  atualizar(id: number, dados: BairroInput) {
    this.buscarPorId(id);
    return this.db.update(bairros).set(dados).where(eq(bairros.id, id)).returning().get();
  }

  remover(id: number): void {
    this.buscarPorId(id);
    this.db.delete(bairros).where(eq(bairros.id, id)).run();
  }
}
