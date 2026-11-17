import { criarAmbiente } from './helpers';

const { api, criarBairro } = criarAmbiente();

describe('Bairros', () => {
  it('cria um bairro e devolve 201 com id e cidade padrão', async () => {
    const res = await api.post('/api/v1/bairros').send({ nome: 'Jardim Exemplo' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ nome: 'Jardim Exemplo', cidade: 'São Paulo' });
    expect(res.body.id).toBeDefined();
  });

  it('rejeita nome curto com 400 e detalhes do campo', async () => {
    const res = await api.post('/api/v1/bairros').send({ nome: 'A' });
    expect(res.status).toBe(400);
    expect(res.body.erro).toBe('Dados inválidos');
    expect(res.body.detalhes[0].campo).toBe('nome');
  });

  it('lista os bairros cadastrados', async () => {
    await criarBairro('Bairro Lista');
    const res = await api.get('/api/v1/bairros');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('busca por id e devolve 404 quando não existe', async () => {
    const bairro = await criarBairro();
    expect((await api.get(`/api/v1/bairros/${bairro.id}`)).status).toBe(200);
    const res = await api.get('/api/v1/bairros/9999');
    expect(res.status).toBe(404);
    expect(res.body.erro).toBe('Bairro não encontrado');
  });

  it('devolve 400 quando o id não é numérico', async () => {
    const res = await api.get('/api/v1/bairros/abc');
    expect(res.status).toBe(400);
  });

  it('atualiza um bairro com PUT', async () => {
    const bairro = await criarBairro();
    const res = await api.put(`/api/v1/bairros/${bairro.id}`).send({ nome: 'Nome Atualizado' });
    expect(res.status).toBe(200);
    expect(res.body.nome).toBe('Nome Atualizado');
  });

  it('remove um bairro (204) e depois não o encontra (404)', async () => {
    const bairro = await criarBairro();
    expect((await api.delete(`/api/v1/bairros/${bairro.id}`)).status).toBe(204);
    expect((await api.get(`/api/v1/bairros/${bairro.id}`)).status).toBe(404);
  });
});
