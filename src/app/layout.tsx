import type { Metadata } from "next";
import "./globals.css";

const title = "Kubernetes & Kubestronaut Roadmap | Oreste Gabo";
const description =
  "Plan your study for KCNA, CKA, CKAD, KCSA, and CKS. Track checklist progress, exam passes, and estimated completion dates.";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
