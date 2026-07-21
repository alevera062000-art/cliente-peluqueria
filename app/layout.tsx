import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Raleway, Cinzel } from "next/font/google";
import { Providers } from "@/context/providers";
import { SITE_URL } from "@/lib/constants";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-raleway",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "BN Estilistas | Peluquería & Centro de Belleza · Santa Cruz de Tenerife",
  description:
    "BN Estilistas en Santa Cruz de Tenerife. Especialistas en coloración, rubios, alisados orgánicos, extensiones de pestañas y diseño de cejas. Reserva online.",
  keywords: [
    "peluquería Santa Cruz de Tenerife",
    "peluquería Tenerife",
    "coloración cabello",
    "extensiones pestañas",
    "diseño cejas",
    "alisado orgánico",
    "rubios Tenerife",
    "BN Estilistas",
  ],
  authors: [{ name: "BN Estilistas" }],
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  alternates: { canonical: SITE_URL },
  icons: { icon: "/assets/logo.png", apple: "/assets/logo.png" },
  openGraph: {
    type: "website",
    title: "BN Estilistas | Peluquería & Centro de Belleza · Tenerife",
    description:
      "Especialistas en coloración, rubios, alisados orgánicos, extensiones de pestañas y diseño de cejas en Santa Cruz de Tenerife. Reserva tu cita online.",
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/assets/salon.jpg`,
        width: 1200,
        height: 630,
        alt: "BN Estilistas — Peluquería y Centro de Belleza en Santa Cruz de Tenerife",
      },
    ],
    locale: "es_ES",
    siteName: "BN Estilistas",
  },
  twitter: {
    card: "summary_large_image",
    title: "BN Estilistas | Peluquería & Centro de Belleza · Tenerife",
    description:
      "Especialistas en coloración, extensiones de pestañas y diseño de cejas en Santa Cruz de Tenerife.",
    images: [`${SITE_URL}/assets/salon.jpg`],
  },
  other: {
    "theme-color": "#7C8348",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "BN Estilistas",
    "application-name": "BN Estilistas",
    "geo.region": "ES-TF",
    "geo.placename": "Santa Cruz de Tenerife",
    "geo.position": "28.4636;-16.2518",
    ICBM: "28.4636, -16.2518",
    "og:image:width": "1200",
    "og:image:height": "630",
    "business:contact_data:street_address": "C. Puerta Canseco, 14",
    "business:contact_data:locality": "Santa Cruz de Tenerife",
    "business:contact_data:postal_code": "38003",
    "business:contact_data:country_name": "España",
    "business:contact_data:phone_number": "+34627052418",
  },
};

// viewport-fit=cover habilita env(safe-area-inset-*) para el notch/home-indicator
// del iPhone en los elementos fixed (navbar, botones flotantes, drawers).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      prefix="og: https://ogp.me/ns#"
      className={`${cormorant.variable} ${raleway.variable} ${cinzel.variable}`}
    >
      <head>
        <JsonLd />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
