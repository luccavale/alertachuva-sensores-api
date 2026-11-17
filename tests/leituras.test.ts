import { criarAmbiente } from './helpers';

const { api, criarBairro, criarSensor, enviarLeitura } = criarAmbiente();

describe('Leituras', () => {
  it('registra uma leitura válida (201) com data/hora', async () => {
    const sensor = await criarSensor((await criarBairro()).id);
    const res = await enviarLeitura(sensor.id, 12.5, 35);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ sensorId: sensor.id, chuvaMmH: 12.5, nivelAguaCm: 35 });
    expect(res.body.registradaEm).toBeDefined();
  });

  it('rejeita nível da água negativo com 400', async () => {
    const sensor = await criarSensor((await criarBairro()).id);
    const res = await enviarLeitura(sensor.id, 12.5, -50);
    expect(res.status).toBe(400);
    expect(res.body.detalhes[0].campo).toBe('nivelAguaCm');
  });

  it('rejeita chuva acima da faixa física com 400', async () => {
    const sensor = await criarSensor((await criarBairro()).id);
    expect((await enviarLeitura(sensor.id, 9999, 10)).status).toBe(400);
  });

  it('devolve 404 quando o sensor não existe', async () => {
    expect((await enviarLeitura(9999, 10, 10)).status).toBe(404);
  });

  it('lista as leituras da mais recente para a mais antiga, com filtro por bairro', async () => {
    const bairro = await criarBairro();
    const sensor = await criarSensor(bairro.id);
    await enviarLeitura(sensor.id, 1, 1, '2026-11-12T10:00:00.000Z');
    await enviarLeitura(sensor.id, 2, 2, '2026-11-12T11:00:00.000Z');
    const res = await api.get(`/api/v1/leituras?bairroId=${bairro.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].chuvaMmH).toBe(2);
  });

  it('respeita o parâmetro limite e rejeita limite inválido', async () => {
    const sensor = await criarSensor((await criarBairro()).id);
    await enviarLeitura(sensor.id, 1, 1);
    await enviarLeitura(sensor.id, 2, 2);
    const res = await api.get(`/api/v1/leituras?sensorId=${sensor.id}&limite=1`);
    expect(res.body).toHaveLength(1);
    expect((await api.get('/api/v1/leituras?limite=0')).status).toBe(400);
  });
});
