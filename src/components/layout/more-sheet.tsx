"use client";

import { usePathname, useRouter } from "next/navigation";
import { t } from "@/lib/i18n";
import { MORE_NAV_GROUPS } from "@/lib/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface MoreSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MoreSheet({ open, onOpenChange }: MoreSheetProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl p-0">
        <SheetHeader className="border-b border-border px-4 py-4 text-left">
          <SheetTitle className="text-xl font-bold">{t("nav.more")}</SheetTitle>
        </SheetHeader>
        <div className="max-h-[calc(85vh-5rem)] overflow-y-auto px-2 pb-8 pt-2">
          {MORE_NAV_GROUPS.map((group) => (
            <div key={group.titleKey} className="mb-4">
              <p className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {t(group.titleKey)}
              </p>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => {
                        router.push(item.href);
                        onOpenChange(false);
                      }}
                      className={cn(
                        "flex min-h-[52px] items-center gap-3 rounded-xl px-4 py-3 text-left text-base font-semibold transition-colors",
                        active
                          ? "bg-primary/15 text-primary"
                          : "hover:bg-muted active:bg-muted/80"
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {t(item.labelKey)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
