import { Landmark, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

type AccountType = "bank" | "wallet" | "cash";

export type BrandKey = "kbz" | "kpay" | "aya" | "cb" | "cash";

interface AccountIconProps {
  name: string;
  type?: AccountType;
  className?: string;
  size?: "sm" | "md";
}

const BRAND_IMAGES: Record<BrandKey, string> = {
  kbz: "/images/accounts/kbz.png",
  kpay: "/images/accounts/kpay.png",
  aya: "/images/accounts/aya.png",
  cb: "/images/accounts/cb.png",
  cash: "/images/accounts/cash.png",
};

const BRAND_LABELS: Record<BrandKey, string> = {
  kbz: "KBZ",
  kpay: "KPay",
  aya: "AYA",
  cb: "CB",
  cash: "Cash",
};

export function resolveBrand(name: string): BrandKey | null {
  const normalized = name.trim().toLowerCase();

  if (
    normalized === "cash" ||
    normalized.startsWith("cash ") ||
    normalized.startsWith("cash—") ||
    normalized.startsWith("cash–") ||
    normalized.includes(" cash") ||
    /\bcash\b/.test(normalized)
  ) {
    return "cash";
  }

  if (
    normalized === "kpay" ||
    normalized === "kbzpay" ||
    normalized.startsWith("kpay ") ||
    normalized.startsWith("kbzpay ") ||
    normalized.startsWith("kpay—") ||
    normalized.startsWith("kbzpay—") ||
    /\bkpay\b/.test(normalized) ||
    /\bkbzpay\b/.test(normalized)
  ) {
    return "kpay";
  }

  if (
    normalized === "kbz" ||
    normalized.startsWith("kbz ") ||
    normalized.startsWith("kbz—") ||
    /\bkbz\b/.test(normalized)
  ) {
    return "kbz";
  }

  if (
    normalized === "aya" ||
    normalized.startsWith("aya ") ||
    normalized.startsWith("aya—") ||
    /\baya\b/.test(normalized)
  ) {
    return "aya";
  }

  if (
    normalized === "cb" ||
    normalized.startsWith("cb ") ||
    normalized.startsWith("cb—") ||
    /\bcb\b/.test(normalized)
  ) {
    return "cb";
  }

  return null;
}

/**
 * Account brand icon by name — logo images for KBZ, KPay, AYA, CB, Cash.
 */
export function AccountIcon({
  name,
  type,
  className,
  size = "md",
}: AccountIconProps) {
  const brand = resolveBrand(name);
  const box = size === "sm" ? "h-7 w-7 rounded-lg" : "h-9 w-9 rounded-[10px]";

  if (brand) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={BRAND_IMAGES[brand]}
        alt={BRAND_LABELS[brand]}
        title={BRAND_LABELS[brand]}
        className={cn(
          "shrink-0 object-cover shadow-sm ring-1 ring-black/5 dark:ring-white/10",
          box,
          className,
        )}
      />
    );
  }

  if (type === "cash") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={BRAND_IMAGES.cash}
        alt="Cash"
        title="Cash"
        className={cn(
          "shrink-0 object-cover shadow-sm ring-1 ring-black/5 dark:ring-white/10",
          box,
          className,
        )}
      />
    );
  }

  const Icon = type === "wallet" ? Wallet : Landmark;
  const background = type === "wallet" ? "#6366F1" : "#64748B";
  const iconClass = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center text-white shadow-sm",
        box,
        className,
      )}
      style={{ backgroundColor: background }}
    >
      <Icon className={iconClass} strokeWidth={2} />
    </span>
  );
}
