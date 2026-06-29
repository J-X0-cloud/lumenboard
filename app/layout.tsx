import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { TooltipProvider } from "@/components/charts/TooltipProvider";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lumenboard.com"),
  title: {
    default: "Lumenboard — AI-native BI on governed metrics",
    template: "%s · Lumenboard",
  },
  description:
    "Lumenboard connects to your warehouse, answers plain-English questions with charts built on governed metrics, auto-builds dashboards and schedules reports.",
  icons: { icon: { url: "/favicon.svg", type: "image/svg+xml" } },
  openGraph: { siteName: "Lumenboard", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#0e1330",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
