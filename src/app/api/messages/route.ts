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