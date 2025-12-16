import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";
import { z } from "zod";

const updateRoleSchema = z.object({
  role: z.enum(["USER", "MODERATOR", "ADMIN"]),
});

/**
 * PUT /api/users/[id]/role
 * Permet à un admin de modifier le rôle d'un utilisateur
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Seuls les admins peuvent changer les rôles
    const { error: authError, user } = await requireRole("ADMIN");
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();
    const { role } = updateRoleSchema.parse(body);

    // Vérifier que l'utilisateur existe
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Empêcher un admin de se retirer lui-même les droits admin
    if (targetUser.id === user.id && role !== "ADMIN") {
      return NextResponse.json(
        { error: "Cannot remove admin role from yourself" },
        { status: 400 }
      );
    }

    // Mettre à jour le rôle
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.flatten(),
        },
        { status: 400 }
      );
    }

    console.error("[users_role_PUT]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

