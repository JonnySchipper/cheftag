"use client";

import { useEffect, useState, ReactNode } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/header";
import { KitchenBottomNav } from "@/components/layout/kitchen-bottom-nav";
import { DesktopShellNav } from "@/components/layout/desktop-shell-nav";
import { MoreNavProvider } from "@/components/layout/more-nav-context";
import { MoreSheet } from "@/components/layout/more-sheet";
import { BigPrintFab } from "@/components/layout/big-print-fab";
import { NewLabelFab } from "@/components/layout/new-label-fab";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { useAppStore } from "@/stores/app-store";

export function ClientLayout({ children }: { children: ReactNode }) {
  const darkMode = useAppStore((s) => s.darkMode);
  const hasHydrated = useAppStore((s) => s._hasHydrated);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-lg font-semibold text-primary">
          Loading Cheftag...
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <MoreNavProvider openMore={() => setMoreOpen(true)}>
        <div className="min-h-screen bg-background">
          <div className="flex min-h-screen">
            <DesktopShellNav />
            <div className="flex min-w-0 flex-1 flex-col">
              <Header />
              <main className="flex-1 pt-1 pb-[max(7rem,calc(env(safe-area-inset-bottom)+5.5rem))] xl:pb-10">
                {children}
              </main>
            </div>
          </div>
          <KitchenBottomNav />
          <MoreSheet open={moreOpen} onOpenChange={setMoreOpen} />
          <BigPrintFab />
          <NewLabelFab />
          <WhatsAppButton />
          <Toaster position="top-center" richColors className="sm:top-auto sm:right-4" />
        </div>
      </MoreNavProvider>
    </TooltipProvider>
  );
}
