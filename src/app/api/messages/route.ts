import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const whereClause = { deletedAt: null };

  const conversationId = searchParams.get("conversationId");

  if (conversationId) {
    Object.assign(whereClause, { conversationId });
  }

  const isDelatedAt = searchParams.get("deletedAt");

  if (isDelatedAt) {
    Object.assign(whereClause, { isDelatedAt });
  }

  const messages = await prisma.message.findMany({
    include: {
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

  return NextResponse.json(messages);
}
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, conversationId } = await request.json();

    if (!content || !conversationId) {
      return NextResponse.json(
        { error: "Content and conversationId are required" },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, deletedAt: null },
      select: { id: true },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const newMessage = await prisma.message.create({
      data: {
        content,
        conversationId,
        userId: session.user.id,
      },
    });
    return NextResponse.json(newMessage);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
  }

}
