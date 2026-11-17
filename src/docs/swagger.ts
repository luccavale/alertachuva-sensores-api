import path from 'node:path';
import swaggerJsdoc from 'swagger-jsdoc';
// O glob precisa usar barras normais ("/"), inclusive no Windows.
const ROTAS_GLOB = path.join(__dirname, '../routes/*.{ts,js}').split(path.sep).join('/');

// Documentação gerada automaticamente a partir dos comentários @openapi das rotas.
export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'AlertaChuva - API de Sensores',
      version: '1.0.0',
      description:
        'API REST (SOA e Web Services) do AlertaChuva, Global Solution FIAP 2026.2. ' +
        'Gerencia bairros, sensores de chuva/nível de água e leituras, e calcula o risco de enchente por bairro.'
    },
    tags: [
      { name: 'Bairros', description: 'Bairros monitorados e risco de enchente' },
      { name: 'Sensores', description: 'Sensores instalados nos bairros' },
      { name: 'Leituras', description: 'Leituras de chuva e nível da água' }
    ],
    components: {
      parameters: {
        Id: {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer', minimum: 1 },
          description: 'Identificador do recurso'
        }
      },
      responses: {
        DadosInvalidos: {
          description: 'Dados inválidos',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } }
        },
        NaoEncontrado: {
          description: 'Recurso não encontrado',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } }
        },
        Conflito: {
          description: 'Conflito (registro duplicado)',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } }
        }
      },
      schemas: {
        Erro: {
          type: 'object',
          properties: {
            erro: { type: 'string', example: 'Dados inválidos' },
            detalhes: {
              type: 'array',
              items: {
                type: 'object',
                properties: { campo: { type: 'string' }, mensagem: { type: 'string' } }
              }
            }
          }
        },
        BairroInput: {
          type: 'object',
          required: ['nome'],
          properties: {
            nome: { type: 'string', example: 'Bairro Exemplo' },
            cidade: { type: 'string', example: 'São Paulo', default: 'São Paulo' }
          }
        },
        Bairro: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Bairro Exemplo' },
            cidade: { type: 'string', example: 'São Paulo' },
            criadoEm: { type: 'string', example: '2026-11-12 14:30:00' }
          }
        },
        SensorInput: {
          type: 'object',
          required: ['codigo', 'bairroId'],
          properties: {
            codigo: { type: 'string', example: 'SENS-001' },
            descricao: { type: 'string', example: 'Sensor de chuva e nível de água (ESP32)' },
            bairroId: { type: 'integer', example: 1 },
            ativo: { type: 'boolean', default: true }
          }
        },
        Sensor: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            codigo: { type: 'string', example: 'SENS-001' },
            descricao: { type: 'string', nullable: true },
            ativo: { type: 'boolean' },
            bairroId: { type: 'integer', example: 1 }
          }
        },
        LeituraInput: {
          type: 'object',
          required: ['sensorId', 'chuvaMmH', 'nivelAguaCm'],
          properties: {
            sensorId: { type: 'integer', example: 1 },
            chuvaMmH: { type: 'number', minimum: 0, maximum: 500, example: 12.5 },
            nivelAguaCm: { type: 'number', minimum: 0, maximum: 1000, example: 35 },
            registradaEm: {
              type: 'string',
              format: 'date-time',
              description: 'Opcional. Se omitido, usa a data/hora atual.'
            }
          }
        },
        Leitura: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            sensorId: { type: 'integer', example: 1 },
            chuvaMmH: { type: 'number', example: 12.5 },
            nivelAguaCm: { type: 'number', example: 35 },
            registradaEm: { type: 'string', format: 'date-time' }
          }
        },
        Risco: {
          type: 'object',
          properties: {
            bairroId: { type: 'integer', example: 1 },
            bairro: { type: 'string', example: 'Bairro Exemplo' },
            nivelRisco: { type: 'string', enum: ['Baixo', 'Moderado', 'Alto'], example: 'Moderado' },
            chuvaMmH: { type: 'number', example: 30 },
            nivelAguaCm: { type: 'number', example: 55 },
            leituraEm: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: [ROTAS_GLOB]
});
