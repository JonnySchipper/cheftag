import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Tag,
  Printer,
  MoreHorizontal,
  BarChart3,
  Package,
  Users,
  FolderOpen,
  Monitor,
  Snowflake,
  Settings,
} from "lucide-react";

/** Primary shell sections (max 4 for bottom nav). */
export const PRIMARY_NAV = [
  { href: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { href: "/labels", labelKey: "nav.labels", icon: Tag },
  { href: "/printing", labelKey: "nav.printing", icon: Printer },
  { href: "more", labelKey: "nav.more", icon: MoreHorizontal },
] as const;

/** Everything grouped under “More” (reports + admin). */
export const MORE_NAV_GROUPS: {
  titleKey: string;
  items: { href: string; labelKey: string; icon: LucideIcon }[];
}[] = [
  {
    titleKey: "nav.section.reports",
    items: [{ href: "/reports", labelKey: "nav.reports", icon: BarChart3 }],
  },
  {
    titleKey: "nav.section.admin",
    items: [
      { href: "/products", labelKey: "nav.products", icon: Package },
      { href: "/employees", labelKey: "nav.employees", icon: Users },
      { href: "/groups", labelKey: "nav.groups", icon: FolderOpen },
      { href: "/devices", labelKey: "nav.devices", icon: Monitor },
      {
        href: "/preservation-modes",
        labelKey: "nav.preservationModes",
        icon: Snowflake,
      },
      { href: "/settings", labelKey: "nav.settings", icon: Settings },
    ],
  },
];

export function isPrimaryRoute(pathname: string): boolean {
  if (pathname === "/dashboard" || pathname === "/labels" || pathname === "/printing")
    return true;
  return false;
}

export function isMoreRoute(pathname: string): boolean {
  return MORE_NAV_GROUPS.some((g) =>
    g.items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
  );
}
