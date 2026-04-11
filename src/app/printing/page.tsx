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
      toast.error("Please select a printer first");
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

      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-4 space-y-6 animate-fade-in">
        {/* Printer selection */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Printer className="w-5 h-5" />
              {t("printing.selectPrinter")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedDevice} onValueChange={(v) => setSelectedDevice(v ?? "")}>
              <SelectTrigger className="max-w-md">
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
              <p className="text-sm text-muted-foreground">
                No online printers available. Check your devices.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Print Queue */}
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t("printing.queue")} ({printQueue.length})
            </CardTitle>
            <div className="flex gap-2">
              {printQueue.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-destructive"
                    onClick={clearPrintQueue}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear queue
                  </Button>
                  <Button size="sm" className="gap-1" onClick={handlePrintAll}>
                    <Printer className="w-3.5 h-3.5" />
                    Print all ({printQueue.length})
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {printQueue.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Printer className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>{t("printing.noQueue")}</p>
                <p className="text-sm mt-1">
                  Add labels from the Labels page using the quick print button
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {printQueue.map((label) => (
                  <div
                    key={label.id}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{label.productName}</p>
                      <p className="text-xs text-muted-foreground">
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
