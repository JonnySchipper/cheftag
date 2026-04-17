"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Label,
  Product,
  Employee,
  Group,
  Device,
  PreservationMode,
  ReportEntry,
} from "@/lib/types";
import * as mockData from "@/lib/mock-data";

interface AppState {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Current user (fake auth)
  currentUserId: string;
  setCurrentUser: (id: string) => void;

  // Global search
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Data
  labels: Label[];
  products: Product[];
  employees: Employee[];
  groups: Group[];
  devices: Device[];
  preservationModes: PreservationMode[];
  reportEntries: ReportEntry[];

  // Label actions
  addLabel: (label: Label) => void;
  discardLabels: (ids: string[]) => void;
  printLabels: (ids: string[]) => void;

  // Product actions
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Employee actions
  addEmployee: (employee: Employee) => void;
  deleteEmployee: (id: string) => void;

  // Group actions
  addGroup: (group: Group) => void;
  deleteGroup: (id: string) => void;

  // Device actions
  addDevice: (device: Device) => void;

  // Preservation mode actions
  addPreservationMode: (mode: PreservationMode) => void;
  deletePreservationMode: (id: string) => void;

  // Selected items for bulk actions
  selectedLabelIds: string[];
  toggleLabelSelection: (id: string) => void;
  selectAllLabels: (ids: string[]) => void;
  clearLabelSelection: () => void;

  // Print queue
  printQueue: Label[];
  addToPrintQueue: (label: Label) => void;
  addLabelsToPrintQueue: (labels: Label[]) => void;
  removeFromPrintQueue: (ids: string[]) => void;
  clearPrintQueue: () => void;

  /** After creating a label, prompt user to print (highlight FAB / sheet). */
  highlightPrintAfterCreate: boolean;
  setHighlightPrintAfterCreate: (v: boolean) => void;

  // Hydration
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
}

/** Set by the store initializer so persist callbacks never touch `useAppStore` before init (TDZ). */
let markHydrated: (() => void) | undefined;

export const useAppStore = create<AppState>()(
  persist(
    (set) => {
      markHydrated = () => set({ _hasHydrated: true });
      return {
      darkMode: false,
      toggleDarkMode: () =>
        set((state) => ({ darkMode: !state.darkMode })),

      currentUserId: "e-1",
      setCurrentUser: (id: string) => set({ currentUserId: id }),

      globalSearch: "",
      setGlobalSearch: (q: string) => set({ globalSearch: q }),

      labels: mockData.labels,
      products: mockData.products,
      employees: mockData.employees,
      groups: mockData.groups,
      devices: mockData.devices,
      preservationModes: mockData.preservationModes,
      reportEntries: mockData.reportEntries,

      addLabel: (label: Label) =>
        set((state) => ({
          labels: [label, ...state.labels],
          reportEntries: [
            { ...label, printed: true, discarded: false } as ReportEntry,
            ...state.reportEntries,
          ],
        })),

      discardLabels: (ids: string[]) =>
        set((state) => ({
          labels: state.labels.filter((l) => !ids.includes(l.id)),
          reportEntries: state.reportEntries.map((r) =>
            ids.includes(r.id)
              ? { ...r, discarded: true, discardedAt: new Date().toISOString() }
              : r
          ),
        })),

      printLabels: (ids: string[]) =>
        set((state) => ({
          reportEntries: state.reportEntries.map((r) =>
            ids.includes(r.id) ? { ...r, printed: true } : r
          ),
        })),

      addProduct: (product: Product) =>
        set((state) => ({ products: [...state.products, product] })),

      updateProduct: (product: Product) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === product.id ? product : p
          ),
        })),

      deleteProduct: (id: string) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      addEmployee: (employee: Employee) =>
        set((state) => ({ employees: [...state.employees, employee] })),

      deleteEmployee: (id: string) =>
        set((state) => ({
          employees: state.employees.filter((e) => e.id !== id),
        })),

      addGroup: (group: Group) =>
        set((state) => ({ groups: [...state.groups, group] })),

      deleteGroup: (id: string) =>
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
        })),

      addDevice: (device: Device) =>
        set((state) => ({ devices: [...state.devices, device] })),

      addPreservationMode: (mode: PreservationMode) =>
        set((state) => ({
          preservationModes: [...state.preservationModes, mode],
        })),

      deletePreservationMode: (id: string) =>
        set((state) => ({
          preservationModes: state.preservationModes.filter(
            (m) => m.id !== id
          ),
        })),

      selectedLabelIds: [],
      toggleLabelSelection: (id: string) =>
        set((state) => ({
          selectedLabelIds: state.selectedLabelIds.includes(id)
            ? state.selectedLabelIds.filter((i) => i !== id)
            : [...state.selectedLabelIds, id],
        })),
      selectAllLabels: (ids: string[]) =>
        set({ selectedLabelIds: ids }),
      clearLabelSelection: () => set({ selectedLabelIds: [] }),

      printQueue: [],
      addToPrintQueue: (label: Label) =>
        set((state) => {
          if (state.printQueue.some((l) => l.id === label.id)) return state;
          return { printQueue: [...state.printQueue, label] };
        }),
      addLabelsToPrintQueue: (labels: Label[]) =>
        set((state) => {
          const ids = new Set(state.printQueue.map((l) => l.id));
          const toAdd = labels.filter((l) => !ids.has(l.id));
          if (toAdd.length === 0) return state;
          return { printQueue: [...state.printQueue, ...toAdd] };
        }),
      removeFromPrintQueue: (ids: string[]) =>
        set((state) => ({
          printQueue: state.printQueue.filter((l) => !ids.includes(l.id)),
        })),
      clearPrintQueue: () => set({ printQueue: [] }),

      highlightPrintAfterCreate: false,
      setHighlightPrintAfterCreate: (v: boolean) =>
        set({ highlightPrintAfterCreate: v }),

      _hasHydrated: false,
      setHasHydrated: (v: boolean) => set({ _hasHydrated: v }),
    };
    },
    {
      name: "cheftag-store",
      // Always unblock the UI after a rehydration attempt. On failure, `state` is
      // undefined but we must still set the flag (see zustand persist catch path).
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.warn("[cheftag-store] Persist rehydration failed:", error);
        }
        markHydrated?.();
      },
    }
  )
);
