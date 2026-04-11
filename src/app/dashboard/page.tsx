"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/stores/app-store";
import { t } from "@/lib/i18n";
import { getLabelStatus, getExpirationDate } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { PieChartCard } from "@/components/charts/pie-chart-card";
import { BarChartCard } from "@/components/charts/bar-chart-card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NewLabelForm } from "@/components/forms/new-label-form";
import { format, subDays, startOfMonth, isAfter, isBefore, isToday, isTomorrow } from "date-fns";
import { Plus, Clock, User } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/status-badge";

export default function DashboardPage() {
  const router = useRouter();
  const { labels, reportEntries, discardLabels } = useAppStore();
  const [newLabelOpen, setNewLabelOpen] = useState(false);

  const stats = useMemo(() => {
    let active = 0;
    let expired = 0;
    let expiringToday = 0;
    let expiringTomorrow = 0;

    for (const label of labels) {
      const status = getLabelStatus(label);
      const expDate = getExpirationDate(label);

      if (status === "expired") {
        expired++;
      } else {
        active++;
        if (isToday(expDate)) expiringToday++;
        else if (isTomorrow(expDate)) expiringTomorrow++;
      }
    }

    const discarded = reportEntries.filter((r) => r.discarded).length;

    return { total: labels.length, discarded, active, expired, expiringToday, expiringTomorrow };
  }, [labels, reportEntries]);

  const expiredLabelIds = useMemo(
    () => labels.filter((l) => getLabelStatus(l) === "expired").map((l) => l.id),
    [labels]
  );
  const expiringTodayIds = useMemo(
    () => labels.filter((l) => isToday(getExpirationDate(l)) && getLabelStatus(l) !== "expired").map((l) => l.id),
    [labels]
  );
  const expiringTomorrowIds = useMemo(
    () => labels.filter((l) => isTomorrow(getExpirationDate(l)) && getLabelStatus(l) !== "expired").map((l) => l.id),
    [labels]
  );

  const employeeChartData = useMemo(() => {
    const map = new Map<string, number>();
    labels.forEach((l) => {
      map.set(l.responsibleName, (map.get(l.responsibleName) || 0) + 1);
    });
    return Array.from(map, ([name, value]) => ({ name, value })).sort(
      (a, b) => b.value - a.value
    );
  }, [labels]);

  const storageChartData = useMemo(() => {
    const map = new Map<string, number>();
    labels.forEach((l) => {
      map.set(l.storageLocation, (map.get(l.storageLocation) || 0) + 1);
    });
    return Array.from(map, ([name, value]) => ({ name, value })).sort(
      (a, b) => b.value - a.value
    );
  }, [labels]);

  const preservationChartData = useMemo(() => {
    const { preservationModes } = useAppStore.getState();
    const map = new Map<string, number>();
    labels.forEach((l) => {
      const mode = preservationModes.find((m) => m.id === l.preservationModeId);
      const name = mode?.name || "Unknown";
      map.set(name, (map.get(name) || 0) + 1);
    });
    return Array.from(map, ([name, value]) => ({ name, value })).sort(
      (a, b) => b.value - a.value
    );
  }, [labels]);

  const barChartDaily = useMemo(() => {
    const days: { name: string; printed: number; discarded: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = subDays(new Date(), i);
      const dayStr = format(day, "MMM dd");
      const dayEntries = reportEntries.filter((r) => {
        const created = new Date(r.createdAt);
        return format(created, "MMM dd") === dayStr;
      });
      days.push({
        name: dayStr,
        printed: dayEntries.filter((r) => r.printed).length,
        discarded: dayEntries.filter((r) => r.discarded).length,
      });
    }
    return days;
  }, [reportEntries]);

  const barChartMonthly = useMemo(() => {
    const months: { name: string; printed: number; discarded: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStr = format(d, "MMM yyyy");
      const start = startOfMonth(d);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const monthEntries = reportEntries.filter((r) => {
        const created = new Date(r.createdAt);
        return isAfter(created, start) && isBefore(created, end);
      });
      months.push({
        name: monthStr,
        printed: monthEntries.filter((r) => r.printed).length,
        discarded: monthEntries.filter((r) => r.discarded).length,
      });
    }
    return months;
  }, [reportEntries]);

  const recentLabels = useMemo(
    () =>
      [...labels]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 8),
    [labels]
  );

  const handleBulkDiscard = (ids: string[]) => {
    if (ids.length === 0) return;
    discardLabels(ids);
    toast.success(`${ids.length} ${t("toast.labelsDiscarded")}`);
  };

  return (
    <div>
      <PageHeader
        title={t("dashboard.title")}
        action={
          <Sheet open={newLabelOpen} onOpenChange={setNewLabelOpen}>
            <SheetTrigger
              render={<Button size="lg" className="h-12 gap-2 px-5 text-base font-bold" />}
            >
              <Plus className="h-5 w-5" />
              {t("dashboard.newLabel")}
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-md sm:max-w-lg">
              <SheetHeader>
                <SheetTitle className="text-xl font-bold">{t("dashboard.newLabel")}</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <NewLabelForm onClose={() => setNewLabelOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        }
      />

      <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-4 lg:px-6">
        <div className="space-y-8 animate-fade-in">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <KpiCard
              title={t("dashboard.totalLabels")}
              value={stats.total}
              onAccess={() => router.push("/labels")}
            />
            <KpiCard
              title={t("dashboard.discarded")}
              value={stats.discarded}
              emoji="🗑️"
            />
            <KpiCard
              title={t("dashboard.active")}
              value={stats.active}
              emoji="😌"
              onAccess={() => router.push("/labels?status=valid")}
            />
            <KpiCard
              title={t("dashboard.expired")}
              value={stats.expired}
              emoji="😱"
              destructive
              onAccess={() => router.push("/labels?status=expired")}
              onDiscard={() => handleBulkDiscard(expiredLabelIds)}
            />
            <KpiCard
              title={t("dashboard.expiringToday")}
              value={stats.expiringToday}
              emoji="🫨"
              destructive
              onAccess={() => router.push("/labels?status=expires_soon")}
              onDiscard={() => handleBulkDiscard(expiringTodayIds)}
            />
            <KpiCard
              title={t("dashboard.expiringTomorrow")}
              value={stats.expiringTomorrow}
              emoji="😳"
              destructive
              onAccess={() => router.push("/labels?status=expires_soon")}
              onDiscard={() => handleBulkDiscard(expiringTomorrowIds)}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <PieChartCard
              title={t("dashboard.labelsByEmployee")}
              data={employeeChartData}
            />
            <PieChartCard
              title={t("dashboard.labelsByStorage")}
              data={storageChartData}
            />
            <PieChartCard
              title={t("dashboard.labelsByPreservation")}
              data={preservationChartData}
            />
          </div>

          <BarChartCard
            title={t("dashboard.labelsByPeriod")}
            dailyData={barChartDaily}
            monthlyData={barChartMonthly}
          />

          {/* Recent Activity */}
          <div className="rounded-2xl border-2 border-border bg-card p-4 sm:p-5">
            <h3 className="mb-4 text-lg font-bold">{t("dashboard.recentActivity")}</h3>
            <div className="space-y-3">
              {recentLabels.map((label) => (
                <div
                  key={label.id}
                  className="flex min-h-[52px] items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold">
                      {label.productName}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {label.responsibleName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(label.createdAt), "MMM dd, HH:mm")}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={getLabelStatus(label)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
