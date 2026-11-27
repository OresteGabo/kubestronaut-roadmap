import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const spaceGrotesk = localFont({
  src: "./assets/space-grotesk.woff2",
  weight: "400 700",
  display: "swap",
  variable: "--tracker-display",
});

const title = "Kubernetes & Kubestronaut Roadmap | Oreste Gabo";
const description =
  "Track five Kubernetes certifications, then explore AWS certification paths and hands-on computer science projects.";

export const metadata: Metadata = {
  metadataBase: new URL("https://k8s.orestegabo.dev"),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title,
    description,
    url: "/",
    siteName: "Kubestronaut Roadmap",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body>{children}</body>
    </html>
  );
}
