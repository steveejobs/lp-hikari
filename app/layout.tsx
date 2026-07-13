import type { Metadata, Viewport } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";
import { business, fullAddress } from "@/lib/business";
import { getSiteUrl } from "@/lib/site-url";

const display = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ótica Hikari | Óculos em Araguaína",
    template: "%s | Ótica Hikari",
  },
  description:
    "Óculos solares e receituários no Centro de Araguaína. Fale com a Ótica Hikari pelo WhatsApp ou trace sua rota até a loja.",
  applicationName: business.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: business.name,
    title: "Ótica Hikari — O florescer de um novo olhar",
    description: "Óculos solares e receituários no Centro de Araguaína.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ótica Hikari — O florescer de um novo olhar",
    description: "Óculos solares e receituários no Centro de Araguaína.",
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "Loja de óculos",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#080806",
  colorScheme: "dark light",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: business.name,
  url: siteUrl,
  image: `${siteUrl}/brand/logo-hikari.png`,
  telephone: `+${business.phoneE164}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.street,
    addressLocality: business.address.city,
    addressRegion: business.address.region,
    addressCountry: business.address.postalCountry,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: business.coordinates.latitude,
    longitude: business.coordinates.longitude,
  },
  hasMap: business.mapsUrl,
  description: `Loja de óculos solares e receituários em ${fullAddress}.`,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={display.variable}>
      <body>
        <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
