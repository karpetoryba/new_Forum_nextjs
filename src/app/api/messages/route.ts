import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
    orderBy: {
      createdAt: "desc",
    },
    where: whereClause,
  });

  return NextResponse.json(messages);
}
export async function POST(request: NextRequest) {
  try {
    const { content, conversationId } = await request.json();
    const newMessage = await prisma.message.create({
      data: {
        content,
        conversationId,
      },
    });
    return NextResponse.json(newMessage);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
  }

}

export async function DELETE(request: NextRequest) {
  try {
    // get id from query params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    // verifier si le message existe
    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    // Soft delete (mettre à jour deletedAt au lieu de supprimer physiquement)
    const deletedMessage = await prisma.message.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json(deletedMessage);
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}