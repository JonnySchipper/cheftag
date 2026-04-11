"use client";

import { useState, useMemo } from "react";
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
import { Product } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NewProductForm } from "@/components/forms/new-product-form";
import { toast } from "sonner";
import {
  Plus,
  Search,
  ArrowUpDown,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function ProductsPage() {
  const { products, groups, preservationModes, deleteProduct, globalSearch } =
    useAppStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const filterValue = globalSearch || search;

  const columns: ColumnDef<Product>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            {t("common.name")}
            <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue("name")}</span>
        ),
      },
      {
        accessorKey: "groupId",
        header: t("products.group"),
        cell: ({ row }) => {
          const group = groups.find(
            (g) => g.id === row.getValue("groupId")
          );
          return <Badge variant="outline">{group?.name || "—"}</Badge>;
        },
      },
      { accessorKey: "sif", header: t("products.sif") },
      { accessorKey: "supplier", header: t("products.supplier") },
      {
        accessorKey: "preservationModes",
        header: t("products.preservationModes"),
        cell: ({ row }) => {
          const modes = row.original.preservationModes;
          return (
            <div className="flex gap-1 flex-wrap">
              {modes.map((pm) => {
                const mode = preservationModes.find(
                  (m) => m.id === pm.modeId
                );
                return (
                  <Badge key={pm.modeId} variant="secondary" className="text-xs">
                    {mode?.name} ({pm.durationHours}h)
                  </Badge>
                );
              })}
            </div>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditProduct(row.original)}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => {
                deleteProduct(row.original.id);
                toast.success(t("toast.productDeleted"));
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [groups, preservationModes, deleteProduct]
  );

  const table = useReactTable({
    data: products,
    columns,
    state: { sorting, globalFilter: filterValue },
    onSortingChange: setSorting,
    onGlobalFilterChange: () => {},
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div>
      <PageHeader
        title={t("products.title")}
        action={
          <Sheet open={newOpen} onOpenChange={setNewOpen}>
            <SheetTrigger
              render={<Button size="sm" className="gap-1" />}
            >
              <Plus className="w-4 h-4" />
              {t("products.newProduct")}
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{t("products.newProduct")}</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <NewProductForm onClose={() => setNewOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        }
      />

      <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-4 lg:px-6 space-y-4 animate-fade-in">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("common.search")}
            className="pl-8 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-card border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t("common.showing")} {table.getRowModel().rows.length} {t("common.of")}{" "}
            {products.length} {t("common.results")}
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="w-4 h-4" />
              {t("common.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {t("common.next")}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit product sheet */}
      <Sheet open={!!editProduct} onOpenChange={(open) => !open && setEditProduct(null)}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{t("products.editProduct")}</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {editProduct && (
              <NewProductForm
                existingProduct={editProduct}
                onClose={() => setEditProduct(null)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
