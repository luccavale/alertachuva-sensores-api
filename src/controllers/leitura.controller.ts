import { Request, Response } from 'express';
import { filtroLeituraSchema, leituraSchema } from '../schemas';
import { LeituraService } from '../services/leitura.service';

export class LeituraController {
  constructor(private readonly leituras: LeituraService) {}

  criar = (req: Request, res: Response) => {
    res.status(201).json(this.leituras.criar(leituraSchema.parse(req.body)));
  };

  listar = (req: Request, res: Response) => {
    res.json(this.leituras.listar(filtroLeituraSchema.parse(req.query)));
  };
}
