import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { ThemeProvider, ErrorBoundary } from "@/components";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConfigProvider } from "@/lib/config-context";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevOps Project Generator",
  description:
    "Scaffold production-ready DevOps repositories with ease. Configure CI/CD, infrastructure, deployment, observability, and security in seconds.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black`}
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
