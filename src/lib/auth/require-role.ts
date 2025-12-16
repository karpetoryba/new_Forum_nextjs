import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import type { Role } from "@/types/next-auth";
import { hasRole } from "./roles";

/**
 * Vérifie que l'utilisateur a le rôle requis
 * Utilisé dans les routes API
 */
export async function requireRole(requiredRole: Role) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      user: null,
    };
  }

  if (!hasRole(session.user.role, requiredRole)) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      user: null,
    };
  }

  return {
    error: null,
    user: session.user,
  };
}

/**
 * Vérifie que l'utilisateur est authentifié
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      user: null,
    };
  }

  return {
    error: null,
    user: session.user,
  };
}

