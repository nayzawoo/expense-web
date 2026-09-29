"use client";

import { Lightbulb } from "lucide-react";

export function SpendingInsight({ message }: { message: string }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Lightbulb className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Insight</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {message}
          </p>
        </div>
      </div>
    </section>
  );
}
