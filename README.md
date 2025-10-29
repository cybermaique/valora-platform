# 🛒 Valora Platform

**Valora Platform** é um marketplace full-stack com **precificação dinâmica**, controle inteligente de estoque e **sistema de recomendação** baseado em comportamento do usuário e demanda do produto.

O objetivo principal é demonstrar **boas práticas de engenharia de software** aplicadas em um produto real, incluindo arquitetura limpa, DDD leve, otimizações de banco e pipeline completo de CI/CD.

Este projeto é **open source** e documentado publicamente para fins de estudo, portfólio e colaboração com a comunidade.

---

## 📌 Visão Geral do Produto

O Valora Platform ajusta preços automaticamente com base em:
- Demanda do produto
- Disponibilidade em estoque
- Regra estratégica por categoria
- Comportamento do usuário
- Sazonalidade (promoções, eventos, datas)

Além disso, os usuários recebem **recomendações personalizadas** que aumentam a conversão do funil de compras.

🎯 Foco em **inteligência de negócio** + **engenharia sênior** + **escalabilidade**.

---

## 🧠 Tecnologias e Arquitetura

### Backend
- **Node.js + NestJS + TypeScript**
- **Prisma ORM**
- **PostgreSQL** (tuning de performance, índices compostos)
- **Domain-Driven Design leve**
- **Clean Architecture + SOLID**
- **Eventos de domínio para evolução a microsserviços**
- Testes com **Jest**

### Frontend
- **React + Next.js (App Router)**
- **SSR + SSG + ISR** por criticidade da página
- **Zustand** para estado de UI e sessão
- UX otimizada para funil de compras

### DevOps e Observabilidade
- **CI/CD com Azure Pipelines**
- Deploy serverless em **Azure Static Web Apps + Azure Functions**
- **Application Insights**: logs estruturados, métricas e tracing
- Auditoria e segurança orientadas a produto de missão crítica

---

## 📂 Estrutura do Monorepo

```
valoraplatform/
├── apps/
│   ├── api/      # NestJS + Prisma (backend)
│   └── web/      # Next.js (frontend - App Router)
├── packages/     # libs internas (futuro: design system, DTOs, configs)
├── .github/      # CI/CD, PR templates, workflows (em breve)
└── README.md

```

## 🚀 Roadmap

### ✅ Fase 0
Monorepo configurado com API + Web e testes iniciais

### 🔜 Fase 1 — Autenticação + RBAC
- Registro/Login
- Refresh token seguro
- Perfis: `USER` e `ADMIN`
- Sessão validada no servidor (Next.js SSR)

### 🔜 Fase 2 — Catálogo
- Produtos, categorias, imagens, estoque
- Lista com SSG + ISR
- PDP (Product Details Page) SSR

### 🔜 Fase 3 — Pricing Engine
- Regras dinâmicas com prioridade
- PriceSnapshot no add-to-cart

### 🔜 Fase 4 — Carrinho + Checkout
- Conexão com estoque real
- Conciliação de concorrência (optimistic locking)
- Status de pedido

### 🔜 Fase 5 — Recomendação
- Coleta de eventos
- Recomendações contextualizadas

### 🔜 Fase 6 — Observabilidade + Segurança
- Auditoria de domínio
- Logging e tracing distribuído

### 🔜 Fase 7 — Design System + Storybook
- UI Components Library independente
- Publicação NPM

---

## ✅ Scripts Disponíveis

### API (NestJS)
```bash
cd apps/api
npm run start:dev    
npm run test         
npm run prisma       
```

### WEB (Next.js)

```bash
cd apps/web
npm run dev          # desenvolvimento
npm run build        # build
npm run start        # produção
```

---

## 📦 Banco de Dados

Tecnologia: **PostgreSQL**

Gerenciamento de Schema: **Prisma Migrations**

Configurar `.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/valoraplatform"
```

Rodar migrações:

```bash
cd apps/api
npx prisma migrate dev
```

Popular dados iniciais:

```bash
npm run prisma:seed
```

---

## ✅ CI/CD

Pipeline com Azure Pipelines executará:

| Etapa                | Status |
| -------------------- | :----: |
| Lint + Type Checking |    ✅   |
| Testes Unitários     |   🔜   |
| E2E / Preview Deploy |   🔜   |
| Deploy Prod          |   🔜   |

---

## 👨‍💻 Contribuição

Contribuições são bem-vindas!

1. Crie sua **branch**:

```bash
git checkout -b feature/nome-da-feature
```

2. Faça commit seguindo **Conventional Commits**:

```bash
feat(api-auth): implement login with jwt
```

3. Abra um **Pull Request**

---

## 📄 Licença

MIT — totalmente liberado para estudo e aprimoramento.

---

## ✨ Autor

Desenvolvido por [**Maique Moraes**](https://www.linkedin.com/in/maique-moraes/)
📌 Desenvolvedor Fullstack Sênior | React, Next, Node & Nest | Arquitetura, SSR, CI/CD,Q Azure & AWS

---

Se este projeto te ajudar de alguma forma, deixa uma ⭐ no repositório.
Acompanhe as próximas entregas. 🚀
