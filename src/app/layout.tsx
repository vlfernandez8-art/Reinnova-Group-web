import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { CursorGlow } from "@/components/layout/CursorGlow";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const heading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.reinnovagroup.com.ar"),
  title: "Reinnova Group | DiagnÃ³stico empresarial para PyMEs",
  description:
    "DiagnÃ³stico, estrategia y automatizaciÃ³n para empresas que quieren ordenar procesos, detectar fugas y escalar con datos.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },  openGraph: {
    title: "Reinnova Group",
    description:
      "DescubrÃ­ en 5 minutos cuÃ¡nto le estÃ¡ costando el desorden operativo a tu empresa.",
    url: "https://www.reinnovagroup.com.ar",
    siteName: "Reinnova Group",
    images: ["/og-image.png"],
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${heading.variable} ${body.variable}`}>
        <CursorGlow />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

