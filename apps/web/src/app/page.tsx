/* eslint-disable @typescript-eslint/no-explicit-any */
// apps/web/src/app/page.tsx
import type { Metadata } from "next";
import { getEnv } from "@/lib/env";

// Força SSR sempre fresco (sem cache de página)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "valoraplatform | Status da API",
  description: "Página inicial com status da API (SSR).",
};

// ====== TYPES ======
type HealthResponse =
  | {
      status: "ok";
      version?: string;
      uptime?: number;
      timestamp?: string;
      env?: string;
    }
  | Record<string, unknown>;

type UsersPayload = {
  count: number;
  data: Array<{
    id: string;
    email: string;
    name: string | null;
    role: string;
    createdAt: string;
  }>;
};

// ====== DATA-FETCHERS (SSR) ======
async function fetchApiHealth(apiUrl: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000); // 4s timeout
  const startedAt = Date.now();

  try {
    const res = await fetch(`${apiUrl}/health`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: { accept: "application/json" },
    });

    const latencyMs = Date.now() - startedAt;

    if (!res.ok) {
      return {
        ok: false as const,
        latencyMs,
        error: `HTTP ${res.status} ${res.statusText}`,
        data: null as HealthResponse | null,
      };
    }

    let data: HealthResponse | null = null;
    try {
      data = (await res.json()) as HealthResponse;
    } catch {
      data = { raw: await res.text() };
    }

    const status =
      typeof data === "object" && data && "status" in data
        ? (data as any).status
        : "unknown";
    return {
      ok: status === "ok",
      latencyMs,
      error: null as string | null,
      data,
    };
  } catch (err: unknown) {
    const latencyMs = Date.now() - startedAt;
    return {
      ok: false as const,
      latencyMs,
      error: err instanceof Error ? err.message : "Erro desconhecido",
      data: null as HealthResponse | null,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchUsers(apiUrl: string) {
  const res = await fetch(`${apiUrl}/users`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Falha ao buscar /users: ${res.status}`);
  return (await res.json()) as UsersPayload;
}

// ====== PAGE (SERVER COMPONENT) ======
export default async function Page() {
  const { apiUrl } = getEnv();

  // Executa as duas chamadas em paralelo no servidor
  const [health, usersResult] = await Promise.allSettled([
    fetchApiHealth(apiUrl),
    fetchUsers(apiUrl),
  ]);

  // Normaliza resultados
  const result =
    health.status === "fulfilled"
      ? health.value
      : {
          ok: false as const,
          latencyMs: 0,
          error: "Falha no health",
          data: null,
        };
  const users: UsersPayload | null =
    usersResult.status === "fulfilled" ? usersResult.value : null;

  const badgeClass = result.ok
    ? "bg-green-600 text-white"
    : "bg-red-600 text-white";

  return (
    <main className="min-h-dvh px-6 py-10 bg-neutral-50">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">valoraplatform</h1>
          <p className="text-sm text-neutral-600">
            Página inicial SSR verificando o status da API e listando usuários.
          </p>
        </header>

        {/* STATUS DA API */}
        <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-medium">Status da API</h2>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm ${badgeClass}`}
            >
              {result.ok ? "ONLINE" : "OFFLINE"}
            </span>

            <div className="text-sm text-neutral-700">
              <div>
                <span className="font-medium">Endpoint:</span>{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5">
                  {apiUrl}/health
                </code>
              </div>
              <div>
                <span className="font-medium">Latência:</span>{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5">
                  {result.latencyMs} ms
                </code>
              </div>
              {!result.ok && (result as any).error && (
                <div className="mt-1">
                  <span className="font-medium text-red-700">Erro:</span>{" "}
                  <code className="rounded bg-red-50 px-1 py-0.5 text-red-700">
                    {(result as any).error}
                  </code>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5">
            <h3 className="mb-2 text-sm font-medium text-neutral-700">
              Payload
            </h3>
            <pre className="overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-900 p-4 text-neutral-100">
              {JSON.stringify(
                (result as any).data ?? { info: "sem payload" },
                null,
                2
              )}
            </pre>
          </div>
        </section>

        {/* LISTA DE USUÁRIOS */}
        <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium">Usuários (SSR)</h2>
            <span className="text-xs text-neutral-500">
              Fonte: {apiUrl}/users
            </span>
          </div>

          {!users ? (
            <p className="text-sm text-red-700">Falha ao carregar usuários.</p>
          ) : users.count === 0 ? (
            <p className="text-sm text-neutral-600">
              Nenhum usuário cadastrado.
            </p>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {users.data.map((u) => (
                <li key={u.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {u.name ?? "(sem nome)"}
                      </p>
                      <p className="text-xs text-neutral-600">{u.email}</p>
                    </div>
                    <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs uppercase">
                      {u.role}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Criado em {new Date(u.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="text-xs text-neutral-500">
          Renderizado no servidor via SSR, sem cache de página.
        </footer>
      </div>
    </main>
  );
}
