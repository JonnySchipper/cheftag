"use client";

import { useEffect, ReactNode } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { useAppStore } from "@/stores/app-store";

export function ClientLayout({ children }: { children: ReactNode }) {
  const darkMode = useAppStore((s) => s.darkMode);
  const hasHydrated = useAppStore((s) => s._hasHydrated);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-lg font-semibold">
          Loading Cheftag...
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pb-20 lg:pb-0">{children}</main>
        <MobileNav />
        <WhatsAppButton />
        <Toaster position="top-right" richColors />
      </div>
    </TooltipProvider>
  );
}
