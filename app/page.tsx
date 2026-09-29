const categories = [
  { name: "Food", pct: 42, amount: "$540" },
  { name: "Travel", pct: 28, amount: "$360" },
  { name: "Home", pct: 18, amount: "$231" },
  { name: "Other", pct: 12, amount: "$153" },
];

export default function Home() {
  return (
    <div className="page-wash flex min-h-full flex-1 flex-col">
      <header className="border-b border-line/80 bg-surface/70 backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-5 sm:px-6">
          <a
            href="/"
            className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-ink"
          >
            Expense
          </a>
          <nav className="flex items-center gap-4 text-sm text-ink-muted">
            <a href="#features" className="transition-colors hover:text-ink">
              Features
            </a>
            <a
              href="#get-started"
              className="rounded-md bg-ink px-3 py-1.5 font-medium text-white transition-opacity hover:opacity-90"
            >
              Get started
            </a>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-10 sm:px-6 sm:py-14 lg:py-16">
          <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <p
                className="animate-fade-up font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight text-ink sm:text-6xl"
                style={{ animationDelay: "0.04s" }}
              >
                Expense
              </p>
              <h1
                className="animate-fade-up mt-5 max-w-md text-2xl font-medium leading-snug tracking-tight text-ink sm:text-[1.75rem]"
                style={{ animationDelay: "0.12s" }}
              >
                Know where your money goes — without a heavy app.
              </h1>
              <p
                className="animate-fade-up mt-4 max-w-sm text-[15px] leading-relaxed text-ink-muted sm:text-base"
                style={{ animationDelay: "0.2s" }}
              >
                Log spends in seconds, skim monthly totals, and keep budgets
                light.
              </p>
              <div
                id="get-started"
                className="animate-fade-up mt-8 flex flex-wrap gap-3"
                style={{ animationDelay: "0.28s" }}
              >
                <a
                  href="#features"
                  className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Start tracking
                </a>
                <a
                  href="#features"
                  className="rounded-md border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-bg"
                >
                  See features
                </a>
              </div>
            </div>

            <aside className="animate-slide-in">
              <div className="overflow-hidden rounded-xl bg-panel text-white">
                <div className="border-b border-white/10 px-5 py-5 sm:px-6">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-panel-muted">
                    March total
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight">
                    $1,284
                  </p>
                  <p className="mt-1 text-sm text-panel-muted">
                    4 categories · on pace
                  </p>
                </div>
                <ul className="space-y-4 px-5 py-5 sm:px-6">
                  {categories.map((cat, i) => (
                    <li key={cat.name}>
                      <div className="mb-1.5 flex items-baseline justify-between text-sm">
                        <span className="text-white/90">{cat.name}</span>
                        <span className="text-panel-muted">{cat.amount}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="fill-bar h-full rounded-full bg-accent-soft"
                          style={{
                            width: `${cat.pct}%`,
                            animationDelay: `${0.35 + i * 0.08}s`,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section
          id="features"
          className="border-t border-line bg-surface px-5 py-16 sm:px-6"
        >
          <div className="mx-auto max-w-5xl">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Just the essentials
            </h2>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-muted">
              Everything you need to stay aware of spending — nothing else.
            </p>

            <div className="mt-10 grid gap-8 border-t border-line pt-10 sm:grid-cols-3">
              {[
                {
                  title: "Quick add",
                  body: "Capture amount and category before you forget.",
                },
                {
                  title: "Monthly view",
                  body: "One total and a simple category split.",
                },
                {
                  title: "Light by design",
                  body: "No feeds, no dashboards stuffed with charts.",
                },
              ].map((feature) => (
                <div key={feature.title}>
                  <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {feature.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line px-5 py-6 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-ink">
            Expense
          </p>
          <p className="text-sm text-ink-muted">Stay light with your money.</p>
        </div>
      </footer>
    </div>
  );
}
