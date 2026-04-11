"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieLabelRenderProps,
} from "recharts";

const COLORS = [
  "hsl(280, 65%, 45%)",
  "hsl(43, 96%, 53%)",
  "hsl(200, 70%, 50%)",
  "hsl(140, 60%, 45%)",
  "hsl(350, 70%, 50%)",
  "hsl(30, 80%, 55%)",
  "hsl(260, 50%, 60%)",
  "hsl(170, 60%, 40%)",
  "hsl(15, 75%, 50%)",
];

interface PieChartCardProps {
  title: string;
  data: { name: string; value: number }[];
}

export function PieChartCard({ title, data }: PieChartCardProps) {
  return (
    <Card className="bg-card">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-md">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={90}
              dataKey="value"
              label={(props: PieLabelRenderProps) =>
                `${props.name ?? ""} ${(((props.percent as number) ?? 0) * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
