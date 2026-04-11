"use client";

import { useForm } from "react-hook-form";
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

const schema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  preservationModeId: z.string().min(1, "Preservation mode is required"),
  storageLocation: z.string().min(1, "Storage location is required"),
});

type FormData = z.infer<typeof schema>;

interface NewLabelFormProps {
  onClose: () => void;
}

export function NewLabelForm({ onClose }: NewLabelFormProps) {
  const {
    products,
    preservationModes,
    currentUserId,
    employees,
    addLabel,
    addToPrintQueue,
    setHighlightPrintAfterCreate,
  } = useAppStore();

  const currentUser = employees.find((e) => e.id === currentUserId)!;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      quantity: 1,
      storageLocation: "",
    },
  });

  const selectedProductId = watch("productId");
  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const selectedModeId = watch("preservationModeId");
  const selectedProductMode = selectedProduct?.preservationModes.find(
    (pm) => pm.modeId === selectedModeId
  );

  const storageLocations = [
    "Pizzaria",
    "Bar",
    "Walk-in Cooler",
    "Freezer Room",
    "Dry Storage",
    "Prep Station",
  ];

  const onSubmit = (data: FormData) => {
    const product = products.find((p) => p.id === data.productId)!;
    const productMode = product.preservationModes.find(
      (pm) => pm.modeId === data.preservationModeId
    )!;

    const newLabel = {
      id: `lbl-${Date.now()}`,
      productId: data.productId,
      productName: product.name,
      quantity: data.quantity,
      createdAt: new Date().toISOString(),
      preservationModeId: data.preservationModeId,
      preservationDurationHours: productMode.durationHours,
      storageLocation: data.storageLocation,
      responsibleId: currentUserId,
      responsibleName: currentUser.name,
    };

    addLabel(newLabel);
    addToPrintQueue(newLabel);
    setHighlightPrintAfterCreate(true);
    toast.success(t("toast.labelCreated"));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <UILabel>{t("labels.product")}</UILabel>
        <Select onValueChange={(v) => v && setValue("productId", v as string)}>
          <SelectTrigger>
            <SelectValue placeholder="Select product..." />
          </SelectTrigger>
          <SelectContent>
            {products.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.productId && (
          <p className="text-xs text-destructive">{errors.productId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <UILabel>{t("labels.quantity")}</UILabel>
        <Input
          type="number"
          min={1}
          {...register("quantity", { valueAsNumber: true })}
        />
        {errors.quantity && (
          <p className="text-xs text-destructive">{errors.quantity.message}</p>
        )}
      </div>

      {selectedProduct && (
        <div className="space-y-2">
          <UILabel>{t("labels.preservationMode")}</UILabel>
          <Select onValueChange={(v) => v && setValue("preservationModeId", v as string)}>
            <SelectTrigger>
              <SelectValue placeholder="Select mode..." />
            </SelectTrigger>
            <SelectContent>
              {selectedProduct.preservationModes.map((pm) => {
                const mode = preservationModes.find((m) => m.id === pm.modeId);
                return (
                  <SelectItem key={pm.modeId} value={pm.modeId}>
                    {mode?.name} ({pm.durationHours}h)
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {errors.preservationModeId && (
            <p className="text-xs text-destructive">
              {errors.preservationModeId.message}
            </p>
          )}
        </div>
      )}

      {selectedProductMode && (
        <div className="p-3 bg-muted rounded-lg text-sm">
          <p className="text-muted-foreground">
            Duration: <span className="font-medium text-foreground">{selectedProductMode.durationHours} hours</span>
          </p>
        </div>
      )}

      <div className="space-y-2">
        <UILabel>{t("labels.storageLocation")}</UILabel>
        <Select onValueChange={(v) => v && setValue("storageLocation", v as string)}>
          <SelectTrigger>
            <SelectValue placeholder="Select location..." />
          </SelectTrigger>
          <SelectContent>
            {storageLocations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.storageLocation && (
          <p className="text-xs text-destructive">
            {errors.storageLocation.message}
          </p>
        )}
      </div>

      <div className="p-3 bg-muted rounded-lg text-sm">
        <p className="text-muted-foreground">
          {t("labels.responsible")}:{" "}
          <span className="font-medium text-foreground">
            {currentUser.name}
          </span>
        </p>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          {t("common.cancel")}
        </Button>
        <Button type="submit" className="flex-1">
          {t("common.save")}
        </Button>
      </div>
    </form>
  );
}
