import { HeroVisual } from "./components/hero-visual";
import { SiteFooter } from "./components/site-footer";
import { TrackerPreview } from "./components/tracker-preview";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 sm:px-8">
          <a href="#top" className="font-display text-lg font-bold tracking-tight text-ink">
            Expense
          </a>
          <nav className="flex items-center gap-5 text-sm font-medium text-ink-soft sm:gap-6">
            <a href="#clarity" className="hidden transition-colors hover:text-ink sm:inline">
              Why
            </a>
            <a href="#try" className="hidden transition-colors hover:text-ink sm:inline">
              Try it
            </a>
            <a
              href="#try"
              className="rounded-[var(--radius-control)] bg-teal px-3.5 py-2 text-foam transition-colors hover:bg-teal-deep"
            >
              Open tracker
            </a>
          </nav>
        </div>
      </header>

      <main id="top" className="flex flex-1 flex-col">
        <section className="atmosphere relative isolate min-h-svh overflow-hidden">
          <div className="grain" aria-hidden />
          <HeroVisual />

          <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-6xl items-center px-6 pb-20 pt-28 sm:px-8 lg:pb-24">
            <div className="max-w-xl">
              <p className="animate-rise font-display text-5xl font-extrabold leading-none tracking-tight text-ink sm:text-6xl md:text-7xl">
                Expense
              </p>
              <h1 className="animate-rise-delay-1 mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
                See where your money goes.
              </h1>
              <p className="animate-rise-delay-2 mt-4 max-w-md text-base leading-7 text-ink-soft sm:text-lg">
                A modern personal tracker that stays on your device — clear
                categories, calm focus, zero clutter.
              </p>
              <div className="animate-rise-delay-3 mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#try"
                  className="rounded-[var(--radius-control)] bg-teal px-5 py-3 text-sm font-semibold text-foam transition-colors hover:bg-teal-deep"
                >
                  Start tracking
                </a>
                <a
                  href="#clarity"
                  className="rounded-[var(--radius-control)] border border-line bg-foam/55 px-5 py-3 text-sm font-semibold text-ink backdrop-blur-sm transition-colors hover:bg-foam"
                >
                  How it feels
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="clarity"
          className="relative border-t border-line bg-paper px-6 py-24 sm:px-8"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Built for clarity, not dashboards.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-ink-soft sm:text-lg">
              One quiet place to log spending, spot patterns, and stay honest
              with yourself — without accounts, noise, or server-side storage.
            </p>
          </div>
        </section>

        <section className="border-t border-line bg-mist px-6 py-24 sm:px-8">
          <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-3 md:gap-10">
            {[
              {
                title: "Private by design",
                body: "Runs entirely in the browser. Nothing is sent to a backend — your habits stay yours.",
              },
              {
                title: "Fast to open",
                body: "Lightweight pages meant for Vercel hosting. Load, log, leave — no setup theater.",
              },
              {
                title: "Calm focus",
                body: "Space for the amount, the why, and the category. No chart soup competing for attention.",
              },
            ].map((item) => (
              <div key={item.title} className="max-w-sm">
                <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft sm:text-base">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="try"
          className="border-t border-line bg-paper px-6 py-24 sm:px-8"
        >
          <div className="mx-auto max-w-3xl">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Try a quiet entry.
              </h2>
              <p className="mt-4 text-base leading-7 text-ink-soft">
                Add a sample expense below. It lives in this session only —
                refresh and it resets. No accounts, no server.
              </p>
            </div>
            <div className="mt-10">
              <TrackerPreview />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
