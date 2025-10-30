import { cookies, headers } from "next/headers";
import { getEnv } from "./env";

export interface SessionUser {
  sub: string;
  email: string;
  role: "USER" | "ADMIN";
}

export async function getServerSession(): Promise<SessionUser | null> {
  const { apiUrl } = getEnv();

  const cookieStore = await cookies();
  const headersList = await headers();

  const cookieHeader = cookieStore
    .getAll()
    .map(
      ({ name, value }: { name: string; value: string }) => `${name}=${value}`
    )
    .join("; ");

  const authorization = headersList.get("authorization") ?? undefined;

  try {
    const response = await fetch(`${apiUrl}/auth/me`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
        ...(authorization ? { authorization } : {}),
      },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { user?: SessionUser };
    return data.user ?? null;
  } catch {
    return null;
  }
}
