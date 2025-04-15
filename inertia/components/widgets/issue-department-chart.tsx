"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import { ScrollArea } from "~/components/ui/scroll-area";

import { CardContent } from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

const chartConfig = {
  total_issues: {
    label: "Total Issues",
  },
  product_quality: {
    label: "Product Quality",
    color: "hsl(var(--chart-1))",
  },
  it_hardware: {
    label: "IT Hardware",
    color: "hsl(var(--chart-2))",
  },
  it_software: {
    label: "IT Software",
    color: "hsl(var(--chart-3))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

interface IssueDepartmentChartProps {
  existingIssuesByDepartment: {
    existingIssuesByDepartment: Record<string, number>;
  };
}

export function IssueDepartmentChart(
  existingIssuesByDepartment: IssueDepartmentChartProps,
) {
  const fillMap: { [key: string]: string } = {
    it_hardware: "hsl(var(--chart-1))",
    product_quality: "hsl(var(--chart-2))",
  };

  const chartData = Object.entries(
    existingIssuesByDepartment.existingIssuesByDepartment,
  ).map(([key, value]) => ({
    browser: key,
    visitors: Number(value),
    fill: fillMap[key] || "var(--color-other)",
  }));
  console.log(chartData);
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <div className="p-2 h-[300px] sm:h-[450px] ">
      <ScrollArea className="h-[400px] mt-2">
        <CardContent className=" ">
          {chartData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[250px] sm:h-[400px] w-[300px] lg:w-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="visitors"
                  nameKey="browser"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalVisitors.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Issues
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="flex justify-center items-center">
              No Active Issues to display
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </div>
  );
}
