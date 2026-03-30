"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Session } from "next-auth";
import { Crown, CreditCard, Home, LogOut, Menu, MessageSquare, MessagesSquare, User, Zap } from "lucide-react";
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
  {
    name: "Tarifs",
    href: "/pricing",
    icon: CreditCard,
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
        throw new Error(payload.error || "Echec de la deconnexion");
      }

      toast.success("Deconnexion reussie");
      router.push("/signin");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Echec de la deconnexion");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/accueil"
          className="flex items-center gap-2.5 text-xl font-bold transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MessageSquare className="h-4 w-4" />
          </div>
          <span>Forum</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 sm:flex">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/accueil" && pathname?.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className={cn("gap-2", !isActive && "text-muted-foreground hover:text-foreground")}
                >
                  <Link href={item.href} aria-current={isActive ? "page" : undefined}>
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline-block">{item.name}</span>
                  </Link>
                </Button>
              );
            })}
          </div>

          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/signin">Se connecter</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">S&apos;inscrire</Link>
              </Button>
            </div>
          ) : (
            <div className="relative" ref={menuRef}>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-border/50"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline-flex max-w-[140px] truncate">{displayName}</span>
                {session?.user?.subscriptionPlan && (
                  <span className={cn(
                    "inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold",
                    session.user.subscriptionPlan === "MAX"
                      ? "bg-purple-500/15 text-purple-600 dark:text-purple-400"
                      : "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400"
                  )}>
                    {session.user.subscriptionPlan === "MAX" ? (
                      <><Zap className="h-2.5 w-2.5" /> Max</>
                    ) : (
                      <><Crown className="h-2.5 w-2.5" /> Pro</>
                    )}
                  </span>
                )}
                <Menu className="h-4 w-4 sm:hidden" />
              </Button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border/50 bg-popover p-2 shadow-xl shadow-black/5">
                  <div className="border-b border-border/50 pb-2 px-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{displayName}</p>
                      {session?.user?.role && session.user.role !== "USER" && (
                        <span className={cn(
                          "text-xs px-1.5 py-0.5 rounded-full font-medium",
                          session.user.role === "ADMIN"
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        )}>
                          {session.user.role === "ADMIN" ? "Admin" : "Mod"}
                        </span>
                      )}
                    </div>
                    {session?.user?.email && (
                      <p className="text-xs text-muted-foreground mt-0.5">{session.user.email}</p>
                    )}
                  </div>

                  <div className="mt-2 flex flex-col gap-0.5">
                    <Button variant="ghost" size="sm" className="justify-start rounded-lg" asChild>
                      <Link href="/account">Mon compte</Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start rounded-lg" asChild>
                      <Link href="/pricing">Abonnements</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start rounded-lg text-destructive hover:text-destructive"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Se deconnecter</span>
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
