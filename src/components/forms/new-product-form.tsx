"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppStore } from "@/stores/app-store";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label as UILabel } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Product } from "@/lib/types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  groupId: z.string().min(1, "Group is required"),
  sif: z.string().min(1, "SIF is required"),
  supplier: z.string().min(1, "Supplier is required"),
  preservationModes: z.array(
    z.object({
      modeId: z.string().min(1, "Mode is required"),
      durationHours: z.number().min(1, "Duration must be at least 1 hour"),
    })
  ).min(1, "At least one preservation mode is required"),
});

type FormData = z.infer<typeof schema>;

interface NewProductFormProps {
  onClose: () => void;
  existingProduct?: Product;
}

export function NewProductForm({ onClose, existingProduct }: NewProductFormProps) {
  const { groups, preservationModes, addProduct, updateProduct } = useAppStore();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: existingProduct
      ? {
          name: existingProduct.name,
          groupId: existingProduct.groupId,
          sif: existingProduct.sif,
          supplier: existingProduct.supplier,
          preservationModes: existingProduct.preservationModes,
        }
      : {
          preservationModes: [{ modeId: "", durationHours: 24 }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "preservationModes",
  });

  const onSubmit = (data: FormData) => {
    if (existingProduct) {
      updateProduct({ ...existingProduct, ...data });
      toast.success(t("toast.productUpdated"));
    } else {
      addProduct({
        id: `p-${Date.now()}`,
        ...data,
      });
      toast.success(t("toast.productCreated"));
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <UILabel>{t("common.name")}</UILabel>
        <Input {...register("name")} placeholder="Product name" />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <UILabel>{t("products.group")}</UILabel>
        <Select
          defaultValue={existingProduct?.groupId}
          onValueChange={(v) => v && setValue("groupId", v as string)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select group..." />
          </SelectTrigger>
          <SelectContent>
            {groups.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.groupId && (
          <p className="text-xs text-destructive">{errors.groupId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <UILabel>{t("products.sif")}</UILabel>
          <Input {...register("sif")} placeholder="SIF-XXXX" />
          {errors.sif && (
            <p className="text-xs text-destructive">{errors.sif.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <UILabel>{t("products.supplier")}</UILabel>
          <Input {...register("supplier")} placeholder="Supplier name" />
          {errors.supplier && (
            <p className="text-xs text-destructive">{errors.supplier.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <UILabel>{t("products.preservationModes")}</UILabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ modeId: "", durationHours: 24 })}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            {t("common.add")}
          </Button>
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              <Select
                defaultValue={field.modeId || undefined}
                onValueChange={(v) => v &&
                  setValue(`preservationModes.${index}.modeId`, v as string)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Mode..." />
                </SelectTrigger>
                <SelectContent>
                  {preservationModes.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-28 space-y-1">
              <Input
                type="number"
                min={1}
                placeholder="Hours"
                {...register(`preservationModes.${index}.durationHours`, {
                  valueAsNumber: true,
                })}
              />
            </div>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        {errors.preservationModes && (
          <p className="text-xs text-destructive">
            {typeof errors.preservationModes.message === "string"
              ? errors.preservationModes.message
              : "Please fill in all preservation modes"}
          </p>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          {t("common.cancel")}
        </Button>
        <Button type="submit" className="flex-1">
          {existingProduct ? t("common.save") : t("products.newProduct")}
        </Button>
      </div>
    </form>
  );
}
