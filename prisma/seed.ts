import { PrismaClient } from "../src/generated/prisma";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seed...");

  // Nettoyer la base de données
  console.log("🧹 Nettoyage de la base de données...");
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.user.deleteMany();
  await prisma.verificationToken.deleteMany();

  // Créer des utilisateurs
  console.log("👥 Création des utilisateurs...");
  const users = [];
  const defaultPassword = await bcrypt.hash("Password123!", 10);

  // Créer quelques utilisateurs avec des emails prédéfinis pour tester
  const testUsers = [
    {
      email: "admin@example.com",
      password: defaultPassword,
      name: "Admin User",
      bio: faker.person.bio(),
      avatar: faker.image.avatar(),
      role: "ADMIN" as const,
    },
    {
      email: "moderator@example.com",
      password: defaultPassword,
      name: "Moderator User",
      bio: faker.person.bio(),
      avatar: faker.image.avatar(),
      role: "MODERATOR" as const,
    },
    {
      email: "user@example.com",
      password: defaultPassword,
      name: "Test User",
      bio: faker.person.bio(),
      avatar: faker.image.avatar(),
      role: "USER" as const,
    },
  ];

  for (const testUser of testUsers) {
    const user = await prisma.user.create({
      data: testUser,
    });
    users.push(user);
  }

  // Créer des utilisateurs aléatoires
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email().toLowerCase(),
        password: defaultPassword,
        name: faker.person.fullName(),
        bio: faker.person.bio(),
        avatar: faker.image.avatar(),
      },
    });
    users.push(user);
  }

  console.log(`✅ ${users.length} utilisateurs créés`);

  // Créer des conversations
  console.log("💬 Création des conversations...");
  const conversations = [];

  for (let i = 0; i < 20; i++) {
    const randomUser = faker.helpers.arrayElement(users);
    const shouldHaveImage = faker.datatype.boolean({ probability: 0.4 });
    const shouldBeArchived = faker.datatype.boolean({ probability: 0.1 });

    const conversation = await prisma.conversation.create({
      data: {
        title: faker.lorem.sentence({ min: 3, max: 8 }),
        image: shouldHaveImage ? faker.image.url() : null,
        userId: randomUser.id,
        archivedAt: shouldBeArchived ? faker.date.past() : null,
        createdAt: faker.date.past({ years: 1 }),
      },
    });
    conversations.push(conversation);
  }

  console.log(`✅ ${conversations.length} conversations créées`);

  // Créer des messages
  console.log("📝 Création des messages...");
  let messageCount = 0;

  for (const conversation of conversations) {
    // Chaque conversation peut avoir entre 0 et 15 messages
    const messageCountForConversation = faker.number.int({ min: 0, max: 15 });

    for (let i = 0; i < messageCountForConversation; i++) {
      const randomUser = faker.helpers.arrayElement(users);
      const shouldBeDeleted = faker.datatype.boolean({ probability: 0.05 });

      await prisma.message.create({
        data: {
          content: faker.lorem.paragraph({ min: 1, max: 3 }),
          userId: randomUser.id,
          conversationId: conversation.id,
          deletedAt: shouldBeDeleted ? faker.date.recent() : null,
          createdAt: faker.date.between({
            from: conversation.createdAt,
            to: new Date(),
          }),
        },
      });
      messageCount++;
    }
  }

  // Créer quelques messages sans conversation (optionnel)
  for (let i = 0; i < 5; i++) {
    const randomUser = faker.helpers.arrayElement(users);
    await prisma.message.create({
      data: {
        content: faker.lorem.paragraph({ min: 1, max: 2 }),
        userId: randomUser.id,
        conversationId: null,
      },
    });
    messageCount++;
  }

  console.log(`✅ ${messageCount} messages créés`);

  console.log("\n✨ Seed terminé avec succès!");
  console.log(`📊 Résumé:`);
  console.log(`   - ${users.length} utilisateurs`);
  console.log(`   - ${conversations.length} conversations`);
  console.log(`   - ${messageCount} messages`);
  console.log("\n🔑 Identifiants de test:");
  console.log("   - admin@example.com / Password123! (ADMIN)");
  console.log("   - moderator@example.com / Password123! (MODERATOR)");
  console.log("   - user@example.com / Password123! (USER)");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


