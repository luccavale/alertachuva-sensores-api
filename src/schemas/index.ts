import { z } from 'zod';
import { FAIXAS_LEITURA } from '../config/risco';

export const idSchema = z.coerce.number().int('O id deve ser um número inteiro').positive('O id deve ser positivo');

export const bairroSchema = z.object({
  nome: z.string().trim().min(2, 'O nome deve ter ao menos 2 caracteres').max(100),
  cidade: z.string().trim().min(2).max(100).default('São Paulo')
});

export const sensorSchema = z.object({
  codigo: z.string().trim().min(3, 'O código deve ter ao menos 3 caracteres').max(30),
  descricao: z.string().trim().max(200).optional(),
  bairroId: z.number().int().positive(),
  ativo: z.boolean().default(true)
});

export const leituraSchema = z.object({
  sensorId: z.number().int().positive(),
  chuvaMmH: z
    .number()
    .min(FAIXAS_LEITURA.chuvaMmH.min, 'A chuva não pode ser negativa')
    .max(FAIXAS_LEITURA.chuvaMmH.max, `A chuva deve ser no máximo ${FAIXAS_LEITURA.chuvaMmH.max} mm/h`),
  nivelAguaCm: z
    .number()
    .min(FAIXAS_LEITURA.nivelAguaCm.min, 'O nível da água não pode ser negativo')
    .max(FAIXAS_LEITURA.nivelAguaCm.max, `O nível da água deve ser no máximo ${FAIXAS_LEITURA.nivelAguaCm.max} cm`),
  registradaEm: z.string().datetime({ message: 'Use uma data no formato ISO 8601' }).optional()
});

export const filtroLeituraSchema = z.object({
  sensorId: z.coerce.number().int().positive().optional(),
  bairroId: z.coerce.number().int().positive().optional(),
  limite: z.coerce.number().int().min(1).max(100).default(20)
});

export type BairroInput = z.infer<typeof bairroSchema>;
export type SensorInput = z.infer<typeof sensorSchema>;
export type LeituraInput = z.infer<typeof leituraSchema>;
export type FiltroLeitura = z.infer<typeof filtroLeituraSchema>;
