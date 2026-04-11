"use client";

import { t } from "@/lib/i18n";
import { ArrowRightToLine, Trash2 } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: number;
  emoji?: string;
  destructive?: boolean;
  onAccess?: () => void;
  onDiscard?: () => void;
}

export function KpiCard({
  title,
  value,
  emoji,
  destructive,
  onAccess,
  onDiscard,
}: KpiCardProps) {
  return (
    <div className="flex h-full min-h-[120px] flex-col justify-between gap-3 rounded-2xl border-2 border-border bg-card p-4">
      <div className="flex flex-row gap-2 md:flex-col max-md:items-center max-md:justify-between">
        <p className="text-base font-bold leading-tight text-muted-foreground">
          {emoji && `${emoji} `}
          {title}
        </p>
        <p
          className={`text-3xl font-black tabular-nums md:text-5xl ${
            destructive ? "text-destructive" : "text-foreground"
          }`}
        >
          {value}
        </p>
      </div>
      {(onAccess || onDiscard) && (
        <div className="flex flex-wrap gap-2">
          {onAccess && (
            <button
              type="button"
              onClick={onAccess}
              className="group flex min-h-[44px] min-w-[44px] flex-1 items-center justify-between gap-2 rounded-xl bg-muted px-3 py-2 font-semibold transition-colors hover:bg-primary/20"
            >
              <span className="text-sm text-muted-foreground group-hover:text-primary">
                {t("dashboard.access")}
              </span>
              <ArrowRightToLine className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary" />
            </button>
          )}
          {onDiscard && (
            <button
              type="button"
              onClick={onDiscard}
              className="flex min-h-[44px] min-w-[44px] flex-1 items-center justify-between gap-2 rounded-xl bg-destructive/20 px-3 py-2 font-semibold text-destructive transition-colors hover:bg-destructive/30"
            >
              <span className="text-sm">{t("dashboard.discard")}</span>
              <Trash2 className="h-5 w-5 shrink-0" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
