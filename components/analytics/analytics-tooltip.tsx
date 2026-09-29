"use client";

import { formatMMK } from "@/lib/money";

type TrendTooltipPayload = {
  value?: number | string;
  payload?: {
    label?: string;
    is_current?: boolean;
  };
};

type AnalyticsTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: ReadonlyArray<TrendTooltipPayload>;
};

export function AnalyticsTooltip({
  active,
  payload,
  label,
}: AnalyticsTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];
  const value = Number(item.value ?? 0);
  const title = item.payload?.label ?? label;
  const isCurrent = Boolean(item.payload?.is_current);

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">Expense</p>
      <p className="mt-1 text-sm font-semibold text-foreground">
        {formatMMK(value)}
      </p>
      {isCurrent ? (
        <p className="mt-1 text-xs text-muted-foreground">Month to date</p>
      ) : null}
    </div>
  );
}
