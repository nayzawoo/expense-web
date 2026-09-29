import Link from "next/link";

const categories = [
  { name: "Food", pct: 42, amount: "$540" },
  { name: "Travel", pct: 28, amount: "$360" },
  { name: "Home", pct: 18, amount: "$231" },
  { name: "Other", pct: 12, amount: "$153" },
];

export default function Home() {
  return (
    <div className="page-wash flex min-h-full flex-1 flex-col">
      <header className="border-b border-landing-line/80 bg-landing-surface/70 backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-5 sm:px-6">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-landing-ink"
          >
            Expense
          </Link>
          <nav className="flex items-center gap-4 text-sm text-landing-ink-muted">
            <a href="#features" className="transition-colors hover:text-landing-ink">
              Features
            </a>
            <Link
              href="/login"
              className="rounded-md bg-landing-ink px-3 py-1.5 font-medium text-white transition-opacity hover:opacity-90"
            >
              Log in
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-10 sm:px-6 sm:py-14 lg:py-16">
          <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <p
                className="animate-fade-up font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight text-landing-ink sm:text-6xl"
                style={{ animationDelay: "0.04s" }}
              >
                Expense
              </p>
              <h1
                className="animate-fade-up mt-5 max-w-md text-2xl font-medium leading-snug tracking-tight text-landing-ink sm:text-[1.75rem]"
                style={{ animationDelay: "0.12s" }}
              >
                Know where your money goes — without a heavy app.
              </h1>
              <p
                className="animate-fade-up mt-4 max-w-sm text-[15px] leading-relaxed text-landing-ink-muted sm:text-base"
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
                <Link
                  href="/login"
                  className="rounded-md bg-landing-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Start tracking
                </Link>
                <a
                  href="#features"
                  className="rounded-md border border-landing-line bg-landing-surface px-5 py-2.5 text-sm font-medium text-landing-ink transition-colors hover:bg-landing-bg"
                >
                  See features
                </a>
              </div>
            </div>

            <aside className="animate-slide-in">
              <div className="overflow-hidden rounded-xl bg-landing-panel text-white">
                <div className="border-b border-white/10 px-5 py-5 sm:px-6">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-landing-panel-muted">
                    March total
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight">
                    $1,284
                  </p>
                  <p className="mt-1 text-sm text-landing-panel-muted">
                    4 categories · on pace
                  </p>
                </div>
                <ul className="space-y-4 px-5 py-5 sm:px-6">
                  {categories.map((cat, i) => (
                    <li key={cat.name}>
                      <div className="mb-1.5 flex items-baseline justify-between text-sm">
                        <span className="text-white/90">{cat.name}</span>
                        <span className="text-landing-panel-muted">{cat.amount}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="fill-bar h-full rounded-full bg-landing-accent-soft"
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
          className="border-t border-landing-line bg-landing-surface px-5 py-16 sm:px-6"
        >
          <div className="mx-auto max-w-5xl">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-landing-ink sm:text-3xl">
              Just the essentials
            </h2>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-landing-ink-muted">
              Everything you need to stay aware of spending — nothing else.
            </p>

            <div className="mt-10 grid gap-8 border-t border-landing-line pt-10 sm:grid-cols-3">
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
                  <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-landing-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-landing-ink-muted">
                    {feature.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-landing-line px-5 py-6 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-landing-ink">
            Expense
          </p>
          <p className="text-sm text-landing-ink-muted">Stay light with your money.</p>
        </div>
      </footer>
    </div>
  );
}
