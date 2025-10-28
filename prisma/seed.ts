import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";

const NB_CONVERSATION = 10;
const NB_MESSAGE_PER_CONVERSATION = 5;

async function main() {
  for (let i = 0; i < NB_CONVERSATION; i++) {
    const conversation = await prisma.conversation.create({
      data: {
        title: faker.lorem.sentence(),
      },
    });

    for (let j = 0; j < NB_MESSAGE_PER_CONVERSATION; j++) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          content: faker.lorem.paragraph(),
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seeding completed");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
