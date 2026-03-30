"use client";

import Link from "next/link";
import { Github, MessageSquare, Twitter } from "lucide-react";

const navigation = [
  { name: "Accueil", href: "/accueil" },
  { name: "Conversations", href: "/conversations" },
  { name: "Tarifs", href: "/pricing" },
];

const socialLinks = [
  { name: "GitHub", href: "#", icon: Github },
  { name: "Twitter", href: "#", icon: Twitter },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/accueil" className="flex items-center gap-2.5 text-lg font-bold">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MessageSquare className="h-3.5 w-3.5" />
              </div>
              <span>Forum</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Social */}
            <div className="flex items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                    aria-label={item.name}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border/50 pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} Forum. Tous droits reserves.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
