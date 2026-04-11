"use client";

import { usePathname, useRouter } from "next/navigation";
import { t } from "@/lib/i18n";
import {
  LayoutDashboard,
  Tag,
  Printer,
  BarChart3,
  Settings,
} from "lucide-react";

const items = [
  { href: "/dashboard", label: "nav.dashboard", icon: LayoutDashboard },
  { href: "/labels", label: "nav.labels", icon: Tag },
  { href: "/printing", label: "nav.printing", icon: Printer },
  { href: "/reports", label: "nav.reports", icon: BarChart3 },
  { href: "/settings", label: "nav.settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border lg:hidden">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{t(item.label)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
