# Registro de prompts (IA como copiloto)

Ferramenta usada: Claude (Anthropic). A IA foi usada para planejar a arquitetura e gerar a base do código, que foi revisada e testada pela equipe.

| # | Objetivo do prompt | O que foi feito com a resposta |
|---|---|---|
| 1 | Entender o que a disciplina de SOA pede na Global Solution e como encaixar na CitizenTech AlertaChuva | Definido o escopo: API de sensores, leituras e risco de enchente |
| 2 | Pedir um projeto **só de SOA**, independente das demais disciplinas, o mais simples possível para cumprir 100% da rubrica (domínio, banco, migrações, Swagger e testes) | Adotada a stack Node.js + Express + TypeScript + SQLite + Drizzle + Swagger + Jest |
| 3 | Gerar a estrutura do projeto, a migração inicial, os endpoints e os testes automatizados | Código revisado, executado localmente e testado com `npm test` |

> Preencher aqui, daqui para frente, qualquer novo prompt relevante usado no projeto.
