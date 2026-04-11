"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { useAppStore } from "@/stores/app-store";
import { t } from "@/lib/i18n";
import { Group } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Search, ArrowUpDown, Trash2 } from "lucide-react";

const groupSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export default function GroupsPage() {
  const { groups, addGroup, deleteGroup, globalSearch } = useAppStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [newOpen, setNewOpen] = useState(false);

  const filterValue = globalSearch || search;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof groupSchema>>({
    resolver: zodResolver(groupSchema),
  });

  const columns: ColumnDef<Group>[] = useMemo(
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
        id: "actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              deleteGroup(row.original.id);
              toast.success(t("toast.groupDeleted"));
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        ),
      },
    ],
    [deleteGroup]
  );

  const table = useReactTable({
    data: groups,
    columns,
    state: { sorting, globalFilter: filterValue },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const onSubmit = (data: z.infer<typeof groupSchema>) => {
    addGroup({ id: `g-${Date.now()}`, name: data.name });
    toast.success(t("toast.groupCreated"));
    reset();
    setNewOpen(false);
  };

  return (
    <div>
      <PageHeader
        title={t("groups.title")}
        action={
          <Sheet open={newOpen} onOpenChange={setNewOpen}>
            <SheetTrigger
              render={<Button size="sm" className="gap-1" />}
            >
              <Plus className="w-4 h-4" />
              {t("groups.newGroup")}
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{t("groups.newGroup")}</SheetTitle>
              </SheetHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <UILabel>{t("common.name")}</UILabel>
                  <Input {...register("name")} placeholder="Group name" />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
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

      <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-4 lg:px-6 space-y-4 animate-fade-in">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder={t("common.search")} className="pl-8 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

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
