import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol =
    forwardedProtocol ??
    (host?.startsWith("localhost") || host?.startsWith("127.0.0.1")
      ? "http"
      : "https");
  const requestOrigin = host
    ? `${protocol}://${host}`
    : "http://localhost:3000";

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? requestOrigin,
    ),
    title: {
      default: "Dialysis & Transit Explorer",
      template: "%s · Dialysis & Transit Explorer",
    },
    description:
      "Explore geographic proximity between Medicare-certified dialysis facilities and public transportation stops.",
    applicationName: "Dialysis & Transit Explorer",
    openGraph: {
      title: "Dialysis & Transit Explorer",
      description:
        "A transparent research tool for exploring dialysis-facility and transit-stop proximity.",
      type: "website",
      images: [
        {
          url: "/og.png",
          width: 1736,
          height: 908,
          alt: "Dialysis & Transit Explorer research map preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Dialysis & Transit Explorer",
      description:
        "A transparent research tool for exploring dialysis-facility and transit-stop proximity.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
