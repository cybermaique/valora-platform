# 🛒 Valora Platform

Valora Platform é um marketplace full-stack com precificação dinâmica, controle inteligente de estoque e engine de recomendação baseada em comportamento do usuário e demanda do produto.

O objetivo principal é demonstrar boas práticas de engenharia de software moderna, aplicadas em um produto realista, escalável e observável, combinando arquitetura limpa, DDD leve, otimizações de banco e pipeline completo de CI/CD.

Este projeto é open source e documentado publicamente para fins de estudo, portfólio e colaboração com a comunidade.

## 📌 Visão Geral do Produto

O Valora Platform ajusta os preços automaticamente com base em múltiplos fatores:

- 📈 Demanda do produto em tempo real
- 📦 Nível de estoque e velocidade de giro
- 🎯 Regras estratégicas definidas por categoria
- 👤 Comportamento do usuário (engajamento, carrinho, abandono)
- 🗓️ Sazonalidade (eventos, feriados e campanhas promocionais)

Além disso, o sistema inclui uma engine de recomendação que entrega sugestões personalizadas de produtos e combinações com maior probabilidade de conversão.

🎯 **Foco principal:** inteligência de negócio + engenharia sênior + escalabilidade real

## 🧠 Arquitetura e Tecnologias

### 🧩 Backend

- Node.js + NestJS + TypeScript
- Prisma ORM + PostgreSQL
- Domain-Driven Design leve (DDD)
- Clean Architecture + princípios SOLID
- Redis para cache e controle de locks de preço
- Eventos de domínio e Outbox Pattern (preparado para microsserviços)
- Jest e Supertest para testes unitários e e2e
- Swagger (OpenAPI) para contratos e testes manuais

### 💻 Frontend

- React + Next.js (App Router)
- SSR + SSG + ISR (renderização híbrida por criticidade)
- Zustand para controle de estado leve
- React Query para caching e invalidação de dados
- Tailwind CSS + Radix UI para consistência visual
- MSW (Mock Service Worker) para desenvolvimento desacoplado

### ⚙️ DevOps e Observabilidade

- Docker + Docker Compose
- CI/CD com Azure Pipelines (lint, build, test, migrations e deploy automatizado)
- Azure Static Web Apps + Azure Functions (deploy serverless)
- Application Insights + OpenTelemetry: métricas, logs e tracing distribuído
- Husky + Lint-Staged + Commitlint: consistência de commits e qualidade de código

## 📂 Estrutura do Monorepo

```
valoraplatform/
├── apps/
│   ├── api/        # NestJS + Prisma (backend)
│   └── web/        # Next.js (frontend)
├── .github/        # Pipelines CI/CD e templates de PR
└── README.md
```

## 🚀 Roadmap de Desenvolvimento

### ✅ Fase 0 — Setup e Fundamentos

- Monorepo com workspaces (API + Web)
- TypeScript configurado
- ESLint, Prettier, Husky e Commitlint
- Prisma + PostgreSQL + Seed inicial
- Ambiente Docker local

### 🔜 Fase 1 — Autenticação + RBAC

- Registro e Login via JWT (Access + Refresh HttpOnly)
- Perfis: USER e ADMIN
- Proteção de rotas e contexto de sessão SSR no Next.js
- Testes unitários e integração

### 🔜 Fase 2 — Catálogo de Produtos

- CRUD completo de produtos, categorias e estoque
- Páginas: Home, Categoria, Detalhes (PDP)
- Renderização híbrida (SSG + ISR)
- Indexação otimizada (SEO + prefetch)
- Upload de imagens via Azure Blob Storage

### 🔜 Fase 3 — Pricing Engine (MVP)

- Pipeline determinístico de precificação:
  - Estoque, demanda, sazonalidade e regras de negócio
- Cache quente com Redis
- GET /pricing/quote e POST /pricing/lock
- Price Journal com versionamento e explicabilidade (explain)
- Métricas: p95 ≤ 150 ms, taxa de acerto de cache ≥ 80%

### 🔜 Fase 4 — Carrinho + Checkout

- Lock de preço com TTL e idempotência
- Conciliação com estoque real
- Otimistic locking e rollback
- Fluxo completo de pedido (Payment stub)
- Página de confirmação

### 🔜 Fase 5 — Engine de Recomendação

- Coleta de eventos (/events/ux)
- Heurísticas responsivas (abandonos, cliques, dwell time)
- Recomendação por categoria e afinidade
- A/B testing e logging de resultados

### 🔜 Fase 6 — Observabilidade e Segurança

- Dashboard técnico: métricas de pricing, cache, lock e erros
- Logging estruturado com traceId
- Helmet, CORS restrito, Rate Limiting
- Auditoria de alterações de preço
- Logs de compliance e rollback seguro

### 🔜 Fase 7 — Design System + Storybook

- Biblioteca de componentes UI com tokens de design
- Documentação visual no Storybook
- Publicação no NPM

## 🧪 Scripts Disponíveis

### API (NestJS)

```bash
cd apps/api
npm run start:dev      # modo desenvolvimento
npm run build          # compila para produção
npm run test           # roda testes unitários
npm run prisma:migrate # aplica migrações
npm run prisma:seed    # popula dados iniciais
```

### Web (Next.js)

```bash
cd apps/web
npm run dev     # ambiente local
npm run build   # build de produção
npm run start   # servidor em produção
```

## 📦 Banco de Dados

- Banco: PostgreSQL
- ORM: Prisma

`.env` exemplo:

```
DATABASE_URL="postgresql://user:password@localhost:5432/valoraplatform"
JWT_SECRET="seu-segredo-aqui"
COOKIE_DOMAIN="localhost"
COOKIE_SECURE=false
```

Executar migrações:

```bash
npx prisma migrate dev
```

Popular dados iniciais:

```bash
npm run prisma:seed
```

## 🔄 Integração Contínua (CI/CD)

Pipeline executa automaticamente:

| Etapa                    | Descrição                               | Status |
| ------------------------ | --------------------------------------- | :----: |
| 🧹 Lint + Type Check     | Verificação estática de código          |   ✅   |
| 🧪 Testes Unitários      | Testes automatizados no backend e front |   🔜   |
| 🚀 Build + Preview Deploy | Build completo e deploy para ambiente teste |   🔜   |
| ☁️ Deploy Produção       | Deploy automatizado em Azure            |   🔜   |

## 🧩 Padrões de Código e Commits

- Conventional Commits (feat:, fix:, chore:, refactor: etc.)
- Commitlint impede commits fora do padrão
- Pre-commit hooks (Husky + Lint-Staged) garantem qualidade antes do push

## 👨‍💻 Contribuição

Contribuições são bem-vindas!

1. Crie sua branch:

   ```bash
   git checkout -b feature/nome-da-feature
   ```

2. Faça commit seguindo o padrão:

   ```bash
   feat(api-pricing): implement dynamic pricing rules
   ```

3. Abra um Pull Request descrevendo o que foi feito.

## 📊 Observabilidade e Logs

- Application Insights / OpenTelemetry configurado para tracing distribuído
- Logs estruturados com:
  - traceId
  - quoteId
  - ruleVersion
  - modelVersion
- Painel de métricas:
  - p95 de latência
  - acerto de cache
  - falhas de lock
  - rollback de preço

## 📄 Licença

Licença MIT — livre para uso e modificação.

## ✨ Autor

Desenvolvido por Maique Moraes

📍 Florianópolis/SC — Brasil

Desenvolvedor Full Stack Sênior | React, Next, Node, Nest, DDD, CI/CD e Azure

Se este projeto te inspirar, deixe uma ⭐ no repositório e acompanhe as próximas entregas 🚀
