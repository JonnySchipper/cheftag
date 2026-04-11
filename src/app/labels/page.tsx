"use client";

import { useMemo, useState, useCallback } from "react";
import { useAppStore } from "@/stores/app-store";
import { t } from "@/lib/i18n";
import { getLabelStatus, LabelStatus } from "@/lib/types";
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
import { getExpirationDate } from "@/lib/types";

export default function LabelsPage() {
  const {
    labels,
    selectedLabelIds,
    toggleLabelSelection,
    selectAllLabels,
    clearLabelSelection,
    discardLabels,
    printLabels,
    globalSearch,
  } = useAppStore();

  const [newLabelOpen, setNewLabelOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [responsibleFilter, setResponsibleFilter] = useState<string>("all");
  const [storageFilter, setStorageFilter] = useState<string>("all");
  const [localSearch, setLocalSearch] = useState("");

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

  const handleBulkPrint = useCallback(async () => {
    const selectedLabels = labels.filter((l) =>
      selectedLabelIds.includes(l.id)
    );
    for (const label of selectedLabels) {
      await sendToPrinter(label);
    }
    printLabels(selectedLabelIds);
    toast.success(`${selectedLabelIds.length} ${t("toast.labelsPrinted")}`);
    clearLabelSelection();
  }, [labels, selectedLabelIds, printLabels, clearLabelSelection]);

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

  return (
    <div>
      <PageHeader
        title={t("labels.title")}
        action={
          <Sheet open={newLabelOpen} onOpenChange={setNewLabelOpen}>
            <SheetTrigger
              render={<Button size="sm" className="gap-1" />}
            >
              <Plus className="w-4 h-4" />
              {t("dashboard.newLabel")}
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{t("dashboard.newLabel")}</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <NewLabelForm onClose={() => setNewLabelOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        }
      />

      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-4 space-y-4 animate-fade-in">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("common.search")}
              className="pl-8 h-9"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
            <SelectTrigger className="w-40 h-9">
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
            <SelectTrigger className="w-44 h-9">
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
            <SelectTrigger className="w-44 h-9">
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
              size="sm"
              onClick={() => {
                setStatusFilter("all");
                setResponsibleFilter("all");
                setStorageFilter("all");
                setLocalSearch("");
              }}
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}

          <Button variant="outline" size="sm" className="gap-1 ml-auto" onClick={handleExportCSV}>
            <Download className="w-4 h-4" />
            {t("common.exportCSV")}
          </Button>
        </div>

        {/* Bulk actions bar */}
        {selectedLabelIds.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl border border-primary/20 animate-fade-in">
            <span className="text-sm font-medium">
              {selectedLabelIds.length} {t("labels.selected")}
            </span>
            <Button size="sm" variant="outline" className="gap-1" onClick={handleBulkPrint}>
              <Printer className="w-3.5 h-3.5" />
              {t("labels.bulkPrint")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={handleBulkDiscard}
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t("labels.bulkDiscard")}
            </Button>
            <Button size="sm" variant="ghost" onClick={handleSelectAll}>
              {selectedLabelIds.length === filteredLabels.length
                ? "Deselect all"
                : t("labels.selectAll")}
            </Button>
          </div>
        )}

        {/* Label count */}
        <p className="text-sm text-muted-foreground">
          {t("common.showing")} {filteredLabels.length} {t("common.of")}{" "}
          {labels.length} {t("common.results")}
        </p>

        {/* Label grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">{t("common.noResults")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
