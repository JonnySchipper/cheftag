"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  tabs?: ReactNode;
}

export function PageHeader({ title, action, tabs }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-card/80">
      <div className="mx-auto max-w-[1600px] px-3 sm:px-4 lg:px-6">
        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
          </div>
          {action && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>
          )}
        </div>
        {tabs && <div className="-mt-1 pb-3">{tabs}</div>}
        {!tabs && <div className="pb-1" />}
      </div>
    </div>
  );
}
