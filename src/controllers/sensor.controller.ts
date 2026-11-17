import { Request, Response } from 'express';
import { z } from 'zod';
import { idSchema, sensorSchema } from '../schemas';
import { SensorService } from '../services/sensor.service';

const filtroSchema = z.object({ bairroId: z.coerce.number().int().positive().optional() });

export class SensorController {
  constructor(private readonly sensores: SensorService) {}

  criar = (req: Request, res: Response) => {
    res.status(201).json(this.sensores.criar(sensorSchema.parse(req.body)));
  };

  listar = (req: Request, res: Response) => {
    const { bairroId } = filtroSchema.parse(req.query);
    res.json(this.sensores.listar(bairroId));
  };

  buscar = (req: Request, res: Response) => {
    res.json(this.sensores.buscarPorId(idSchema.parse(req.params.id)));
  };

  atualizar = (req: Request, res: Response) => {
    const id = idSchema.parse(req.params.id);
    res.json(this.sensores.atualizar(id, sensorSchema.parse(req.body)));
  };

  remover = (req: Request, res: Response) => {
    this.sensores.remover(idSchema.parse(req.params.id));
    res.status(204).send();
  };
}
