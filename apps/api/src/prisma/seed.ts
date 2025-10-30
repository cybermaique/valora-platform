import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@valoraplatform.dev';
  const adminName = 'Admin';
  const plainPassword = 'Admin@123';

  const exists = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!exists) {
    const passwordHash = await bcrypt.hash(plainPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        passwordHash,
        role: Role.ADMIN,
      },
    });
    console.log(`Admin criado: ${adminEmail} | senha: ${plainPassword}`);
  } else {
    console.log('Admin já existe:', adminEmail);
  }
}

main()
  .catch((err: unknown) => {
    if (err instanceof Error) {
      console.error('[seed] Erro:', err.message);
      console.error(err.stack);
    } else {
      console.error('[seed] Erro desconhecido:', err);
    }
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
