import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BILLABLE — American Care Continuity Simulation",
  description:
    "You survived the system. Now you run it. A three-minute healthcare policy nightmare set in the United States, 2026.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
