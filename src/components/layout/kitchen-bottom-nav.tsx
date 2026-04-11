"use client";

import { usePathname, useRouter } from "next/navigation";
import { t } from "@/lib/i18n";
import { PRIMARY_NAV, isMoreRoute } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useOpenMoreNav } from "@/components/layout/more-nav-context";

export function KitchenBottomNav() {
  const onOpenMore = useOpenMoreNav();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/90 xl:hidden safe-area-pb"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex max-w-7xl items-stretch justify-around gap-0 px-1 pt-1">
          {PRIMARY_NAV.map((item) => {
            if (item.href === "more") {
              const active = isMoreRoute(pathname);
              return (
                <button
                  key="more"
                  type="button"
                  onClick={onOpenMore}
                  className={cn(
                    "flex min-h-[56px] min-w-[56px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="h-6 w-6 shrink-0" strokeWidth={2.25} />
                  <span className="max-w-full truncate text-[11px] font-semibold leading-tight">
                    {t(item.labelKey)}
                  </span>
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
                  "flex min-h-[56px] min-w-[56px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-6 w-6 shrink-0" strokeWidth={2.25} />
                <span className="max-w-full truncate text-[11px] font-semibold leading-tight">
                  {t(item.labelKey)}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
  );
}
