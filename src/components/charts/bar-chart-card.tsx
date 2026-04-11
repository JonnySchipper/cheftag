"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { t } from "@/lib/i18n";

interface BarChartCardProps {
  title: string;
  dailyData: { name: string; printed: number; discarded: number }[];
  monthlyData: { name: string; printed: number; discarded: number }[];
}

export function BarChartCard({
  title,
  dailyData,
  monthlyData,
}: BarChartCardProps) {
  const [mode, setMode] = useState<"day" | "month">("day");
  const data = mode === "day" ? dailyData : monthlyData;

  return (
    <Card className="bg-card col-span-full lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md">{title}</CardTitle>
        <div className="flex gap-1">
          <Button
            variant={mode === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("day")}
          >
            {t("dashboard.day")}
          </Button>
          <Button
            variant={mode === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("month")}
          >
            {t("dashboard.month")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
              }}
            />
            <Legend />
            <Bar
              dataKey="printed"
              name={t("dashboard.printed")}
              fill="hsl(280, 65%, 45%)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="discarded"
              name={t("dashboard.discarded")}
              fill="hsl(43, 96%, 53%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
