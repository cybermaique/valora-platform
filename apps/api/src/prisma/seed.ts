import { DemandEventKind, PriceRuleType, PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedAdmin() {
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

async function seedCatalog() {
  const categories = [
    { name: 'Eletrônicos', slug: 'eletronicos' },
    { name: 'Casa e Cozinha', slug: 'casa-cozinha' },
  ];

  const categoryRecords = await Promise.all(
    categories.map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: { name: category.name },
        create: {
          name: category.name,
          slug: category.slug,
        },
      }),
    ),
  );
  const categoryBySlug = new Map(categoryRecords.map((category) => [category.slug, category.id]));

  const products = [
    {
      name: 'Smartphone Aurora X',
      slug: 'smartphone-aurora-x',
      sku: 'AURORA-X-001',
      description: 'Smartphone 5G com câmera quádrupla e bateria de longa duração.',
      basePrice: '3499.90',
      isActive: true,
      inventory: 120,
      categorySlugs: ['eletronicos'],
    },
    {
      name: 'Fone de Ouvido Nebula Pro',
      slug: 'fone-nebula-pro',
      sku: 'NEBULA-PRO-101',
      description: 'Fone bluetooth com cancelamento de ruído e estojo de carregamento rápido.',
      basePrice: '899.90',
      isActive: true,
      inventory: 250,
      categorySlugs: ['eletronicos'],
    },
    {
      name: 'Liquidificador PulseMix',
      slug: 'liquidificador-pulsemix',
      sku: 'PULSEMIX-550',
      description: 'Liquidificador com 12 velocidades e jarra resistente a impactos.',
      basePrice: '429.00',
      isActive: true,
      inventory: 80,
      categorySlugs: ['casa-cozinha'],
    },
    {
      name: 'Panela de Pressão VapoSafe',
      slug: 'panela-vaposafe',
      sku: 'VAPOSAFE-700',
      description: 'Panela de pressão elétrica com controle digital de temperatura.',
      basePrice: '699.50',
      isActive: true,
      inventory: 60,
      categorySlugs: ['casa-cozinha'],
    },
    {
      name: 'Cafeteira SmartBrew',
      slug: 'cafeteira-smartbrew',
      sku: 'SMARTBREW-360',
      description: 'Cafeteira inteligente com conectividade Wi-Fi e programação automática.',
      basePrice: '1199.00',
      isActive: true,
      inventory: 95,
      categorySlugs: ['eletronicos', 'casa-cozinha'],
    },
  ];

  const productBySlug = new Map<string, string>();

  for (const productSeed of products) {
    const product = await prisma.product.upsert({
      where: { sku: productSeed.sku },
      update: {
        name: productSeed.name,
        slug: productSeed.slug,
        description: productSeed.description,
        basePrice: productSeed.basePrice,
        isActive: productSeed.isActive,
      },
      create: {
        name: productSeed.name,
        slug: productSeed.slug,
        sku: productSeed.sku,
        description: productSeed.description,
        basePrice: productSeed.basePrice,
        isActive: productSeed.isActive,
      },
    });

    productBySlug.set(productSeed.slug, product.id);

    await prisma.productCategory.deleteMany({ where: { productId: product.id } });

    const categoryLinks = productSeed.categorySlugs
      .map((slug) => categoryBySlug.get(slug))
      .filter((categoryId): categoryId is string => Boolean(categoryId))
      .map((categoryId) => ({ productId: product.id, categoryId }));

    if (categoryLinks.length > 0) {
      await prisma.productCategory.createMany({
        data: categoryLinks,
        skipDuplicates: true,
      });
    }

    await prisma.inventory.upsert({
      where: { productId: product.id },
      update: { quantity: productSeed.inventory },
      create: {
        productId: product.id,
        quantity: productSeed.inventory,
      },
    });
  }

  const featuredProductId = productBySlug.get('smartphone-aurora-x');
  if (featuredProductId) {
    await prisma.priceRule.upsert({
      where: { id: 'rule-smartphone-aurora-x-launch' },
      update: {
        config: { percentageOff: 12 },
        priority: 100,
        isActive: true,
        productId: featuredProductId,
      },
      create: {
        id: 'rule-smartphone-aurora-x-launch',
        type: PriceRuleType.PERCENTAGE,
        config: { percentageOff: 12 },
        priority: 100,
        isActive: true,
        product: { connect: { id: featuredProductId } },
      },
    });

    await prisma.priceSnapshot.upsert({
      where: { id: 'snapshot-aurora-x-launch' },
      update: {
        productId: featuredProductId,
        finalPrice: '3079.91',
        components: {
          basePrice: '3499.90',
          discounts: [
            {
              ruleId: 'rule-smartphone-aurora-x-launch',
              type: 'percentage',
              value: 12,
            },
          ],
        },
        takenAt: new Date(),
      },
      create: {
        id: 'snapshot-aurora-x-launch',
        product: { connect: { id: featuredProductId } },
        finalPrice: '3079.91',
        components: {
          basePrice: '3499.90',
          discounts: [
            {
              ruleId: 'rule-smartphone-aurora-x-launch',
              type: 'percentage',
              value: 12,
            },
          ],
        },
      },
    });

    const demandEvents = [
      {
        id: 'demand-aurora-view-1',
        kind: DemandEventKind.VIEW,
        at: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
      {
        id: 'demand-aurora-cart-1',
        kind: DemandEventKind.ADD_TO_CART,
        at: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        id: 'demand-aurora-purchase-1',
        kind: DemandEventKind.PURCHASE,
        at: new Date(),
      },
    ];

    for (const event of demandEvents) {
      await prisma.demandEvent.upsert({
        where: { id: event.id },
        update: {
          productId: featuredProductId,
          kind: event.kind,
          at: event.at,
        },
        create: {
          id: event.id,
          product: { connect: { id: featuredProductId } },
          kind: event.kind,
          at: event.at,
        },
      });
    }
  }
}

async function main() {
  await seedAdmin();
  await seedCatalog();
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
