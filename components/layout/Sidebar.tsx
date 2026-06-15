"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-foreground/20 bg-background">
      <div className="border-b border-foreground/20 px-4 py-5">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Blog Admin
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-foreground text-background font-medium"
                      : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-foreground/20 p-4">
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
        >
          Log out
        </Button>
      </div>
    </aside>
  );
}
