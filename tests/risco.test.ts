import { classificarRisco } from '../src/services/risco.service';
import { criarAmbiente } from './helpers';

const { api, criarBairro, criarSensor, enviarLeitura } = criarAmbiente();

describe('classificarRisco (regra de negócio)', () => {
  it.each([
    [5, 20, 'Baixo'],
    [30, 20, 'Moderado'],
    [5, 60, 'Moderado'],
    [60, 20, 'Alto'],
    [5, 120, 'Alto']
  ])('chuva %p mm/h e nível %p cm => %s', (chuva, nivel, esperado) => {
    expect(classificarRisco(chuva, nivel)).toBe(esperado);
  });
});

describe('GET /api/v1/bairros/:id/risco', () => {
  it('calcula o risco a partir da leitura mais recente do bairro', async () => {
    const bairro = await criarBairro('Bairro Risco');
    const sensor = await criarSensor(bairro.id);
    await enviarLeitura(sensor.id, 5, 20, '2026-11-12T10:00:00.000Z');
    await enviarLeitura(sensor.id, 85, 120, '2026-11-12T11:00:00.000Z');

    const res = await api.get(`/api/v1/bairros/${bairro.id}/risco`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ bairro: 'Bairro Risco', nivelRisco: 'Alto', chuvaMmH: 85, nivelAguaCm: 120 });
  });

  it('devolve 404 quando o bairro ainda não tem leituras', async () => {
    const bairro = await criarBairro('Bairro Sem Leituras');
    const res = await api.get(`/api/v1/bairros/${bairro.id}/risco`);
    expect(res.status).toBe(404);
    expect(res.body.erro).toBe('Nenhuma leitura registrada para este bairro');
  });

  it('devolve 404 quando o bairro não existe', async () => {
    expect((await api.get('/api/v1/bairros/9999/risco')).status).toBe(404);
  });
});
