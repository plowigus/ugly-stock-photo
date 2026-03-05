import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "UGLY STOCK PHOTO — HC Photographer",
    template: "%s | UGLY STOCK PHOTO"
  },
  description: "Surowa estetyka, mrok i energia sceny. UGLY STOCK PHOTO to portfolio fotografa z Katowic specjalizującego się w bezkompromisowej fotografii koncertowej i sesjach kapel..",
  keywords: ["fotografia koncertowa", "sesje zdjęciowe zespołów", "zdjęcia z koncertów", "fotograf muzyczny Katowice", "mroczne sesje dla zespołów", "raw gig photography", "alternative band photoshoot", "underground music photographer", "fotografia festiwalowa", "promocyjne zdjęcia muzyków", "brutalism photography", "Ugly Stock Photo"],
  creator: "UGLY STOCK PHOTO",
  publisher: "UGLY STOCK PHOTO",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'pl-PL': '/pl',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: "UGLY STOCK PHOTO",
    description: "UGLY STOCK PHOTO: Bezkompromisowa fotografia koncertowa. Mrok, surowy styl i energia undergroundu. Zobacz portfolio z Katowic.",
    url: 'https://uglystockphoto.pl',
    siteName: 'UGLY STOCK PHOTO',
    locale: 'pl_PL',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/favicon-black.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-white.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export const viewport = {
  themeColor: 'black',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

import { Providers } from "./components/Providers";
import DeferredGA from "./components/DeferredGA";
import { CookieBanner } from "./components/CookieBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "UGLY STOCK PHOTO",
              "image": "https://uglystockphoto.pl/favicon-white.png",
              "@id": "https://uglystockphoto.pl",
              "url": "https://uglystockphoto.pl",
              "telephone": "",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "",
                "addressLocality": "Kraków",
                "postalCode": "",
                "addressCountry": "PL"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 50.0647,
                "longitude": 19.9450
              },
              "description": "Surowa estetyka, mrok i energia sceny. UGLY STOCK PHOTO to portfolio fotografa z Katowic specjalizującego się w bezkompromisowej fotografii koncertowej i sesjach kapel.",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday"
                ],
                "opens": "00:00",
                "closes": "23:59"
              },
              "sameAs": [
                "https://www.instagram.com/uglystockphoto"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <DeferredGA />
        <CookieBanner />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
