"use client";

import { LabelStatus } from "@/lib/types";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  LabelStatus,
  { label: string; className: string }
> = {
  valid: {
    label: "labels.valid",
    className:
      "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
  },
  expires_soon: {
    label: "labels.expiresSoon",
    className:
      "bg-amber-100 text-amber-950 dark:bg-amber-900/40 dark:text-amber-200 border-amber-400 dark:border-amber-700",
  },
  expired: {
    label: "labels.expired",
    className:
      "bg-red-100 text-red-950 dark:bg-red-900/40 dark:text-red-200 border-red-400 dark:border-red-800",
  },
};

interface StatusBadgeProps {
  status: LabelStatus;
  size?: "default" | "large";
}

export function StatusBadge({ status, size = "default" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const large = size === "large";
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-lg border font-bold leading-tight",
        large ? "px-3 py-1.5 text-sm sm:text-base" : "px-2 py-1 text-xs",
        config.className
      )}
    >
      {status === "valid" && "😌 "}
      {status === "expires_soon" && "🫨 "}
      {status === "expired" && "😱 "}
      {t(config.label)}
    </span>
  );
}
