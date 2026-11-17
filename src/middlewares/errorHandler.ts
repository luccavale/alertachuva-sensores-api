import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ erro: 'Rota não encontrada' });
}

// Tratamento de erros centralizado: todas as respostas de erro seguem o formato { erro, detalhes? }.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      erro: 'Dados inválidos',
      detalhes: err.issues.map(i => ({ campo: i.path.join('.'), mensagem: i.message }))
    });
    return;
  }
  if (err instanceof AppError) {
    res.status(err.status).json({ erro: err.message });
    return;
  }
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ erro: 'JSON inválido' });
    return;
  }
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
}
