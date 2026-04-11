"use client";

import { useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { useAppStore } from "@/stores/app-store";
import { t } from "@/lib/i18n";
import { ReportEntry, getLabelStatus, getExpirationDate } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { exportToCSV, exportToPDF } from "@/lib/print-utils";
import { toast } from "sonner";
import {
  Search,
  ArrowUpDown,
  Download,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";

export default function ReportsPage() {
  const { reportEntries, globalSearch } = useAppStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const filterValue = globalSearch || search;

  const summaryStats = useMemo(() => {
    const total = reportEntries.length;
    const printed = reportEntries.filter((r) => r.printed).length;
    const discarded = reportEntries.filter((r) => r.discarded).length;
    return { total, printed, discarded };
  }, [reportEntries]);

  const columns: ColumnDef<ReportEntry>[] = useMemo(
    () => [
      {
        accessorKey: "productName",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("labels.product")}
            <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue("productName")}</span>
        ),
      },
      {
        accessorKey: "quantity",
        header: t("labels.quantity"),
      },
      {
        id: "status",
        header: t("common.status"),
        cell: ({ row }) => <StatusBadge status={getLabelStatus(row.original)} />,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("labels.createdAt")}
            <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) =>
          format(new Date(row.getValue("createdAt")), "MMM dd, yyyy HH:mm"),
      },
      {
        id: "expiresAt",
        header: t("labels.expiresAt"),
        cell: ({ row }) =>
          format(getExpirationDate(row.original), "MMM dd, yyyy HH:mm"),
      },
      {
        accessorKey: "storageLocation",
        header: t("labels.storageLocation"),
      },
      {
        accessorKey: "responsibleName",
        header: t("labels.responsible"),
      },
      {
        accessorKey: "printed",
        header: t("dashboard.printed"),
        cell: ({ row }) =>
          row.getValue("printed") ? (
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Yes</Badge>
          ) : (
            <Badge variant="secondary">No</Badge>
          ),
      },
      {
        accessorKey: "discarded",
        header: t("dashboard.discarded"),
        cell: ({ row }) =>
          row.getValue("discarded") ? (
            <Badge className="bg-red-100 text-red-800 border-red-200">Yes</Badge>
          ) : (
            <Badge variant="secondary">No</Badge>
          ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: reportEntries,
    columns,
    state: { sorting, globalFilter: filterValue },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  const handleExportCSV = useCallback(() => {
    const data = reportEntries.map((r) => ({
      Product: r.productName,
      Quantity: r.quantity,
      Status: getLabelStatus(r),
      "Created At": format(new Date(r.createdAt), "yyyy-MM-dd HH:mm"),
      "Expires At": format(getExpirationDate(r), "yyyy-MM-dd HH:mm"),
      Storage: r.storageLocation,
      Responsible: r.responsibleName,
      Printed: r.printed ? "Yes" : "No",
      Discarded: r.discarded ? "Yes" : "No",
    }));
    exportToCSV(data, `report-${format(new Date(), "yyyy-MM-dd")}`);
    toast.success(t("toast.exportSuccess"));
  }, [reportEntries]);

  const handleExportPDF = useCallback(async () => {
    const data = reportEntries.map((r) => ({
      Product: r.productName,
      Qty: r.quantity,
      Status: getLabelStatus(r),
      Created: format(new Date(r.createdAt), "MM/dd HH:mm"),
      Expires: format(getExpirationDate(r), "MM/dd HH:mm"),
      Storage: r.storageLocation,
      Responsible: r.responsibleName,
      Printed: r.printed ? "Yes" : "No",
      Discarded: r.discarded ? "Yes" : "No",
    }));
    await exportToPDF(
      data,
      `report-${format(new Date(), "yyyy-MM-dd")}`,
      "Cheftag - Label Report"
    );
    toast.success(t("toast.exportSuccess"));
  }, [reportEntries]);

  return (
    <div>
      <PageHeader title={t("reports.title")} />

      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-4 space-y-4 animate-fade-in">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-card border rounded-xl">
            <p className="text-sm text-muted-foreground">{t("dashboard.totalLabels")}</p>
            <p className="text-3xl font-bold">{summaryStats.total}</p>
          </div>
          <div className="p-4 bg-card border rounded-xl">
            <p className="text-sm text-muted-foreground">{t("reports.totalPrinted")}</p>
            <p className="text-3xl font-bold text-emerald-600">{summaryStats.printed}</p>
          </div>
          <div className="p-4 bg-card border rounded-xl">
            <p className="text-sm text-muted-foreground">{t("reports.totalDiscarded")}</p>
            <p className="text-3xl font-bold text-destructive">{summaryStats.discarded}</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("common.search")}
              className="pl-8 h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" className="gap-1" onClick={handleExportCSV}>
              <Download className="w-4 h-4" />
              {t("common.exportCSV")}
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={handleExportPDF}>
              <FileText className="w-4 h-4" />
              {t("common.exportPDF")}
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border rounded-xl overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8">
                    {t("common.noResults")}
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()} ({reportEntries.length} total)
          </p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <ChevronLeft className="w-4 h-4" /> {t("common.previous")}
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              {t("common.next")} <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
