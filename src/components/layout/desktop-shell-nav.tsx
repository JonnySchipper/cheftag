"use client";

import { usePathname, useRouter } from "next/navigation";
import { t } from "@/lib/i18n";
import { PRIMARY_NAV, isMoreRoute } from "@/lib/navigation";
import { LogoWithText } from "@/components/layout/logo";
import { cn } from "@/lib/utils";
import { useOpenMoreNav } from "@/components/layout/more-nav-context";

export function DesktopShellNav() {
  const onOpenMore = useOpenMoreNav();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="sticky top-0 z-30 hidden h-screen w-56 shrink-0 flex-col border-r border-border bg-card xl:flex">
      <div className="border-b border-border p-4">
        <LogoWithText />
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main navigation">
        {PRIMARY_NAV.map((item) => {
          if (item.href === "more") {
            const active = isMoreRoute(pathname);
            return (
              <button
                key="more"
                type="button"
                onClick={onOpenMore}
                className={cn(
                  "flex min-h-[52px] items-center gap-3 rounded-xl px-3 text-left text-[15px] font-semibold transition-colors",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" strokeWidth={2.25} />
                {t(item.labelKey)}
              </button>
            );
          }
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              className={cn(
                "flex min-h-[52px] items-center gap-3 rounded-xl px-3 text-left text-[15px] font-semibold transition-colors",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" strokeWidth={2.25} />
              {t(item.labelKey)}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
