"use client";

import { Plus } from "lucide-react";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NewLabelForm } from "@/components/forms/new-label-form";
import { useState } from "react";

export function NewLabelFab() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            type="button"
            size="icon"
            className="pointer-events-auto fixed bottom-[calc(11rem+env(safe-area-inset-bottom))] right-4 z-50 h-14 w-14 rounded-2xl shadow-lg xl:bottom-8 xl:right-8 xl:h-16 xl:w-16"
            aria-label={t("dashboard.newLabel")}
          />
        }
      >
        <Plus className="h-8 w-8" strokeWidth={2.5} />
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">{t("dashboard.newLabel")}</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <NewLabelForm onClose={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
