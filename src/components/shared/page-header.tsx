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
    <div className="bg-card border-b border-border">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex items-start justify-between gap-4 pt-4">
          <div className="flex flex-col gap-1.5 flex-1 w-full">
            <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              {action}
            </div>
            {tabs && <div className="mt-1 pb-0">{tabs}</div>}
            {!tabs && <div className="pb-4" />}
          </div>
        </div>
      </div>
    </div>
  );
}
