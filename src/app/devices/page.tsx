"use client";

import { useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { t } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label as UILabel } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Printer, Monitor, Clock, Wifi, WifiOff } from "lucide-react";
import { format } from "date-fns";

const deviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  printers: z.string().min(1, "At least one printer is required"),
});

export default function DevicesPage() {
  const { devices, addDevice } = useAppStore();
  const [newOpen, setNewOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof deviceSchema>>({
    resolver: zodResolver(deviceSchema),
  });

  const onSubmit = (data: z.infer<typeof deviceSchema>) => {
    addDevice({
      id: `d-${Date.now()}`,
      name: data.name,
      printers: data.printers.split(",").map((p) => p.trim()),
      lastPrint: null,
      lastSeen: new Date().toISOString(),
      online: true,
    });
    toast.success(t("toast.deviceCreated"));
    reset();
    setNewOpen(false);
  };

  const handleTestPrint = (deviceName: string) => {
    // TODO: real Raspberry Pi endpoint
    toast.success(`${t("toast.testPrintSent")} (${deviceName})`);
  };

  return (
    <div>
      <PageHeader
        title={t("devices.title")}
        action={
          <Sheet open={newOpen} onOpenChange={setNewOpen}>
            <SheetTrigger
              render={<Button size="sm" className="gap-1" />}
            >
              <Plus className="w-4 h-4" />
              {t("devices.newDevice")}
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{t("devices.newDevice")}</SheetTitle>
              </SheetHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <UILabel>{t("common.name")}</UILabel>
                  <Input {...register("name")} placeholder="Device name" />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <UILabel>{t("devices.printers")} (comma-separated)</UILabel>
                  <Input
                    {...register("printers")}
                    placeholder="Zebra ZD421, Brother QL-820NWB"
                  />
                  {errors.printers && (
                    <p className="text-xs text-destructive">{errors.printers.message}</p>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setNewOpen(false)} className="flex-1">
                    {t("common.cancel")}
                  </Button>
                  <Button type="submit" className="flex-1">{t("common.save")}</Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        }
      />

      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-4 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => (
            <Card key={device.id} className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-md flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  {device.name}
                </CardTitle>
                <Badge
                  variant={device.online ? "default" : "secondary"}
                  className={
                    device.online
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : ""
                  }
                >
                  {device.online ? (
                    <><Wifi className="w-3 h-3 mr-1" />{t("devices.online")}</>
                  ) : (
                    <><WifiOff className="w-3 h-3 mr-1" />{t("devices.offline")}</>
                  )}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Printer className="w-4 h-4" />
                  <span>{device.printers.join(", ")}</span>
                </div>

                {device.lastPrint && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      {t("devices.lastPrint")}:{" "}
                      {format(new Date(device.lastPrint), "MMM dd, HH:mm")}
                    </span>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  {t("devices.lastSeen")}:{" "}
                  {format(new Date(device.lastSeen), "MMM dd, HH:mm")}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 mt-2"
                  disabled={!device.online}
                  onClick={() => handleTestPrint(device.name)}
                >
                  <Printer className="w-3.5 h-3.5" />
                  {t("devices.printTest")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
