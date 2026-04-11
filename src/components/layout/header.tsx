"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
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
import { Search, Moon, Sun } from "lucide-react";
import { useEffect } from "react";

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

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/90">
      <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4 lg:px-6">
        <Link
          href="/dashboard"
          className="shrink-0 xl:hidden"
          aria-current={pathname === "/dashboard" ? "page" : undefined}
        >
          <LogoWithText size={26} />
        </Link>

        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="global-search"
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            placeholder={`${t("common.search")} (/)`}
            className="h-12 min-h-[48px] rounded-xl border-2 pl-11 text-base font-medium shadow-sm"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleDarkMode}
          className="h-12 w-12 shrink-0 rounded-xl"
          aria-label={darkMode ? t("settings.lightMode") : t("settings.darkMode")}
        >
          {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" className="h-12 shrink-0 rounded-xl px-2 sm:px-3" />}
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-sm font-bold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="text-sm font-semibold">{currentUser?.name}</p>
              <p className="text-xs text-muted-foreground">
                {currentUser?.role === "administrator"
                  ? t("employees.administrator")
                  : t("employees.simple")}
              </p>
            </div>
            <DropdownMenuSeparator />
            <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              {t("header.switchUser")}
            </div>
            {employees.map((emp) => (
              <DropdownMenuItem
                key={emp.id}
                onClick={() => setCurrentUser(emp.id)}
                className={emp.id === currentUserId ? "bg-accent" : ""}
              >
                {emp.name}
                {emp.role === "administrator" && (
                  <span className="ml-auto text-xs text-muted-foreground">Admin</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
