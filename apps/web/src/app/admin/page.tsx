import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/getServerSession";

export default async function AdminPage() {
  const user = await getServerSession();

  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-6">
      <h1 className="text-3xl font-semibold">Área administrativa</h1>
      <p className="text-base text-neutral-600">
        Bem-vindo à área restrita a administradores.
      </p>
    </main>
  );
}
