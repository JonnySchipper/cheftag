"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { t } from "@/lib/i18n";
import { PrintQuickSheet } from "@/components/layout/print-quick-sheet";
import { cn } from "@/lib/utils";

export function BigPrintFab() {
  const [userOpenedSheet, setUserOpenedSheet] = useState(false);
  const { printQueue, highlightPrintAfterCreate, setHighlightPrintAfterCreate } =
    useAppStore();

  const sheetOpen = highlightPrintAfterCreate || userOpenedSheet;

  const count = printQueue.length;

  return (
    <>
      <div className="pointer-events-none fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-1/2 z-50 flex -translate-x-1/2 justify-center xl:bottom-8">
        <button
          type="button"
          onClick={() => {
            setHighlightPrintAfterCreate(false);
            setUserOpenedSheet(true);
          }}
          className={cn(
            "pointer-events-auto flex h-[60px] min-w-[200px] max-w-[min(100vw-2rem,24rem)] items-center justify-center gap-3 rounded-2xl px-8 text-lg font-bold text-primary-foreground shadow-xl ring-2 ring-primary/30 transition-transform active:scale-[0.98]",
            "bg-primary hover:bg-primary/90",
            highlightPrintAfterCreate && "animate-pulse ring-4 ring-accent"
          )}
        >
          <Printer className="h-8 w-8 shrink-0" strokeWidth={2.5} />
          <span className="tracking-tight">{t("printing.printAction")}</span>
          {count > 0 && (
            <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-primary-foreground/20 px-2 text-sm font-bold">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </button>
      </div>
      <PrintQuickSheet
        open={sheetOpen}
        onOpenChange={(v) => {
          setUserOpenedSheet(v);
          if (!v) setHighlightPrintAfterCreate(false);
        }}
      />
    </>
  );
}
