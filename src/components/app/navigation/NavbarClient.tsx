"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Session } from "next-auth";
import { Crown, Home, LogOut, Menu, MessageSquare, MessagesSquare, User, Zap } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavbarClientProps = {
  session: Session | null;
};

const navigation = [
  {
    name: "Accueil",
    href: "/accueil",
    icon: Home,
  },
  {
    name: "Conversations",
    href: "/conversations",
    icon: MessagesSquare,
  },
];

export default function NavbarClient({ session }: NavbarClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = Boolean(session?.user);
  const displayName = session?.user?.name || session?.user?.email || "Utilisateur";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Échec de la déconnexion");
      }

      toast.success("Déconnexion réussie");
      router.push("/signin");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Échec de la déconnexion");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/accueil"
          className="flex items-center gap-2 text-xl font-semibold transition-opacity hover:opacity-80"
        >
          <MessageSquare className="h-5 w-5" />
          <span>Forum</span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <div className="hidden items-center gap-2 sm:flex">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/accueil" && pathname?.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "default" : "ghost"}
                    asChild
                    className={cn("gap-2")}
                  >
                    <Link href={item.href} aria-current={isActive ? "page" : undefined}>
                      <Icon className="h-4 w-4" />
                      <span className="hidden md:inline-block">{item.name}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          )}

          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          ) : (
            <div className="relative" ref={menuRef}>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline-flex max-w-[140px] truncate">{displayName}</span>
                <Menu className="h-4 w-4 sm:hidden" />
              </Button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover p-2 shadow-lg">
                  <div className="border-b pb-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{displayName}</p>
                      {session?.user?.role && session.user.role !== "USER" && (
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          session.user.role === "ADMIN"
                            ? "bg-red-500/10 text-red-700 dark:text-red-400"
                            : "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                        }`}>
                          {session.user.role === "ADMIN" ? "Admin" : "Mod"}
                        </span>
                      )}
                      {session?.user?.subscriptionPlan && (
                        <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${
                          session.user.subscriptionPlan === "MAX"
                            ? "bg-purple-500/10 text-purple-700 dark:text-purple-400"
                            : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                        }`}>
                          {session.user.subscriptionPlan === "MAX" ? (
                            <><Zap className="h-3 w-3" /> Max</>
                          ) : (
                            <><Crown className="h-3 w-3" /> Premium</>
                          )}
                        </span>
                      )}
                    </div>
                    {session?.user?.email && (
                      <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    )}
                  </div>

                  <div className="mt-2 flex flex-col gap-1">
                    <Button variant="ghost" size="sm" className="justify-start" asChild>
                      <Link href="/account">Mon compte</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start text-destructive hover:text-destructive"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

