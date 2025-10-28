import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const showArchived = searchParams.get("archived") === "true";

  const whereClause: any = {
    deletedAt: null,
  };

  // Если запрашиваем заархивированные, показываем только их
  if (showArchived) {
    whereClause.archivedAt = { not: null };
  } else {
    // Иначе показываем только активные (не заархивированные)
    whereClause.archivedAt = null;
  }

  const conversations = await prisma.conversation.findMany({
    include: {
      messages: {
        select: { id: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    where: whereClause,
  });

  return NextResponse.json(conversations);
}

