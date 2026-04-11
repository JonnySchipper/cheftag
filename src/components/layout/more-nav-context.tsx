"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

const MoreNavContext = createContext<(() => void) | null>(null);

export function MoreNavProvider({
  children,
  openMore,
}: {
  children: ReactNode;
  openMore: () => void;
}) {
  const value = useMemo(() => openMore, [openMore]);
  return (
    <MoreNavContext.Provider value={value}>{children}</MoreNavContext.Provider>
  );
}

export function useOpenMoreNav() {
  const ctx = useContext(MoreNavContext);
  if (!ctx) {
    throw new Error("useOpenMoreNav must be used within MoreNavProvider");
  }
  return ctx;
}
