import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MachineVision Pro | Industrial Machine Monitoring Dashboard",
  description:
    "Real-time industrial machine condition monitoring dashboard. Detect equipment anomalies early, prevent unplanned downtime, and optimize manufacturing production performance.",
  keywords:
    "machine monitoring, industrial IoT, predictive maintenance, manufacturing dashboard, condition monitoring",
  authors: [{ name: "Razqa Tech" }],
  openGraph: {
    title: "MachineVision Pro | Industrial Machine Monitoring Dashboard",
    description:
      "Real-time industrial machine condition monitoring for smarter manufacturing.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${inter.variable} h-full`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#060b14" />
      </head>
      <body className="min-h-full flex flex-col bg-grid">{children}</body>
    </html>
  );
}
