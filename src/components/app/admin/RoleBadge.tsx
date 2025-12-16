"use client";

import { Badge } from "@/components/ui/badge";
import type { Role } from "@/types/next-auth";

interface RoleBadgeProps {
  role?: Role;
  className?: string;
}

export default function RoleBadge({ role, className }: RoleBadgeProps) {
  if (!role || role === "USER") {
    return null;
  }

  const roleConfig = {
    ADMIN: {
      label: "Admin",
      className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
    },
    MODERATOR: {
      label: "Modérateur",
      className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    },
  };

  const config = roleConfig[role];

  if (!config) return null;

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${className || ""}`}
    >
      {config.label}
    </Badge>
  );
}

