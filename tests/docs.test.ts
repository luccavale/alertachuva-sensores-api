import { criarAmbiente } from './helpers';

const { api } = criarAmbiente();

describe('Documentação automática (Swagger)', () => {
  it('expõe o OpenAPI com os endpoints das rotas anotadas', async () => {
    const res = await api.get('/docs.json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe('3.0.3');
    expect(Object.keys(res.body.paths)).toEqual(
      expect.arrayContaining([
        '/api/v1/bairros',
        '/api/v1/bairros/{id}/risco',
        '/api/v1/sensores',
        '/api/v1/leituras'
      ])
    );
  });

  it('serve a interface do Swagger UI em /docs e responde rota inexistente com 404', async () => {
    expect((await api.get('/docs/')).status).toBe(200);
    expect((await api.get('/rota-que-nao-existe')).status).toBe(404);
  });
});
