import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Expense",
    short_name: "Expense",
    description: "Household expense tracker",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/icons/expense-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/expense-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
