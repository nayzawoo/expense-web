"use client";

import type { ComponentProps, ReactNode } from "react";
import { ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

type ChartContainerProps = {
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof ResponsiveContainer>, "children" | "className">;

export function ChartContainer({
  children,
  className,
  width = "100%",
  height = "100%",
  minWidth = 0,
  minHeight = 0,
  initialDimension = { width: 320, height: 288 },
  ...props
}: ChartContainerProps) {
  return (
    <div className={cn("h-full w-full", className)}>
      <ResponsiveContainer
        width={width}
        height={height}
        minWidth={minWidth}
        minHeight={minHeight}
        initialDimension={initialDimension}
        {...props}
      >
        {children}
      </ResponsiveContainer>
    </div>
  );
}
