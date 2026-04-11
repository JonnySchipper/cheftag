"use client";

import { Label, getLabelStatus, getExpirationDate } from "@/lib/types";
import { StatusBadge } from "./status-badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Printer, Clock, MapPin, User, Package } from "lucide-react";
import { t } from "@/lib/i18n";
import { format } from "date-fns";

interface LabelCardProps {
  label: Label;
  selected: boolean;
  onToggleSelect: () => void;
  onQuickPrint: () => void;
}

export function LabelCard({
  label,
  selected,
  onToggleSelect,
  onQuickPrint,
}: LabelCardProps) {
  const status = getLabelStatus(label);
  const expiration = getExpirationDate(label);

  return (
    <div
      className={`relative rounded-2xl border-2 bg-card p-4 transition-all duration-200 active:scale-[0.99] ${
        selected ? "border-primary ring-2 ring-primary/30" : "border-border"
      }`}
    >
      <div className="absolute left-3 top-3">
        <Checkbox
          checked={selected}
          onCheckedChange={onToggleSelect}
          className="h-6 w-6 rounded-md"
        />
      </div>

      <div className="absolute right-3 top-3 max-w-[55%]">
        <StatusBadge status={status} size="large" />
      </div>

      <div className="mt-10 space-y-3">
        <div className="flex items-start gap-2 pr-1">
          <Package className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="text-base font-bold leading-snug">{label.productName}</p>
            <p className="text-sm font-medium text-muted-foreground">
              {t("labels.quantity")}: {label.quantity}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0" />
          <span>
            {t("labels.expiresAt")}: {format(expiration, "MMM dd, yyyy HH:mm")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">{label.storageLocation}</span>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <User className="h-4 w-4 shrink-0" />
          <span className="truncate">{label.responsibleName}</span>
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-3">
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="h-12 w-full gap-2 text-base font-bold"
          onClick={onQuickPrint}
        >
          <Printer className="h-5 w-5" />
          {t("labels.quickPrint")}
        </Button>
      </div>
    </div>
  );
}
