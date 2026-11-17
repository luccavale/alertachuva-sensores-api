import { Router } from 'express';
import { LeituraController } from '../controllers/leitura.controller';
import { LeituraService } from '../services/leitura.service';

export function leiturasRoutes(leituras: LeituraService): Router {
  const controller = new LeituraController(leituras);
  const router = Router();

  /**
   * @openapi
   * /api/v1/leituras:
   *   post:
   *     tags: [Leituras]
   *     summary: Registra uma leitura enviada por um sensor
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LeituraInput'
   *     responses:
   *       201:
   *         description: Leitura registrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Leitura'
   *       400:
   *         $ref: '#/components/responses/DadosInvalidos'
   *       404:
   *         $ref: '#/components/responses/NaoEncontrado'
   */
  router.post('/', controller.criar);

  /**
   * @openapi
   * /api/v1/leituras:
   *   get:
   *     tags: [Leituras]
   *     summary: Lista leituras, da mais recente para a mais antiga
   *     parameters:
   *       - in: query
   *         name: sensorId
   *         schema:
   *           type: integer
   *       - in: query
   *         name: bairroId
   *         schema:
   *           type: integer
   *       - in: query
   *         name: limite
   *         schema:
   *           type: integer
   *           default: 20
   *           maximum: 100
   *     responses:
   *       200:
   *         description: Lista de leituras
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Leitura'
   *       400:
   *         $ref: '#/components/responses/DadosInvalidos'
   */
  router.get('/', controller.listar);

  return router;
}
