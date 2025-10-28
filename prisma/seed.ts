import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";

const NB_CONVERSATION = 20; // Nombre de conversations à générer
const NB_MESSAGE_PER_CONVERSATION = 5; // Nombre de messages par conversation

async function main() {
  console.log("🌱 Début de la génération des conversations...");
  
  // Compter les conversations existantes
  const existingCount = await prisma.conversation.count({
    where: {
      deletedAt: null,
    },
  });
  
  console.log(`📊 Conversations existantes: ${existingCount}`);

  for (let i = 0; i < NB_CONVERSATION; i++) {
    const conversation = await prisma.conversation.create({
      data: {
        title: faker.lorem.sentence(),
        // Optionnel: ajouter une image
        // image: faker.image.url(),
      },
    });

    // Créer des messages pour chaque conversation
    for (let j = 0; j < NB_MESSAGE_PER_CONVERSATION; j++) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          content: faker.lorem.paragraph(),
        },
      });
    }
    
    console.log(`✅ Conversation créée #${i + 1}: ${conversation.title}`);
  }

  const newCount = await prisma.conversation.count({
    where: {
      deletedAt: null,
    },
  });
  
  console.log(`📊 Total de conversations: ${newCount}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("✅ Génération terminée avec succès");
  })
  .catch(async (e) => {
    console.error("❌ Erreur lors de la génération:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
