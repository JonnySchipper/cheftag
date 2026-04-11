"use client";

import { Badge } from "@/components/ui/badge";
import { LabelStatus } from "@/lib/types";
import { t } from "@/lib/i18n";

const statusConfig: Record<
  LabelStatus,
  { label: string; className: string }
> = {
  valid: {
    label: "labels.valid",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200",
  },
  expires_soon: {
    label: "labels.expiresSoon",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200",
  },
  expired: {
    label: "labels.expired",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200",
  },
};

export function StatusBadge({ status }: { status: LabelStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={config.className}>
      {status === "valid" && "😌 "}
      {status === "expires_soon" && "🫨 "}
      {status === "expired" && "😱 "}
      {t(config.label)}
    </Badge>
  );
}
