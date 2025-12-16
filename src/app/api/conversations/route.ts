import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const showArchived = searchParams.get("archived") === "true";
  const userId = searchParams.get("userId");

  const whereClause: any = {
    deletedAt: null,
  };
  if (userId) {
    whereClause.userId = userId;
  }

  // If requesting archived, show only archived ones
  if (showArchived) {
    whereClause.archivedAt = { not: null };
  } else {
    // Otherwise show only active (not archived) ones
    whereClause.archivedAt = null;
  }

  const conversations = await prisma.conversation.findMany({
    include: {
      messages: {
        select: { id: true },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
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
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, image } = await request.json();
    
    const data: any = {};
    if (title) {
      data.title = title;
    }
    if (image) {
      data.image = image;
    }
    data.userId = session.user.id;

 
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

