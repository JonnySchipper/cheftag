"use client";

import { useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { t } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sendToPrinter } from "@/lib/print-utils";
import { toast } from "sonner";
import { Printer, Trash2, Clock, Package } from "lucide-react";
import { format } from "date-fns";
import { getExpirationDate } from "@/lib/types";

export default function PrintingPage() {
  const { devices, printQueue, clearPrintQueue, printLabels } = useAppStore();
  const [selectedDevice, setSelectedDevice] = useState<string>("");

  const onlineDevices = devices.filter((d) => d.online);

  const handlePrintAll = async () => {
    if (!selectedDevice) {
      toast.error(t("printing.selectPrinterFirst"));
      return;
    }
    for (const label of printQueue) {
      await sendToPrinter(label, { printerId: selectedDevice });
    }
    printLabels(printQueue.map((l) => l.id));
    toast.success(`${printQueue.length} ${t("toast.labelsPrinted")}`);
    clearPrintQueue();
  };

  return (
    <div>
      <PageHeader title={t("printing.title")} />

      <div className="mx-auto max-w-[1600px] space-y-6 px-3 py-4 animate-fade-in sm:px-4 lg:px-6">
        <Card className="border-2 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <Printer className="h-7 w-7 text-primary" />
              {t("printing.selectPrinter")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedDevice} onValueChange={(v) => setSelectedDevice(v ?? "")}>
              <SelectTrigger className="h-14 min-h-[56px] max-w-xl rounded-xl text-base font-semibold">
                <SelectValue placeholder="Select a printer..." />
              </SelectTrigger>
              <SelectContent>
                {onlineDevices.map((device) => (
                  <SelectItem key={device.id} value={device.id}>
                    {device.name} — {device.printers.join(", ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {onlineDevices.length === 0 && (
              <p className="text-base font-medium text-muted-foreground">
                No online printers available. Check your devices.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 bg-card">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <Clock className="h-7 w-7 text-primary" />
              {t("printing.queue")} ({printQueue.length})
            </CardTitle>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              {printQueue.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 min-h-[56px] gap-2 font-bold text-destructive"
                    onClick={clearPrintQueue}
                  >
                    <Trash2 className="h-5 w-5" />
                    {t("printing.clearQueue")}
                  </Button>
                  <Button
                    size="lg"
                    className="h-14 min-h-[56px] gap-2 text-lg font-bold shadow-lg"
                    onClick={handlePrintAll}
                  >
                    <Printer className="h-7 w-7" />
                    {t("printing.printNow")} ({printQueue.length})
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {printQueue.length === 0 ? (
              <div className="py-14 text-center text-muted-foreground">
                <Printer className="mx-auto mb-4 h-16 w-16 opacity-30" />
                <p className="text-lg font-semibold">{t("printing.noQueue")}</p>
                <p className="mt-2 max-w-md mx-auto text-base">
                  {t("printing.addFromLabels")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {printQueue.map((label) => (
                  <div
                    key={label.id}
                    className="flex min-h-[56px] items-center gap-4 rounded-xl border-2 border-border p-4"
                  >
                    <Package className="h-6 w-6 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-bold leading-tight">{label.productName}</p>
                      <p className="text-base font-medium text-muted-foreground">
                        Qty: {label.quantity} · Expires:{" "}
                        {format(getExpirationDate(label), "MMM dd, HH:mm")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
