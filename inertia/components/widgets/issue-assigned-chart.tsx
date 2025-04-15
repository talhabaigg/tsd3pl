"use client";

import { Badge } from "~/components/ui/badge";
import { useState } from "react";
import SmallAvatar from "~/components/user-avatar-small";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import IssueAssignedWidget from "./issue-assigned-widget";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
const chartData = [
  { browser: "edge", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

interface Assignee {
  id: number;
  name: string;
  issues_count: number; // This should come from the backend
}
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
} satisfies ChartConfig;

export function IssueAssignedUsersChart(existingAssignees: any) {
  console.log(existingAssignees.existingAssignees);
  const [assignees, setAssignees] = useState<Assignee[]>(
    existingAssignees.existingAssignees,
  );
  const CustomizedGroupTick = (props: any) => {
    const { index, x, y, payload } = props;
    const assignee = assignees.find(
      (assignee) => assignee.name === payload.value,
    );
    return (
      <g transform={`translate(${x},${y})`}>
        {assignee && (
          <foreignObject x={-30} y={-20} width={50} height={50}>
            <SmallAvatar userFullName={assignee.name} />
          </foreignObject>
        )}
      </g>
    );
  };
  return (
    <div className="p-2 h-[300px] sm:h-[450px]">
      <ScrollArea className="h-[300px] mt-2">
        <CardHeader></CardHeader>
        <CardContent>
          {assignees.length > 0 ? (
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={assignees}
                layout="vertical"
                margin={{
                  left: 0,
                }}
              >
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  tickMargin={0}
                  axisLine={false}
                  tick={<CustomizedGroupTick />}
                />
                <XAxis dataKey="issues_count" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="issues_count"
                  layout="vertical"
                  radius={5}
                  fill="#8884d8"
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex justify-center items-center -mt-10">
              No Active Issues to display
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </div>
  );
}
