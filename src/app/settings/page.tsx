"use client";

import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/stores/app-store";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Package,
  Users,
  FolderOpen,
  Monitor,
  Snowflake,
  ChevronRight,
  Moon,
} from "lucide-react";

const settingsLinks = [
  {
    href: "/products",
    label: "nav.products",
    description: "Manage food products",
    icon: Package,
  },
  {
    href: "/employees",
    label: "nav.employees",
    description: "Manage team members",
    icon: Users,
  },
  {
    href: "/groups",
    label: "nav.groups",
    description: "Organize product categories",
    icon: FolderOpen,
  },
  {
    href: "/devices",
    label: "nav.devices",
    description: "Configure printers",
    icon: Monitor,
  },
  {
    href: "/preservation-modes",
    label: "nav.preservationModes",
    description: "Set storage methods",
    icon: Snowflake,
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useAppStore();

  return (
    <div>
      <PageHeader title={t("settings.title")} />

      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-4 space-y-6 animate-fade-in">
        {/* Appearance */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="cursor-pointer">
                {t("settings.darkMode")}
              </Label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Navigation Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settingsLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => router.push(link.href)}
              className="flex items-center gap-4 p-4 bg-card border rounded-xl hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <link.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{t(link.label)}</p>
                <p className="text-sm text-muted-foreground">
                  {link.description}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
