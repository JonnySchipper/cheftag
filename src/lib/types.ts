export interface PreservationMode {
  id: string;
  name: string;
  icon: string;
  durationHours: number;
}

export interface Group {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  groupId: string;
  sif: string;
  supplier: string;
  preservationModes: { modeId: string; durationHours: number }[];
}

export interface Employee {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: "simple" | "administrator";
}

export interface Device {
  id: string;
  name: string;
  printers: string[];
  lastPrint: string | null;
  lastSeen: string;
  online: boolean;
}

export interface Label {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  createdAt: string;
  preservationModeId: string;
  preservationDurationHours: number;
  storageLocation: string;
  responsibleId: string;
  responsibleName: string;
}

export interface ReportEntry extends Label {
  printed: boolean;
  discarded: boolean;
  discardedAt?: string;
}

export type LabelStatus = "valid" | "expires_soon" | "expired";

export function getLabelStatus(label: Label): LabelStatus {
  const created = new Date(label.createdAt);
  const expiration = new Date(
    created.getTime() + label.preservationDurationHours * 60 * 60 * 1000
  );
  const now = new Date();
  const hoursLeft =
    (expiration.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursLeft <= 0) return "expired";
  if (hoursLeft <= 48) return "expires_soon";
  return "valid";
}

export function getExpirationDate(label: Label): Date {
  const created = new Date(label.createdAt);
  return new Date(
    created.getTime() + label.preservationDurationHours * 60 * 60 * 1000
  );
}
