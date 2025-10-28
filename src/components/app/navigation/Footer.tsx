"use client";

import Link from "next/link";
import { Github, Twitter } from "lucide-react";

const navigation = [
  { name: "Accueil", href: "/accueil" },
  { name: "Conversations", href: "/conversations" },
  { name: "À propos", href: "/about" },
];

const socialLinks = [
  {
    name: "GitHub",
    href: "#",
    icon: Github,
  },
  {
    name: "Twitter",
    href: "#",
    icon: Twitter,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full border-t bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          {/* Left: Copyright */}
          <div className="text-sm text-muted-foreground">
            <p>© {currentYear} Blog — Built for builders.</p>
          </div>

          {/* Middle: Navigation Links */}
          <nav className="flex items-center gap-6 flex-wrap justify-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right: Social Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={item.name}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

