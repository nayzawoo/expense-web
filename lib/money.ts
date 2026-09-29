export function formatMMK(amount: number): string {
  return `${new Intl.NumberFormat("en-US").format(Math.round(amount))} Ks`;
}

export function formatMMKShort(amount: number): string {
  const abs = Math.abs(amount);

  if (abs >= 1_000_000) {
    const value = amount / 1_000_000;
    return `${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)}M`;
  }

  if (abs >= 1_000) {
    return `${Math.round(amount / 1_000)}K`;
  }

  return String(Math.round(amount));
}

export function formatSignedMMK(amount: number): string {
  const sign = amount > 0 ? "+" : amount < 0 ? "−" : "";
  return `${sign}${formatMMK(Math.abs(amount))}`;
}

export function formatPercent(value: number | null): string | null {
  if (value === null) {
    return null;
  }

  const rounded = Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";

  return `${sign}${Math.abs(Number(rounded))}%`;
}
