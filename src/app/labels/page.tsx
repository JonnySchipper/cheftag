"use client";

import { useMemo, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppStore } from "@/stores/app-store";
import { t } from "@/lib/i18n";
import { getLabelStatus, getExpirationDate } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { LabelCard } from "@/components/shared/label-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NewLabelForm } from "@/components/forms/new-label-form";
import { sendToPrinter, exportToCSV } from "@/lib/print-utils";
import { toast } from "sonner";
import { Plus, Printer, Trash2, Download, Search, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

function LabelsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    labels,
    selectedLabelIds,
    toggleLabelSelection,
    selectAllLabels,
    clearLabelSelection,
    discardLabels,
    printLabels,
    addLabelsToPrintQueue,
    setHighlightPrintAfterCreate,
    globalSearch,
  } = useAppStore();

  const [newLabelOpenLocal, setNewLabelOpenLocal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [responsibleFilter, setResponsibleFilter] = useState<string>("all");
  const [storageFilter, setStorageFilter] = useState<string>("all");
  const [localSearch, setLocalSearch] = useState("");

  const urlNewLabel = searchParams.get("action") === "new";
  const newLabelSheetOpen = urlNewLabel || newLabelOpenLocal;

  const searchTerm = globalSearch || localSearch;

  const uniqueResponsibles = useMemo(
    () => [...new Set(labels.map((l) => l.responsibleName))].sort(),
    [labels]
  );
  const uniqueStorages = useMemo(
    () => [...new Set(labels.map((l) => l.storageLocation))].sort(),
    [labels]
  );

  const filteredLabels = useMemo(() => {
    return labels.filter((label) => {
      if (statusFilter !== "all" && getLabelStatus(label) !== statusFilter)
        return false;
      if (
        responsibleFilter !== "all" &&
        label.responsibleName !== responsibleFilter
      )
        return false;
      if (storageFilter !== "all" && label.storageLocation !== storageFilter)
        return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          label.productName.toLowerCase().includes(q) ||
          label.responsibleName.toLowerCase().includes(q) ||
          label.storageLocation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [labels, statusFilter, responsibleFilter, storageFilter, searchTerm]);

  const handleQuickPrint = useCallback(
    async (labelId: string) => {
      const label = labels.find((l) => l.id === labelId);
      if (!label) return;
      await sendToPrinter(label);
      printLabels([labelId]);
      toast.success(t("toast.labelPrinted"));
    },
    [labels, printLabels]
  );

  const handleBulkPrint = useCallback(() => {
    const selectedLabels = labels.filter((l) =>
      selectedLabelIds.includes(l.id)
    );
    if (selectedLabels.length === 0) return;
    addLabelsToPrintQueue(selectedLabels);
    setHighlightPrintAfterCreate(true);
    clearLabelSelection();
    toast.success(t("toast.addedToPrintQueue"));
  }, [
    labels,
    selectedLabelIds,
    addLabelsToPrintQueue,
    clearLabelSelection,
    setHighlightPrintAfterCreate,
  ]);

  const handleBulkDiscard = useCallback(() => {
    discardLabels(selectedLabelIds);
    toast.success(`${selectedLabelIds.length} ${t("toast.labelsDiscarded")}`);
    clearLabelSelection();
  }, [selectedLabelIds, discardLabels, clearLabelSelection]);

  const handleExportCSV = useCallback(() => {
    const data = filteredLabels.map((l) => ({
      Product: l.productName,
      Quantity: l.quantity,
      Status: getLabelStatus(l),
      "Created At": format(new Date(l.createdAt), "yyyy-MM-dd HH:mm"),
      "Expires At": format(getExpirationDate(l), "yyyy-MM-dd HH:mm"),
      Storage: l.storageLocation,
      Responsible: l.responsibleName,
    }));
    exportToCSV(data, `labels-${format(new Date(), "yyyy-MM-dd")}`);
    toast.success(t("toast.exportSuccess"));
  }, [filteredLabels]);

  const handleSelectAll = () => {
    if (selectedLabelIds.length === filteredLabels.length) {
      clearLabelSelection();
    } else {
      selectAllLabels(filteredLabels.map((l) => l.id));
    }
  };

  const hasActiveFilters =
    statusFilter !== "all" ||
    responsibleFilter !== "all" ||
    storageFilter !== "all" ||
    localSearch !== "";

  const syncNewLabelSheet = (open: boolean) => {
    setNewLabelOpenLocal(open);
    if (!open && urlNewLabel) {
      router.replace("/labels", { scroll: false });
    }
  };

  return (
    <div>
      <PageHeader
        title={t("labels.title")}
        action={
          <Sheet open={newLabelSheetOpen} onOpenChange={syncNewLabelSheet}>
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
                <NewLabelForm onClose={() => syncNewLabelSheet(false)} />
              </div>
            </SheetContent>
          </Sheet>
        }
      />

      <div className="mx-auto max-w-[1600px] space-y-4 px-3 py-4 animate-fade-in sm:px-4 lg:px-6">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative min-w-[min(100%,280px)] flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("common.search")}
              className="h-12 min-h-[48px] rounded-xl pl-11 text-base"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
            <SelectTrigger className="h-12 min-h-[48px] w-full min-w-[140px] rounded-xl sm:w-44">
              <SelectValue placeholder={t("labels.filterByStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              <SelectItem value="valid">😌 {t("labels.valid")}</SelectItem>
              <SelectItem value="expires_soon">
                🫨 {t("labels.expiresSoon")}
              </SelectItem>
              <SelectItem value="expired">😱 {t("labels.expired")}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={responsibleFilter} onValueChange={(v) => setResponsibleFilter(v ?? "all")}>
            <SelectTrigger className="h-12 min-h-[48px] w-full min-w-[160px] rounded-xl sm:w-48">
              <SelectValue placeholder={t("labels.filterByResponsible")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              {uniqueResponsibles.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={storageFilter} onValueChange={(v) => setStorageFilter(v ?? "all")}>
            <SelectTrigger className="h-12 min-h-[48px] w-full min-w-[160px] rounded-xl sm:w-48">
              <SelectValue placeholder={t("labels.filterByStorage")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              {uniqueStorages.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="lg"
              className="h-12 rounded-xl"
              onClick={() => {
                setStatusFilter("all");
                setResponsibleFilter("all");
                setStorageFilter("all");
                setLocalSearch("");
              }}
            >
              <X className="mr-1 h-5 w-5" />
              {t("common.clearFilters")}
            </Button>
          )}

          <Button variant="outline" size="lg" className="ml-auto h-12 gap-2 rounded-xl font-semibold" onClick={handleExportCSV}>
            <Download className="h-5 w-5" />
            {t("common.exportCSV")}
          </Button>
        </div>

        {selectedLabelIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border-2 border-primary/30 bg-primary/10 p-3">
            <span className="text-base font-bold">
              {selectedLabelIds.length} {t("labels.selected")}
            </span>
            <Button size="lg" variant="outline" className="h-11 gap-2 font-semibold" onClick={handleBulkPrint}>
              <Printer className="h-4 w-4" />
              {t("labels.bulkPrint")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 gap-2 font-semibold text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={handleBulkDiscard}
            >
              <Trash2 className="h-4 w-4" />
              {t("labels.bulkDiscard")}
            </Button>
            <Button size="lg" variant="ghost" className="h-11 font-semibold" onClick={handleSelectAll}>
              {selectedLabelIds.length === filteredLabels.length
                ? t("labels.deselectAll")
                : t("labels.selectAll")}
            </Button>
          </div>
        )}

        <p className="text-base font-medium text-muted-foreground">
          {t("common.showing")} {filteredLabels.length} {t("common.of")}{" "}
          {labels.length} {t("common.results")}
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredLabels.map((label) => (
            <LabelCard
              key={label.id}
              label={label}
              selected={selectedLabelIds.includes(label.id)}
              onToggleSelect={() => toggleLabelSelection(label.id)}
              onQuickPrint={() => handleQuickPrint(label.id)}
            />
          ))}
        </div>

        {filteredLabels.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <p className="text-lg font-medium">{t("common.noResults")}</p>
          </div>
        )}
      </div>

      <div
        className={cn(
          "fixed inset-x-0 z-[35] border-t-2 border-primary/40 bg-card/98 px-3 py-3 backdrop-blur-md transition-transform duration-200 xl:hidden",
          "bottom-[calc(4.25rem+env(safe-area-inset-bottom))]",
          selectedLabelIds.length > 0 ? "translate-y-0" : "translate-y-full pointer-events-none"
        )}
      >
        <div className="mx-auto flex max-w-[1600px] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-base font-bold sm:text-left">
            {selectedLabelIds.length} {t("labels.selected")}
          </p>
          <Button
            type="button"
            size="lg"
            className="h-14 min-h-[56px] w-full gap-2 text-lg font-bold shadow-lg sm:max-w-md sm:flex-1"
            disabled={selectedLabelIds.length === 0}
            onClick={handleBulkPrint}
          >
            <Printer className="h-7 w-7" />
            {t("labels.printSelectedLarge")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function LabelsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-medium">{t("common.loading")}</div>}>
      <LabelsPageContent />
    </Suspense>
  );
}
