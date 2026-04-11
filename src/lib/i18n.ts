const en: Record<string, string> = {
  // Nav
  "nav.dashboard": "Dashboard",
  "nav.labels": "Labels",
  "nav.products": "Products",
  "nav.employees": "Employees",
  "nav.groups": "Groups",
  "nav.devices": "Devices",
  "nav.reports": "Reports",
  "nav.printing": "Printing",
  "nav.settings": "Settings",
  "nav.preservationModes": "Preservation Modes",
  "nav.stockControl": "Stock Control",

  // Common
  "common.search": "Search...",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.add": "Add",
  "common.new": "New",
  "common.actions": "Actions",
  "common.name": "Name",
  "common.email": "Email",
  "common.phone": "Phone",
  "common.role": "Role",
  "common.status": "Status",
  "common.all": "All",
  "common.export": "Export",
  "common.exportCSV": "Export CSV",
  "common.exportPDF": "Export PDF",
  "common.close": "Close",
  "common.confirm": "Confirm",
  "common.loading": "Loading...",
  "common.noResults": "No results found",
  "common.showing": "Showing",
  "common.of": "of",
  "common.results": "results",
  "common.previous": "Previous",
  "common.next": "Next",

  // Dashboard
  "dashboard.title": "Dashboard",
  "dashboard.newLabel": "New label",
  "dashboard.totalLabels": "Total labels",
  "dashboard.discarded": "Discarded",
  "dashboard.active": "Active",
  "dashboard.expired": "Expired",
  "dashboard.expiringToday": "Expiring today",
  "dashboard.expiringTomorrow": "Expiring tomorrow",
  "dashboard.access": "Access",
  "dashboard.discard": "Discard",
  "dashboard.labelsByEmployee": "Labels by employees",
  "dashboard.labelsByStorage": "Labels by storage location",
  "dashboard.labelsByPreservation": "Labels by preservation mode",
  "dashboard.labelsByPeriod": "Labels by period",
  "dashboard.day": "Day",
  "dashboard.month": "Month",
  "dashboard.printed": "Printed",
  "dashboard.recentActivity": "Recent activity",

  // Labels
  "labels.title": "Label Control",
  "labels.quickPrint": "Quick print",
  "labels.bulkPrint": "Print selected",
  "labels.bulkDiscard": "Discard selected",
  "labels.printAll": "Print all",
  "labels.selected": "selected",
  "labels.selectAll": "Select all",
  "labels.createdAt": "Created",
  "labels.expiresAt": "Expires",
  "labels.quantity": "Quantity",
  "labels.storageLocation": "Storage location",
  "labels.responsible": "Responsible",
  "labels.preservationMode": "Preservation mode",
  "labels.product": "Product",
  "labels.valid": "Valid",
  "labels.expiresSoon": "Expires soon",
  "labels.expired": "Expired",
  "labels.filterByStatus": "Filter by status",
  "labels.filterByResponsible": "Filter by responsible",
  "labels.filterByStorage": "Filter by storage",
  "labels.filterByPreservation": "Filter by preservation",
  "labels.filterByPeriod": "Filter by period",

  // Products
  "products.title": "Products",
  "products.newProduct": "New product",
  "products.sif": "SIF",
  "products.supplier": "Supplier",
  "products.group": "Group",
  "products.preservationModes": "Preservation modes",
  "products.duration": "Duration",
  "products.editProduct": "Edit product",

  // Employees
  "employees.title": "Employees",
  "employees.newEmployee": "New employee",
  "employees.username": "Username",
  "employees.administrator": "Administrator",
  "employees.simple": "Simple",

  // Groups
  "groups.title": "Groups",
  "groups.newGroup": "New group",

  // Devices
  "devices.title": "Devices",
  "devices.online": "Online",
  "devices.offline": "Offline",
  "devices.lastPrint": "Last print",
  "devices.lastSeen": "Last seen",
  "devices.printers": "Printers",
  "devices.printTest": "Print test label",
  "devices.newDevice": "New device",

  // Reports
  "reports.title": "Reports",
  "reports.summary": "Summary",
  "reports.totalPrinted": "Total printed",
  "reports.totalDiscarded": "Total discarded",

  // Preservation Modes
  "preservation.title": "Preservation Modes",
  "preservation.newMode": "New mode",
  "preservation.icon": "Icon",
  "preservation.duration": "Duration (hours)",

  // Printing
  "printing.title": "Printing",
  "printing.selectPrinter": "Select printer",
  "printing.queue": "Print queue",
  "printing.noQueue": "No items in print queue",
  "printing.sentToPrinter": "Label sent to printer!",
  "printing.printLabel": "Print label",

  // Settings
  "settings.title": "Settings",
  "settings.darkMode": "Dark mode",
  "settings.language": "Language",

  // Toasts
  "toast.labelPrinted": "Label sent to printer!",
  "toast.labelDiscarded": "Label discarded successfully",
  "toast.labelsDiscarded": "labels discarded",
  "toast.labelsPrinted": "labels sent to printer",
  "toast.productCreated": "Product created successfully",
  "toast.productUpdated": "Product updated successfully",
  "toast.productDeleted": "Product deleted successfully",
  "toast.employeeCreated": "Employee created successfully",
  "toast.employeeDeleted": "Employee deleted successfully",
  "toast.groupCreated": "Group created successfully",
  "toast.groupDeleted": "Group deleted successfully",
  "toast.modeCreated": "Preservation mode created successfully",
  "toast.modeDeleted": "Preservation mode deleted successfully",
  "toast.deviceCreated": "Device added successfully",
  "toast.testPrintSent": "Test label sent to printer!",
  "toast.exportSuccess": "Export completed successfully",
  "toast.labelCreated": "Label created successfully",
};

const dictionaries: Record<string, Record<string, string>> = {
  en,
};

let currentLocale = "en";

export function setLocale(locale: string) {
  currentLocale = locale;
}

export function t(key: string): string {
  const dict = dictionaries[currentLocale] || dictionaries.en;
  return dict[key] || key;
}
