import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider, ErrorBoundary } from "@/components";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConfigProvider } from "@/lib/config-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3005";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#080c14" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DevOps Project Generator | Production Cloud & CI/CD Scaffolder",
    template: "%s | DevOps Project Generator",
  },
  description:
    "Scaffold production-ready DevOps infrastructure in seconds. Generate complete cloud architectures: OpenTofu & Terraform, Kubernetes Gateway API, ArgoCD GitOps, OpenTelemetry, and FinOps Infracost with CIS & SOC2 compliance.",
  keywords: [
    "devops project generator",
    "infrastructure as code",
    "opentofu generator",
    "terraform modules",
    "kubernetes manifests",
    "argocd gitops",
    "github actions ci cd",
    "keda autoscaling",
    "infracost finops",
    "opentelemetry collector",
    "cloud native architecture",
    "devops boilerplates",
    "zero trust security",
    "cis benchmarks",
    "soc2 compliance",
  ],
  authors: [{ name: "Harshhaa", url: "https://github.com/NotHarshhaa" }],
  creator: "Harshhaa",
  publisher: "DevOps Project Generator",
  applicationName: "DevOps Project Generator",
  category: "Developer Tools",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.svg",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "DevOps Project Generator",
    title: "DevOps Project Generator | Production Cloud Infrastructure & CI/CD Scaffolder",
    description:
      "Scaffold production-grade DevOps repositories in seconds. Provision OpenTofu, Kubernetes Gateway API, ArgoCD GitOps, OpenTelemetry, and FinOps Infracost.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DevOps Project Generator Architecture Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevOps Project Generator",
    description:
      "Scaffold production-ready DevOps infrastructure with OpenTofu, Kubernetes, GitOps, and FinOps.",
    creator: "@NotHarshhaa",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "DevOps Project Generator",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "All",
  browserRequirements: "Requires JavaScript",
  url: siteUrl,
  description:
    "Scaffold production-ready DevOps infrastructure in seconds with OpenTofu, Kubernetes, ArgoCD GitOps, OpenTelemetry, and FinOps.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Harshhaa",
    url: "https://github.com/NotHarshhaa",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased selection:bg-cyan-500 selection:text-white`}
      >
        <ErrorBoundary>
          <ThemeProvider defaultTheme="system">
            <ConfigProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </ConfigProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
