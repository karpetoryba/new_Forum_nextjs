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

export async function POST(request: NextRequest) {
  try {
    const { title, image } = await request.json();
    
    const data: any = {};
    if (title) {
      data.title = title;
    }
    if (image) {
      data.image = image;
    }
    
    const newConversation = await prisma.conversation.create({
      data,
    });

    return NextResponse.json(newConversation, { status: 201 });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}

