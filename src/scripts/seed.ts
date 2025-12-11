import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create test users
  const users = [
    { username: "player1", password: "password123" },
    { username: "player2", password: "password123" },
    { username: "highroller", password: "password123" },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    const createdUser = await prisma.user.upsert({
      where: { username: user.username },
      update: {},
      create: {
        username: user.username,
        password: hashedPassword,
        balance: 1000.0,
      },
    });

    console.log(`✅ Created user: ${createdUser.username} (ID: ${createdUser.id})`);

    // Add some sample transactions
    await prisma.transaction.createMany({
      data: [
        {
          userId: createdUser.id,
          amount: 1000,
          type: "deposit",
          gameType: null,
        },
        {
          userId: createdUser.id,
          amount: -50,
          type: "bet",
          gameType: "slots",
        },
        {
          userId: createdUser.id,
          amount: 150,
          type: "win",
          gameType: "slots",
        },
      ],
    });

    // Add a bonus spin
    await prisma.bonusSpin.create({
      data: {
        userId: createdUser.id,
        reward: 100,
      },
    });

    console.log(`   Added sample transactions and bonus spin for ${user.username}`);
  }

  console.log("\n🎰 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
