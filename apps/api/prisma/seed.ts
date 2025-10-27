// apps/api/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@valoraplatform.dev';

  const exists = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!exists) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin',
        role: 'admin',
      },
    });
    console.log('✅ Usuário admin criado:', adminEmail);
  } else {
    console.log('ℹ️ Usuário admin já existe:', adminEmail);
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed falhou:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
