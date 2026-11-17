import { Router } from 'express';
import { BairroController } from '../controllers/bairro.controller';
import { BairroService } from '../services/bairro.service';
import { RiscoService } from '../services/risco.service';

export function bairrosRoutes(bairros: BairroService, risco: RiscoService): Router {
  const controller = new BairroController(bairros, risco);
  const router = Router();

  /**
   * @openapi
   * /api/v1/bairros:
   *   post:
   *     tags: [Bairros]
   *     summary: Cadastra um bairro
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/BairroInput'
   *     responses:
   *       201:
   *         description: Bairro criado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Bairro'
   *       400:
   *         $ref: '#/components/responses/DadosInvalidos'
   */
  router.post('/', controller.criar);

  /**
   * @openapi
   * /api/v1/bairros:
   *   get:
   *     tags: [Bairros]
   *     summary: Lista os bairros
   *     responses:
   *       200:
   *         description: Lista de bairros
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Bairro'
   */
  router.get('/', controller.listar);

  /**
   * @openapi
   * /api/v1/bairros/{id}:
   *   get:
   *     tags: [Bairros]
   *     summary: Busca um bairro pelo id
   *     parameters:
   *       - $ref: '#/components/parameters/Id'
   *     responses:
   *       200:
   *         description: Bairro encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Bairro'
   *       400:
   *         $ref: '#/components/responses/DadosInvalidos'
   *       404:
   *         $ref: '#/components/responses/NaoEncontrado'
   */
  router.get('/:id', controller.buscar);

  /**
   * @openapi
   * /api/v1/bairros/{id}:
   *   put:
   *     tags: [Bairros]
   *     summary: Atualiza um bairro
   *     parameters:
   *       - $ref: '#/components/parameters/Id'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/BairroInput'
   *     responses:
   *       200:
   *         description: Bairro atualizado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Bairro'
   *       400:
   *         $ref: '#/components/responses/DadosInvalidos'
   *       404:
   *         $ref: '#/components/responses/NaoEncontrado'
   */
  router.put('/:id', controller.atualizar);

  /**
   * @openapi
   * /api/v1/bairros/{id}:
   *   delete:
   *     tags: [Bairros]
   *     summary: Remove um bairro (e seus sensores e leituras)
   *     parameters:
   *       - $ref: '#/components/parameters/Id'
   *     responses:
   *       204:
   *         description: Bairro removido
   *       404:
   *         $ref: '#/components/responses/NaoEncontrado'
   */
  router.delete('/:id', controller.remover);

  /**
   * @openapi
   * /api/v1/bairros/{id}/risco:
   *   get:
   *     tags: [Bairros]
   *     summary: Calcula o risco de enchente do bairro com base na leitura mais recente
   *     parameters:
   *       - $ref: '#/components/parameters/Id'
   *     responses:
   *       200:
   *         description: Risco calculado (Baixo, Moderado ou Alto)
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Risco'
   *       404:
   *         description: Bairro não encontrado ou sem leituras
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Erro'
   */
  router.get('/:id/risco', controller.calcularRisco);

  return router;
}
