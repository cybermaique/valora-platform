# Postman E2E - Autenticação

Esta pasta contém a coleção Postman utilizada para validar os fluxos de autenticação, refresh token e RBAC implementados na API NestJS.

## Como usar

1. Importe o arquivo `auth-rbac.postman_collection.json` no Postman (ou Newman).
2. (Opcional) Importe o ambiente `auth-rbac.postman_environment.json`.
   Utilize-o como referência ao criar um ambiente próprio para definir as variáveis `baseUrl`, `testEmail` e `testPassword`.
3. Ajuste a variável `baseUrl` para apontar para a URL do backend (por padrão, `http://localhost:3000`).
4. Execute a coleção completa. Os testes automáticos conferem:
   - Healthcheck respondendo com status `ok`.
   - Registro e login gerando tokens e cookie HttpOnly de refresh.
   - Endpoint `/auth/me` validando o access token.
   - Rotação de refresh token e proteção RBAC da rota `/admin/test`.
   - Logout invalidando a sessão.

> A coleção cria automaticamente um usuário de teste com email randômico para manter os testes idempotentes.
