"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogoWithText } from "./logo";
import { useAppStore } from "@/stores/app-store";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Moon,
  Sun,
  ChevronDown,
  LayoutDashboard,
  Tag,
  Printer,
  BarChart3,
  Settings,
  Package,
  Users,
  FolderOpen,
  Monitor,
  Snowflake,
  Menu,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/dashboard", label: "nav.dashboard", icon: LayoutDashboard },
  { href: "/labels", label: "nav.labels", icon: Tag },
  { href: "/printing", label: "nav.printing", icon: Printer },
];

const reportItems = [
  { href: "/reports", label: "nav.reports", icon: BarChart3 },
];

const settingsItems = [
  { href: "/products", label: "nav.products", icon: Package },
  { href: "/employees", label: "nav.employees", icon: Users },
  { href: "/groups", label: "nav.groups", icon: FolderOpen },
  { href: "/devices", label: "nav.devices", icon: Monitor },
  { href: "/preservation-modes", label: "nav.preservationModes", icon: Snowflake },
  { href: "/settings", label: "nav.settings", icon: Settings },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    darkMode,
    toggleDarkMode,
    globalSearch,
    setGlobalSearch,
    currentUserId,
    setCurrentUser,
    employees,
  } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentUser = employees.find((e) => e.id === currentUserId) || employees[0];
  const initials = currentUser
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
      if (e.key === "n" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        router.push("/labels?action=new");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router]);

  const NavLink = useCallback(
    ({
      href,
      label,
      onClick,
    }: {
      href: string;
      label: string;
      onClick?: () => void;
    }) => {
      const isActive = pathname === href;
      return (
        <Button
          variant={isActive ? "default" : "ghost"}
          size="sm"
          className="font-medium"
          onClick={() => {
            router.push(href);
            onClick?.();
          }}
        >
          {t(label)}
        </Button>
      );
    },
    [pathname, router]
  );

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 transition-shadow duration-200">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={<Button variant="ghost" size="sm" className="lg:hidden p-1" />}
              >
                <Menu className="w-6 h-6" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="p-4 border-b">
                  <LogoWithText />
                </div>
                <nav className="flex flex-col p-2 gap-1">
                  {navItems.map((item) => (
                    <Button
                      key={item.href}
                      variant={pathname === item.href ? "default" : "ghost"}
                      className="justify-start gap-2"
                      onClick={() => {
                        router.push(item.href);
                        setMobileOpen(false);
                      }}
                    >
                      <item.icon className="w-4 h-4" />
                      {t(item.label)}
                    </Button>
                  ))}
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    {t("nav.reports")}
                  </div>
                  {reportItems.map((item) => (
                    <Button
                      key={item.href}
                      variant={pathname === item.href ? "default" : "ghost"}
                      className="justify-start gap-2"
                      onClick={() => {
                        router.push(item.href);
                        setMobileOpen(false);
                      }}
                    >
                      <item.icon className="w-4 h-4" />
                      {t(item.label)}
                    </Button>
                  ))}
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    {t("nav.settings")}
                  </div>
                  {settingsItems.map((item) => (
                    <Button
                      key={item.href}
                      variant={pathname === item.href ? "default" : "ghost"}
                      className="justify-start gap-2"
                      onClick={() => {
                        router.push(item.href);
                        setMobileOpen(false);
                      }}
                    >
                      <item.icon className="w-4 h-4" />
                      {t(item.label)}
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Desktop logo + nav */}
            <div className="hidden lg:flex items-center gap-2">
              <LogoWithText />
            </div>
            <nav className="hidden lg:flex items-center gap-1 ml-2">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} />
              ))}

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="ghost" size="sm" className="font-medium gap-1" />}
                >
                  {t("nav.reports")}
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {reportItems.map((item) => (
                    <DropdownMenuItem
                      key={item.href}
                      onClick={() => router.push(item.href)}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {t(item.label)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="ghost" size="sm" className="font-medium gap-1" />}
                >
                  {t("nav.settings")}
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {settingsItems.map((item) => (
                    <DropdownMenuItem
                      key={item.href}
                      onClick={() => router.push(item.href)}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {t(item.label)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="global-search"
                placeholder={`${t("common.search")} (/)` }
                className="pl-8 w-48 lg:w-64 h-9"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
            </div>

            {/* Dark mode */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="sm" className="p-1" />}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{currentUser?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {currentUser?.role === "administrator"
                      ? t("employees.administrator")
                      : t("employees.simple")}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                  Switch user
                </div>
                {employees.map((emp) => (
                  <DropdownMenuItem
                    key={emp.id}
                    onClick={() => setCurrentUser(emp.id)}
                    className={emp.id === currentUserId ? "bg-accent" : ""}
                  >
                    {emp.name}
                    {emp.role === "administrator" && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        Admin
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
