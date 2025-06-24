# 📚 Book Collection API

Uma API RESTful simples para gerenciamento de uma coleção pessoal de livros. Desenvolvida com [Fastify](https://fastify.dev/), [Knex.js](https://knexjs.org/), [SQLite](https://www.sqlite.org/), e validada com [Zod](https://github.com/colinhacks/zod).

---

## 🚀 Funcionalidades

- Cadastro de usuários com autenticação via cookies
- Adição de livros com:
  - Título
  - Autor
  - Gênero
  - Ano de publicação
  - Status (`read`, `reading`, `want_to_read`)
  - Avaliação (1 a 5 estrelas)
  - Resenha opcional
- Edição e exclusão de livros
- Filtros por gênero, status e avaliação
- Ordenação personalizável
- Métricas da coleção:
  - Total de livros
  - Total por status
  - Distribuição por gênero
  - Média de avaliação

---

## 📆 Tecnologias

- **Node.js**
- **TypeScript**
- **Fastify**
- **Knex.js**
- **SQLite**
- **Zod**
- **Moment.js**
- **ESLint + Rocketseat config**
- **Vitest (testes)**

---

## 📁 Estrutura do Projeto

```
src/
├── database/          # Configuração do Knex e migrations
├── middlewares/       # Middlewares customizados (ex: sessão)
├── routes/            # Rotas da API (livros, usuários, etc.)
├── server.ts          # Ponto de entrada da aplicação
.env.example           # Exemplo de variáveis de ambiente
```

---

## ⚙️ Scripts

| Comando         | Descrição                                    |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Inicia o servidor em modo de desenvolvimento |
| `npm run knex`  | Executa a CLI do Knex (migrations etc.)      |
| `npm run lint`  | Analisa e corrige problemas de lint          |
| `npm run build` | Compila o projeto para produção              |
| `npm run test`  | Executa os testes com Vitest                 |

---

## 🗃️ Migrations

Rode todas as migrations:

```bash
npm run knex -- migrate:latest
```

---

## 🔐 Autenticação

- Utiliza cookies para gerenciar sessões (`sessionId`)
- Middleware `checkSessionIdExists` protege rotas privadas

---

## 🛠️ Requisitos

- Node.js 18+
- SQLite (já vem como dependência)

---
