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
    <div className="flex flex-col justify-between gap-2.5 h-full p-3 border rounded-xl border-border bg-card">
      <div className="flex flex-row md:flex-col max-md:items-center max-md:justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">
          {emoji && `${emoji} `}
          {title}
        </p>
        <p
          className={`text-xl md:text-5xl font-bold ${
            destructive ? "text-destructive" : "text-foreground"
          }`}
        >
          {value}
        </p>
      </div>
      {(onAccess || onDiscard) && (
        <div className="flex gap-2">
          {onAccess && (
            <button
              onClick={onAccess}
              className="flex items-center gap-2 flex-1 py-1 px-2 rounded-full transition-all duration-300 group justify-between bg-muted hover:bg-primary/20"
            >
              <p className="text-xs font-semibold text-muted-foreground group-hover:text-primary">
                {t("dashboard.access")}
              </p>
              <ArrowRightToLine className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </button>
          )}
          {onDiscard && (
            <button
              onClick={onDiscard}
              className="flex items-center gap-2 flex-1 py-1 px-2 rounded-full transition-all duration-300 group justify-between bg-destructive/20 hover:bg-destructive/10"
            >
              <p className="text-xs font-semibold text-destructive">
                {t("dashboard.discard")}
              </p>
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
