"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { useAppStore } from "@/stores/app-store";
import { t } from "@/lib/i18n";
import { PreservationMode } from "@/lib/types";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label as UILabel } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, ArrowUpDown, Trash2 } from "lucide-react";

const modeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().min(1, "Icon name is required"),
  durationHours: z.number().min(1, "Duration must be at least 1 hour"),
});

export default function PreservationModesPage() {
  const { preservationModes, addPreservationMode, deletePreservationMode } =
    useAppStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [newOpen, setNewOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof modeSchema>>({
    resolver: zodResolver(modeSchema),
    defaultValues: { durationHours: 24 },
  });

  const columns: ColumnDef<PreservationMode>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("common.name")}
            <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
      },
      {
        accessorKey: "icon",
        header: t("preservation.icon"),
        cell: ({ row }) => (
          <Badge variant="outline">{row.getValue("icon")}</Badge>
        ),
      },
      {
        accessorKey: "durationHours",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("preservation.duration")}
            <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => {
          const hours = row.getValue("durationHours") as number;
          if (hours >= 24) return `${Math.round(hours / 24)} days (${hours}h)`;
          return `${hours}h`;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              deletePreservationMode(row.original.id);
              toast.success(t("toast.modeDeleted"));
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        ),
      },
    ],
    [deletePreservationMode]
  );

  const table = useReactTable({
    data: preservationModes,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const onSubmit = (data: z.infer<typeof modeSchema>) => {
    addPreservationMode({
      id: `pm-${Date.now()}`,
      ...data,
    });
    toast.success(t("toast.modeCreated"));
    reset();
    setNewOpen(false);
  };

  return (
    <div>
      <PageHeader
        title={t("preservation.title")}
        action={
          <Sheet open={newOpen} onOpenChange={setNewOpen}>
            <SheetTrigger
              render={<Button size="sm" className="gap-1" />}
            >
              <Plus className="w-4 h-4" />
              {t("preservation.newMode")}
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{t("preservation.newMode")}</SheetTitle>
              </SheetHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <UILabel>{t("common.name")}</UILabel>
                  <Input {...register("name")} placeholder="e.g., Frozen" />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <UILabel>{t("preservation.icon")} (Lucide icon name)</UILabel>
                  <Input {...register("icon")} placeholder="e.g., Snowflake" />
                  {errors.icon && <p className="text-xs text-destructive">{errors.icon.message}</p>}
                </div>
                <div className="space-y-2">
                  <UILabel>{t("preservation.duration")}</UILabel>
                  <Input type="number" min={1} {...register("durationHours", { valueAsNumber: true })} />
                  {errors.durationHours && <p className="text-xs text-destructive">{errors.durationHours.message}</p>}
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

      <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-4 lg:px-6 animate-fade-in">
        <div className="bg-card border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8">{t("common.noResults")}</TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
