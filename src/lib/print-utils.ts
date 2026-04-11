import { Label, getExpirationDate } from "./types";
import { format } from "date-fns";

// TODO: real Raspberry Pi endpoint
// Replace this with actual WebSocket or HTTP call to the Raspberry Pi printer
export async function sendToPrinter(
  label: Label,
  _options?: { size?: "small" | "medium" | "large"; printerId?: string } // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<boolean> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const expiration = getExpirationDate(label);

  // Generate label data that would be sent to the printer
  const _printData = {
    productName: label.productName,
    quantity: label.quantity,
    createdAt: format(new Date(label.createdAt), "dd/MM/yyyy HH:mm"),
    expiresAt: format(expiration, "dd/MM/yyyy HH:mm"),
    storageLocation: label.storageLocation,
    responsible: label.responsibleName,
    preservationDuration: `${label.preservationDurationHours}h`,
    qrCode: `cheftag://label/${label.id}`,
  };

  // In production, this would be:
  // const response = await fetch('http://raspberry-pi-ip:port/print', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ ...printData, ...options }),
  // });
  // return response.ok;

  console.log("[Cheftag] Print job sent:", _printData);
  return true;
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
