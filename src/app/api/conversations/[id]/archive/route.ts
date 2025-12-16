import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Vérifier ownership ou si l'utilisateur est modérateur/admin
    const isOwner = conversation.userId === session.user.id;
    const isModeratorOrAdmin = session.user.role === "MODERATOR" || session.user.role === "ADMIN";
    
    if (!isOwner && !isModeratorOrAdmin) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
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

