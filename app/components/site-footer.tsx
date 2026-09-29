export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-mist px-6 py-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-lg font-bold tracking-tight text-ink">
          Expense
        </p>
        <p className="text-sm text-ink-soft">
          Client-side personal tracker · Built for calm, private spending notes
        </p>
      </div>
    </footer>
  );
}
