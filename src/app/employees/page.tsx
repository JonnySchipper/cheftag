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
import { Employee } from "@/lib/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Plus,
  Search,
  ArrowUpDown,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const employeeSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  role: z.enum(["simple", "administrator"]),
});

type EmployeeForm = z.infer<typeof employeeSchema>;

export default function EmployeesPage() {
  const { employees, addEmployee, deleteEmployee, globalSearch } = useAppStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [newOpen, setNewOpen] = useState(false);

  const filterValue = globalSearch || search;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EmployeeForm>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { role: "simple" },
  });

  const columns: ColumnDef<Employee>[] = useMemo(
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
      { accessorKey: "username", header: t("employees.username") },
      { accessorKey: "email", header: t("common.email") },
      { accessorKey: "phone", header: t("common.phone") },
      {
        accessorKey: "role",
        header: t("common.role"),
        cell: ({ row }) => (
          <Badge
            variant={
              row.getValue("role") === "administrator"
                ? "default"
                : "secondary"
            }
          >
            {row.getValue("role") === "administrator"
              ? t("employees.administrator")
              : t("employees.simple")}
          </Badge>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              deleteEmployee(row.original.id);
              toast.success(t("toast.employeeDeleted"));
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        ),
      },
    ],
    [deleteEmployee]
  );

  const table = useReactTable({
    data: employees,
    columns,
    state: { sorting, globalFilter: filterValue },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const onSubmit = (data: EmployeeForm) => {
    addEmployee({
      id: `e-${Date.now()}`,
      ...data,
    });
    toast.success(t("toast.employeeCreated"));
    reset();
    setNewOpen(false);
  };

  return (
    <div>
      <PageHeader
        title={t("employees.title")}
        action={
          <Sheet open={newOpen} onOpenChange={setNewOpen}>
            <SheetTrigger
              render={<Button size="sm" className="gap-1" />}
            >
              <Plus className="w-4 h-4" />
              {t("employees.newEmployee")}
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{t("employees.newEmployee")}</SheetTitle>
              </SheetHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <UILabel>{t("common.name")}</UILabel>
                  <Input {...register("name")} placeholder="Full name" />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <UILabel>{t("employees.username")}</UILabel>
                  <Input {...register("username")} placeholder="username" />
                  {errors.username && (
                    <p className="text-xs text-destructive">{errors.username.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <UILabel>{t("common.email")}</UILabel>
                  <Input {...register("email")} type="email" placeholder="email@example.com" />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <UILabel>{t("common.phone")}</UILabel>
                  <Input {...register("phone")} placeholder="+55 11 99999-9999" />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <UILabel>{t("common.role")}</UILabel>
                  <Select defaultValue="simple" onValueChange={(v) => v && setValue("role", (v as string) as "simple" | "administrator")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">{t("employees.simple")}</SelectItem>
                      <SelectItem value="administrator">{t("employees.administrator")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setNewOpen(false)} className="flex-1">
                    {t("common.cancel")}
                  </Button>
                  <Button type="submit" className="flex-1">
                    {t("common.save")}
                  </Button>
                </div>
              </form>
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

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t("common.showing")} {table.getRowModel().rows.length} {t("common.of")}{" "}
            {employees.length} {t("common.results")}
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
