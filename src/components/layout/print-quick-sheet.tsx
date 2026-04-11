"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/stores/app-store";
import { t } from "@/lib/i18n";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { sendToPrinter } from "@/lib/print-utils";
import { toast } from "sonner";
import { Printer, Trash2, Package, X, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { getExpirationDate } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PrintQuickSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrintQuickSheet({ open, onOpenChange }: PrintQuickSheetProps) {
  const router = useRouter();
  const {
    printQueue,
    clearPrintQueue,
    printLabels,
    removeFromPrintQueue,
    setHighlightPrintAfterCreate,
    devices,
  } = useAppStore();

  const onlineDevices = devices.filter((d) => d.online);
  const defaultPrinterId = onlineDevices[0]?.id ?? "";

  const handlePrintAll = async () => {
    if (printQueue.length === 0) {
      toast.error(t("printing.noQueue"));
      return;
    }
    if (!defaultPrinterId) {
      toast.error(t("printing.selectPrinterFirst"));
      onOpenChange(false);
      router.push("/printing");
      return;
    }
    for (const label of printQueue) {
      await sendToPrinter(label, { printerId: defaultPrinterId });
    }
    printLabels(printQueue.map((l) => l.id));
    toast.success(`${printQueue.length} ${t("toast.labelsPrinted")}`);
    clearPrintQueue();
    setHighlightPrintAfterCreate(false);
    onOpenChange(false);
  };

  const handleOpenFullQueue = () => {
    setHighlightPrintAfterCreate(false);
    onOpenChange(false);
    router.push("/printing");
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setHighlightPrintAfterCreate(false);
      }}
    >
      <SheetContent side="bottom" className="max-h-[90vh] rounded-t-2xl p-0">
        <SheetHeader className="border-b border-border px-4 py-4 text-left">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold">
            <Printer className="h-6 w-6 text-primary" />
            {t("printing.quickTitle")}
          </SheetTitle>
          <p className="text-sm font-medium text-muted-foreground">
            {printQueue.length}{" "}
            {printQueue.length === 1 ? t("printing.itemQueued") : t("printing.itemsQueued")}
            {defaultPrinterId && onlineDevices[0] ? (
              <span className="block pt-1 text-xs">
                {t("printing.usingPrinter")}: {onlineDevices[0].name}
              </span>
            ) : (
              <span className="block pt-1 text-xs text-amber-600 dark:text-amber-400">
                {t("printing.noOnlinePrinter")}
              </span>
            )}
          </p>
        </SheetHeader>

        <div className="max-h-[42vh] overflow-y-auto px-3 py-2">
          {printQueue.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
              <Printer className="h-14 w-14 opacity-30" />
              <p className="font-medium">{t("printing.noQueue")}</p>
              <p className="max-w-xs text-sm">{t("printing.addFromLabels")}</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {printQueue.map((label) => (
                <li
                  key={label.id}
                  className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-3"
                >
                  <Package className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-tight">
                      {label.productName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("labels.quantity")}: {label.quantity} ·{" "}
                      {format(getExpirationDate(label), "MMM dd, HH:mm")}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 shrink-0"
                    onClick={() => removeFromPrintQueue([label.id])}
                    aria-label={t("common.remove")}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2 border-t border-border bg-card p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button
            type="button"
            size="lg"
            className={cn(
              "h-14 w-full gap-2 text-base font-bold shadow-lg",
              printQueue.length === 0 && "opacity-60"
            )}
            disabled={printQueue.length === 0}
            onClick={handlePrintAll}
          >
            <Printer className="h-6 w-6" />
            {t("printing.printNow")}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-12 gap-1 font-semibold"
              disabled={printQueue.length === 0}
              onClick={() => {
                clearPrintQueue();
                toast.success(t("printing.queueCleared"));
              }}
            >
              <Trash2 className="h-4 w-4" />
              {t("printing.clearQueue")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="h-12 gap-1 font-semibold"
              onClick={handleOpenFullQueue}
            >
              <ExternalLink className="h-4 w-4" />
              {t("printing.fullQueue")}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
