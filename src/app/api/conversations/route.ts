import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const conversations = await prisma.conversation.findMany({
    include: {
      messages: {
        select: { id: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    where: {
      deletedAt: null,
    },
  });

  return NextResponse.json(conversations);
}
