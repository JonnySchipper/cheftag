import {
  PreservationMode,
  Group,
  Product,
  Employee,
  Device,
  Label,
  ReportEntry,
} from "./types";

export const preservationModes: PreservationMode[] = [
  { id: "pm-1", name: "Frozen", icon: "Snowflake", durationHours: 720 },
  { id: "pm-2", name: "Refrigerated", icon: "Thermometer", durationHours: 120 },
  { id: "pm-3", name: "Room Temperature", icon: "Sun", durationHours: 48 },
  { id: "pm-4", name: "Vacuum Sealed", icon: "Package", durationHours: 360 },
  { id: "pm-5", name: "Dehydrated", icon: "Wind", durationHours: 2160 },
];

export const groups: Group[] = [
  { id: "g-1", name: "Bar" },
  { id: "g-2", name: "Mercearia" },
  { id: "g-3", name: "Hortifruti" },
  { id: "g-4", name: "Embutidos" },
  { id: "g-5", name: "Pizzaria" },
  { id: "g-6", name: "Confeitaria" },
  { id: "g-7", name: "Padaria" },
];

export const products: Product[] = [
  {
    id: "p-1",
    name: "Mozzarella Cheese",
    groupId: "g-5",
    sif: "SIF-1234",
    supplier: "Laticínios Serra",
    preservationModes: [
      { modeId: "pm-2", durationHours: 168 },
      { modeId: "pm-1", durationHours: 720 },
    ],
  },
  {
    id: "p-2",
    name: "Tomato Sauce",
    groupId: "g-5",
    sif: "SIF-2345",
    supplier: "Molhos Artesanais",
    preservationModes: [{ modeId: "pm-2", durationHours: 120 }],
  },
  {
    id: "p-3",
    name: "Fresh Lettuce",
    groupId: "g-3",
    sif: "SIF-3456",
    supplier: "Horta Viva",
    preservationModes: [{ modeId: "pm-2", durationHours: 72 }],
  },
  {
    id: "p-4",
    name: "Pepperoni",
    groupId: "g-4",
    sif: "SIF-4567",
    supplier: "Frios Premium",
    preservationModes: [
      { modeId: "pm-2", durationHours: 96 },
      { modeId: "pm-1", durationHours: 360 },
    ],
  },
  {
    id: "p-5",
    name: "Pizza Dough",
    groupId: "g-5",
    sif: "SIF-5678",
    supplier: "In-house",
    preservationModes: [
      { modeId: "pm-2", durationHours: 48 },
      { modeId: "pm-1", durationHours: 168 },
    ],
  },
  {
    id: "p-6",
    name: "Orange Juice",
    groupId: "g-1",
    sif: "SIF-6789",
    supplier: "Sucos Naturais",
    preservationModes: [{ modeId: "pm-2", durationHours: 24 }],
  },
  {
    id: "p-7",
    name: "Olive Oil",
    groupId: "g-2",
    sif: "SIF-7890",
    supplier: "Azeites Importados",
    preservationModes: [{ modeId: "pm-3", durationHours: 4320 }],
  },
  {
    id: "p-8",
    name: "Chocolate Cake",
    groupId: "g-6",
    sif: "SIF-8901",
    supplier: "In-house",
    preservationModes: [{ modeId: "pm-2", durationHours: 72 }],
  },
  {
    id: "p-9",
    name: "Artisan Bread",
    groupId: "g-7",
    sif: "SIF-9012",
    supplier: "In-house",
    preservationModes: [{ modeId: "pm-3", durationHours: 24 }],
  },
  {
    id: "p-10",
    name: "Ham",
    groupId: "g-4",
    sif: "SIF-0123",
    supplier: "Frios Premium",
    preservationModes: [
      { modeId: "pm-2", durationHours: 120 },
      { modeId: "pm-4", durationHours: 360 },
    ],
  },
  {
    id: "p-11",
    name: "Tomatoes",
    groupId: "g-3",
    sif: "SIF-1122",
    supplier: "Horta Viva",
    preservationModes: [{ modeId: "pm-3", durationHours: 96 }],
  },
  {
    id: "p-12",
    name: "Parmesan Cheese",
    groupId: "g-5",
    sif: "SIF-2233",
    supplier: "Laticínios Serra",
    preservationModes: [{ modeId: "pm-2", durationHours: 240 }],
  },
];

export const employees: Employee[] = [
  {
    id: "e-1",
    name: "Renato Veras",
    username: "renato.veras",
    email: "renato@deveras.com",
    phone: "+55 11 98111-2233",
    role: "administrator",
  },
  {
    id: "e-2",
    name: "Diogo Donato",
    username: "diogo.donato",
    email: "diogo@deveras.com",
    phone: "+55 11 98765-4321",
    role: "simple",
  },
  {
    id: "e-3",
    name: "Robson Jesus",
    username: "robson.jesus",
    email: "robson@deveras.com",
    phone: "+55 11 91234-5678",
    role: "simple",
  },
  {
    id: "e-4",
    name: "Everaldo Moura",
    username: "everaldo.moura",
    email: "everaldo@deveras.com",
    phone: "+55 11 94567-8901",
    role: "simple",
  },
  {
    id: "e-5",
    name: "José Fragoso",
    username: "jose.fragoso",
    email: "jose@deveras.com",
    phone: "+55 11 92345-6789",
    role: "simple",
  },
  {
    id: "e-6",
    name: "Nickollas Matheus",
    username: "nickollas.matheus",
    email: "nickollas@deveras.com",
    phone: "+55 11 95678-9012",
    role: "administrator",
  },
  {
    id: "e-7",
    name: "Lucimar Andrade",
    username: "lucimar.andrade",
    email: "lucimar@deveras.com",
    phone: "+55 11 93456-7890",
    role: "simple",
  },
  {
    id: "e-8",
    name: "Lucas Cardoso",
    username: "lucas.cardoso",
    email: "lucas@deveras.com",
    phone: "+55 11 96789-0123",
    role: "simple",
  },
  {
    id: "e-9",
    name: "Daniel Araujo",
    username: "daniel.araujo",
    email: "daniel@deveras.com",
    phone: "+55 11 97890-1234",
    role: "simple",
  },
];

export const devices: Device[] = [
  {
    id: "d-1",
    name: "Kitchen Printer 1",
    printers: ["Zebra ZD421", "Brother QL-820NWB"],
    lastPrint: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    lastSeen: new Date().toISOString(),
    online: true,
  },
  {
    id: "d-2",
    name: "Bar Printer",
    printers: ["Zebra ZD421"],
    lastPrint: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    lastSeen: new Date().toISOString(),
    online: true,
  },
  {
    id: "d-3",
    name: "Storage Room Printer",
    printers: ["Brother QL-820NWB"],
    lastPrint: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    online: false,
  },
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateLabels(): Label[] {
  const storageLocations = [
    "Pizzaria",
    "Bar",
    "Walk-in Cooler",
    "Freezer Room",
    "Dry Storage",
    "Prep Station",
  ];
  const labels: Label[] = [];
  const now = Date.now();

  for (let i = 0; i < 311; i++) {
    const product = randomElement(products);
    const employee = randomElement(employees);
    const mode = randomElement(product.preservationModes);
    const preservationMode = preservationModes.find(
      (pm) => pm.id === mode.modeId
    )!;
    const hoursAgo = Math.floor(Math.random() * 200);
    const createdAt = new Date(now - hoursAgo * 60 * 60 * 1000);

    labels.push({
      id: `lbl-${i + 1}`,
      productId: product.id,
      productName: product.name,
      quantity: Math.floor(Math.random() * 10) + 1,
      createdAt: createdAt.toISOString(),
      preservationModeId: preservationMode.id,
      preservationDurationHours: mode.durationHours,
      storageLocation: randomElement(storageLocations),
      responsibleId: employee.id,
      responsibleName: employee.name,
    });
  }

  return labels;
}

function generateReportEntries(labels: Label[]): ReportEntry[] {
  return labels.map((label) => {
    const discarded = Math.random() < 0.09;
    return {
      ...label,
      printed: Math.random() < 0.85,
      discarded,
      discardedAt: discarded
        ? new Date(
            new Date(label.createdAt).getTime() +
              label.preservationDurationHours * 60 * 60 * 1000 +
              Math.random() * 1000 * 60 * 60 * 2
          ).toISOString()
        : undefined,
    };
  });
}

export const labels: Label[] = generateLabels();
export const reportEntries: ReportEntry[] = generateReportEntries(labels);
