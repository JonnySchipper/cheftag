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
      className={`relative border rounded-xl p-4 bg-card transition-all duration-200 hover:shadow-md ${
        selected ? "ring-2 ring-primary border-primary" : "border-border"
      }`}
    >
      <div className="absolute top-3 left-3">
        <Checkbox
          checked={selected}
          onCheckedChange={onToggleSelect}
        />
      </div>

      <div className="absolute top-3 right-3">
        <StatusBadge status={status} />
      </div>

      <div className="mt-8 space-y-3">
        <div className="flex items-start gap-2">
          <Package className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
          <div>
            <p className="font-semibold text-sm">{label.productName}</p>
            <p className="text-xs text-muted-foreground">
              {t("labels.quantity")}: {label.quantity}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>
            {t("labels.expiresAt")}: {format(expiration, "MMM dd, yyyy HH:mm")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{label.storageLocation}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="w-3.5 h-3.5 shrink-0" />
          <span>{label.responsibleName}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t">
        <Button
          size="sm"
          variant="outline"
          className="w-full gap-2"
          onClick={onQuickPrint}
        >
          <Printer className="w-3.5 h-3.5" />
          {t("labels.quickPrint")}
        </Button>
      </div>
    </div>
  );
}
