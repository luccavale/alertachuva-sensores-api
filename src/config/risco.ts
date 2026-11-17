// Limiares DIDÁTICOS usados para classificar o risco de enchente.
// Ficam em um único lugar para serem ajustados (ou substituídos pelo modelo de ML) sem mexer no resto do código.
export const LIMIARES_RISCO = {
  moderado: { chuvaMmH: 25, nivelAguaCm: 50 },
  alto: { chuvaMmH: 50, nivelAguaCm: 100 }
} as const;

// Faixas físicas aceitas para uma leitura (valores fora disso são rejeitados com 400).
export const FAIXAS_LEITURA = {
  chuvaMmH: { min: 0, max: 500 },
  nivelAguaCm: { min: 0, max: 1000 }
} as const;
