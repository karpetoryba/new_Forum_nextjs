import type { Role } from "@/types/next-auth";

/**
 * Vérifie si un utilisateur a un rôle spécifique
 */
export function hasRole(userRole: Role | undefined, requiredRole: Role): boolean {
  if (!userRole) return false;
  
  const roleHierarchy: Record<Role, number> = {
    USER: 0,
    MODERATOR: 1,
    ADMIN: 2,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Vérifie si un utilisateur est admin
 */
export function isAdmin(userRole: Role | undefined): boolean {
  return userRole === "ADMIN";
}

/**
 * Vérifie si un utilisateur est modérateur ou admin
 */
export function isModerator(userRole: Role | undefined): boolean {
  return userRole === "MODERATOR" || userRole === "ADMIN";
}

/**
 * Vérifie si un utilisateur est un utilisateur standard
 */
export function isUser(userRole: Role | undefined): boolean {
  return userRole === "USER" || !userRole;
}

/**
 * Obtient tous les rôles supérieurs ou égaux à un rôle donné
 */
export function getRolesAtLeast(role: Role): Role[] {
  const roleHierarchy: Record<Role, Role[]> = {
    USER: ["USER", "MODERATOR", "ADMIN"],
    MODERATOR: ["MODERATOR", "ADMIN"],
    ADMIN: ["ADMIN"],
  };

  return roleHierarchy[role];
}

