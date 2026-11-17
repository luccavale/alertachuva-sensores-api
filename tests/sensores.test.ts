import { criarAmbiente } from './helpers';

const { api, criarBairro, criarSensor } = criarAmbiente();

describe('Sensores', () => {
  it('cria um sensor ativo em um bairro existente (201)', async () => {
    const bairro = await criarBairro();
    const res = await api.post('/api/v1/sensores').send({ codigo: 'SENS-100', bairroId: bairro.id });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ codigo: 'SENS-100', bairroId: bairro.id, ativo: true });
  });

  it('devolve 404 ao criar sensor em bairro inexistente', async () => {
    const res = await api.post('/api/v1/sensores').send({ codigo: 'SENS-200', bairroId: 9999 });
    expect(res.status).toBe(404);
  });

  it('devolve 409 quando o código do sensor já existe', async () => {
    const bairro = await criarBairro();
    await api.post('/api/v1/sensores').send({ codigo: 'SENS-300', bairroId: bairro.id });
    const res = await api.post('/api/v1/sensores').send({ codigo: 'SENS-300', bairroId: bairro.id });
    expect(res.status).toBe(409);
  });

  it('devolve 400 quando faltam campos obrigatórios', async () => {
    const res = await api.post('/api/v1/sensores').send({ codigo: 'SENS-400' });
    expect(res.status).toBe(400);
  });

  it('filtra sensores por bairro', async () => {
    const a = await criarBairro('Bairro A');
    const b = await criarBairro('Bairro B');
    const sensorA = await criarSensor(a.id);
    await criarSensor(b.id);
    const res = await api.get(`/api/v1/sensores?bairroId=${a.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].id).toBe(sensorA.id);
  });

  it('atualiza e remove um sensor', async () => {
    const bairro = await criarBairro();
    const sensor = await criarSensor(bairro.id);
    const put = await api
      .put(`/api/v1/sensores/${sensor.id}`)
      .send({ codigo: sensor.codigo, bairroId: bairro.id, ativo: false, descricao: 'Desativado' });
    expect(put.status).toBe(200);
    expect(put.body.ativo).toBe(false);
    expect((await api.delete(`/api/v1/sensores/${sensor.id}`)).status).toBe(204);
    expect((await api.get(`/api/v1/sensores/${sensor.id}`)).status).toBe(404);
  });

  it('remove em cascata: apagar o bairro apaga seus sensores', async () => {
    const bairro = await criarBairro();
    const sensor = await criarSensor(bairro.id);
    await api.delete(`/api/v1/bairros/${bairro.id}`);
    expect((await api.get(`/api/v1/sensores/${sensor.id}`)).status).toBe(404);
  });
});
