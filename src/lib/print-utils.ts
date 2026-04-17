import { Label, getExpirationDate } from "./types";
import { format } from "date-fns";
import { useAppStore } from "@/stores/app-store";

/** Cheftag Print Server OpenAPI `LabelData` */
export interface CheftagLabelPayload {
  product_name: string;
  expiration: string;
  quantity: number;
  preservation: string;
  responsible: string;
  storage: string;
}

function parsePrintError(data: unknown): string {
  if (data && typeof data === "object") {
    if ("error" in data && typeof (data as { error: unknown }).error === "string") {
      return (data as { error: string }).error;
    }
    if ("detail" in data) {
      const detail = (data as { detail: unknown }).detail;
      if (typeof detail === "string") return detail;
      if (Array.isArray(detail)) {
        return detail
          .map((item) => {
            if (item && typeof item === "object" && "msg" in item) {
              return String((item as { msg: unknown }).msg);
            }
            return String(item);
          })
          .join("; ");
      }
    }
  }
  return "Print failed";
}

export function buildCheftagLabelPayload(label: Label): CheftagLabelPayload {
  const expiration = getExpirationDate(label);
  const { preservationModes } = useAppStore.getState();
  const mode = preservationModes.find((m) => m.id === label.preservationModeId);
  const preservation =
    mode?.name ?? `${label.preservationDurationHours}h`;

  return {
    product_name: label.productName,
    expiration: format(expiration, "dd/MM/yyyy HH:mm"),
    quantity: label.quantity,
    preservation,
    responsible: label.responsibleName,
    storage: label.storageLocation,
  };
}

export async function sendCheftagPrintPayload(
  payload: CheftagLabelPayload
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("/api/print-label", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data: unknown = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    return { ok: false, error: parsePrintError(data) };
  }

  if (
    data &&
    typeof data === "object" &&
    "status" in data &&
    (data as { status: unknown }).status === "printed"
  ) {
    return { ok: true };
  }

  return { ok: false, error: "Unexpected response from print server" };
}

export async function sendToPrinter(
  label: Label,
  _options?: { size?: "small" | "medium" | "large"; printerId?: string }
): Promise<boolean> {
  void _options;
  const payload = buildCheftagLabelPayload(label);
  const result = await sendCheftagPrintPayload(payload);
  return result.ok;
}

/** Connectivity check: sends a minimal label to the print server. */
export async function sendTestPrintToServer(): Promise<boolean> {
  const payload: CheftagLabelPayload = {
    product_name: "Cheftag test",
    expiration: format(new Date(), "dd/MM/yyyy HH:mm"),
    quantity: 1,
    preservation: "Test",
    responsible: "System",
    storage: "Kitchen",
  };
  const result = await sendCheftagPrintPayload(payload);
  return result.ok;
}

export function exportToCSV(
  data: Record<string, unknown>[],
  filename: string
): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((h) => {
          const val = String(row[h] ?? "");
          return val.includes(",") || val.includes('"')
            ? `"${val.replace(/"/g, '""')}"`
            : val;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportToPDF(
  data: Record<string, unknown>[],
  filename: string,
  title: string
): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  if (data.length === 0) return;

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 22);
  doc.setFontSize(10);
  doc.text(`Generated: ${format(new Date(), "MMM dd, yyyy HH:mm")}`, 14, 30);

  const headers = Object.keys(data[0]);
  const rows = data.map((row) => headers.map((h) => String(row[h] ?? "")));

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 36,
    styles: { fontSize: 7 },
    headStyles: { fillColor: [123, 33, 130] },
  });

  doc.save(`${filename}.pdf`);
}
