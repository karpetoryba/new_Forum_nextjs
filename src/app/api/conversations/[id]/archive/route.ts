import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // check if conversation exists
    const conversation = await prisma.conversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // archive a conversation (soft delete via archivedAt)
    const archivedConversation = await prisma.conversation.update({
      where: { id },
      data: {
        archivedAt: new Date(),
      },
    });

    return NextResponse.json(archivedConversation);
  } catch (error) {
    console.error("Error archiving conversation:", error);
    return NextResponse.json(
      { error: "Failed to archive conversation" },
      { status: 500 }
    );
  }
}

