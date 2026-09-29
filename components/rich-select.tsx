"use client";

import type { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type RichSelectOption = {
  value: string;
  label: string;
  leading?: ReactNode;
};

interface RichSelectProps {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: RichSelectOption[];
  placeholder?: string;
  className?: string;
  required?: boolean;
}

function OptionRow({
  leading,
  label,
}: {
  leading?: ReactNode;
  label: string;
}) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      {leading}
      <span className="truncate text-[15px] font-medium leading-none">
        {label}
      </span>
    </span>
  );
}

/**
 * Select with optional leading icon/avatar in both trigger and list.
 */
export function RichSelect({
  id,
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  className,
  required = false,
}: RichSelectProps) {
  const selected = options.find((option) => option.value === value);

  return (
    <Select
      id={id}
      required={required}
      value={value || null}
      onValueChange={(next) => {
        if (next != null) {
          onValueChange(String(next));
        }
      }}
      items={options.map((option) => ({
        value: option.value,
        label: option.label,
      }))}
    >
      <SelectTrigger
        className={cn(
          "h-14 w-full touch-manipulation gap-3 rounded-xl border-border/80 bg-background px-3.5 py-2.5 text-left shadow-sm transition-colors",
          "hover:bg-muted/40 data-[size=default]:h-14",
          "*:data-[slot=select-value]:gap-3",
          className,
        )}
      >
        <SelectValue
          placeholder={
            <span className="text-[15px] text-muted-foreground">
              {placeholder}
            </span>
          }
        >
          {() =>
            selected ? (
              <OptionRow leading={selected.leading} label={selected.label} />
            ) : (
              <span className="text-[15px] text-muted-foreground">
                {placeholder}
              </span>
            )
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        align="start"
        sideOffset={6}
        className="max-h-80 rounded-xl p-1.5 shadow-lg"
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            label={option.label}
            className="min-h-12 cursor-pointer touch-manipulation gap-3 rounded-lg py-2.5 pr-10 pl-2.5"
          >
            <OptionRow leading={option.leading} label={option.label} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
