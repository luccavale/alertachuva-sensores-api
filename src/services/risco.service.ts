import { desc, eq } from 'drizzle-orm';
import { LIMIARES_RISCO } from '../config/risco';
import { Db } from '../db';
import { leituras, sensores } from '../db/schema';
import { NotFoundError } from '../errors/AppError';
import { BairroService } from './bairro.service';

export type NivelRisco = 'Baixo' | 'Moderado' | 'Alto';

// Regra de negócio: classifica o risco de enchente a partir da chuva (mm/h) e do nível da água (cm).
export function classificarRisco(chuvaMmH: number, nivelAguaCm: number): NivelRisco {
  const { alto, moderado } = LIMIARES_RISCO;
  if (chuvaMmH >= alto.chuvaMmH || nivelAguaCm >= alto.nivelAguaCm) return 'Alto';
  if (chuvaMmH >= moderado.chuvaMmH || nivelAguaCm >= moderado.nivelAguaCm) return 'Moderado';
  return 'Baixo';
}

export class RiscoService {
  constructor(
    private readonly db: Db,
    private readonly bairroService: BairroService
  ) {}

  // Usa a leitura mais recente entre todos os sensores do bairro.
  calcular(bairroId: number) {
    const bairro = this.bairroService.buscarPorId(bairroId);

    const ultima = this.db
      .select({ leitura: leituras })
      .from(leituras)
      .innerJoin(sensores, eq(leituras.sensorId, sensores.id))
      .where(eq(sensores.bairroId, bairroId))
      .orderBy(desc(leituras.registradaEm), desc(leituras.id))
      .limit(1)
      .get();

    if (!ultima) throw new NotFoundError('Nenhuma leitura registrada para este bairro');

    const { leitura } = ultima;
    return {
      bairroId: bairro.id,
      bairro: bairro.nome,
      nivelRisco: classificarRisco(leitura.chuvaMmH, leitura.nivelAguaCm),
      chuvaMmH: leitura.chuvaMmH,
      nivelAguaCm: leitura.nivelAguaCm,
      leituraEm: leitura.registradaEm
    };
  }
}
