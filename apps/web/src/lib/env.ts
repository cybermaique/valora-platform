export function getEnv() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!apiUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL não definida. Crie apps/web/.env.local com NEXT_PUBLIC_API_URL."
    );
  }
  return { apiUrl };
}
