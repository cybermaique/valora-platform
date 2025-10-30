# Contribuindo — Valora Platform

## Como abrir Pull Requests
1. Crie sua branch: `{tipo}/{escopo}-{resumo}` (ex.: `feature/auth-refresh-token`).
2. Abra a PR e escolha um **template** (ou use o **default**).
3. Preencha as seções. **Evidências são opcionais** (prefira logs/snippets).
4. Marque as checklists de testes/qualidade quando aplicável.
5. Relacione issues com `Closes #NN`.

## Títulos e Labels
- Título: `{tipo}({escopo}): {resumo no imperativo}`
- Labels: `feature | fix | refactor | docs | test | chore`.

## Prompt (use no ChatGPT ao abrir PR)
Copie e cole:



Você é revisor técnico do projeto Valora Platform. Gere a descrição da PR no formato abaixo, conciso e sem exigir prints/gifs.

ENTRADAS:

Tipo da PR: <feature|fix|refactor|test|docs|chore>

Módulos tocados: <apps/api, apps/web, libs/...>

Mudanças principais (bullets):

...

Decisões técnicas/arquiteturais:

...

Endpoints/Interfaces alterados (se houver):

...

Migrations/Seeds (se houver):

...

Riscos/Breaking changes: <sim/não + quais>

Passos de validação manual:

...

...

Issues relacionadas: #...

SAÍDA (preencha apenas o que couber ao tipo):

✅ Contexto
📦 Escopo
🔍 Detalhes técnicos
🧪 Testes & Qualidade
🛣️ Endpoints / Interfaces (se aplicável)
🗄️ DB & Migrations (se aplicável)
⚠️ Breaking Changes / Risco
🔁 Rollback
▶️ Como validar (QA rápido)
📎 Relacionamentos
🖼️ Evidências (opcional)

Regras:

Máx. 12 bullets em Escopo.

Sem prints/gifs obrigatórios.

Para fix: incluir Causa Raiz.

Para refactor: deixar claro o que NÃO mudou.
