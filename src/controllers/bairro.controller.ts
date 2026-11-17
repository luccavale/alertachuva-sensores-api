import { Request, Response } from 'express';
import { bairroSchema, idSchema } from '../schemas';
import { BairroService } from '../services/bairro.service';
import { RiscoService } from '../services/risco.service';

export class BairroController {
  constructor(
    private readonly bairros: BairroService,
    private readonly risco: RiscoService
  ) {}

  criar = (req: Request, res: Response) => {
    const dados = bairroSchema.parse(req.body);
    res.status(201).json(this.bairros.criar(dados));
  };

  listar = (_req: Request, res: Response) => {
    res.json(this.bairros.listar());
  };

  buscar = (req: Request, res: Response) => {
    res.json(this.bairros.buscarPorId(idSchema.parse(req.params.id)));
  };

  atualizar = (req: Request, res: Response) => {
    const id = idSchema.parse(req.params.id);
    res.json(this.bairros.atualizar(id, bairroSchema.parse(req.body)));
  };

  remover = (req: Request, res: Response) => {
    this.bairros.remover(idSchema.parse(req.params.id));
    res.status(204).send();
  };

  calcularRisco = (req: Request, res: Response) => {
    res.json(this.risco.calcular(idSchema.parse(req.params.id)));
  };
}
