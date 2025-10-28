"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Accueil",
    href: "/",
    icon: Home,
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="flex items-center space-x-2 transition-opacity hover:opacity-80"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xl font-bold">Blog</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Button
                key={item.name}
                variant={isActive ? "default" : "ghost"}
                asChild
                className={cn("gap-2")}
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline-block">{item.name}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

