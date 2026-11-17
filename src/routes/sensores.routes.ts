import { Router } from 'express';
import { SensorController } from '../controllers/sensor.controller';
import { SensorService } from '../services/sensor.service';

export function sensoresRoutes(sensores: SensorService): Router {
  const controller = new SensorController(sensores);
  const router = Router();

  /**
   * @openapi
   * /api/v1/sensores:
   *   post:
   *     tags: [Sensores]
   *     summary: Cadastra um sensor em um bairro
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SensorInput'
   *     responses:
   *       201:
   *         description: Sensor criado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Sensor'
   *       400:
   *         $ref: '#/components/responses/DadosInvalidos'
   *       404:
   *         $ref: '#/components/responses/NaoEncontrado'
   *       409:
   *         $ref: '#/components/responses/Conflito'
   */
  router.post('/', controller.criar);

  /**
   * @openapi
   * /api/v1/sensores:
   *   get:
   *     tags: [Sensores]
   *     summary: Lista os sensores (opcionalmente de um bairro)
   *     parameters:
   *       - in: query
   *         name: bairroId
   *         schema:
   *           type: integer
   *         description: Filtra pelos sensores de um bairro
   *     responses:
   *       200:
   *         description: Lista de sensores
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Sensor'
   */
  router.get('/', controller.listar);

  /**
   * @openapi
   * /api/v1/sensores/{id}:
   *   get:
   *     tags: [Sensores]
   *     summary: Busca um sensor pelo id
   *     parameters:
   *       - $ref: '#/components/parameters/Id'
   *     responses:
   *       200:
   *         description: Sensor encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Sensor'
   *       404:
   *         $ref: '#/components/responses/NaoEncontrado'
   */
  router.get('/:id', controller.buscar);

  /**
   * @openapi
   * /api/v1/sensores/{id}:
   *   put:
   *     tags: [Sensores]
   *     summary: Atualiza um sensor
   *     parameters:
   *       - $ref: '#/components/parameters/Id'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SensorInput'
   *     responses:
   *       200:
   *         description: Sensor atualizado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Sensor'
   *       400:
   *         $ref: '#/components/responses/DadosInvalidos'
   *       404:
   *         $ref: '#/components/responses/NaoEncontrado'
   *       409:
   *         $ref: '#/components/responses/Conflito'
   */
  router.put('/:id', controller.atualizar);

  /**
   * @openapi
   * /api/v1/sensores/{id}:
   *   delete:
   *     tags: [Sensores]
   *     summary: Remove um sensor (e suas leituras)
   *     parameters:
   *       - $ref: '#/components/parameters/Id'
   *     responses:
   *       204:
   *         description: Sensor removido
   *       404:
   *         $ref: '#/components/responses/NaoEncontrado'
   */
  router.delete('/:id', controller.remover);

  return router;
}
