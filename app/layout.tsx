import { Geist, Sora, Source_Sans_3 } from "next/font/google";
import type { Metadata } from "next";
import { QueryProvider } from "@/components/providers/query-provider";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expense — Modern Expense Tracker",
  description:
    "A lightweight expense tracker to log spending, watch budgets, and stay in control.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased font-sans",
        geist.variable,
        sora.variable,
        sourceSans.variable,
      )}
    >
      <body className="flex min-h-full flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
