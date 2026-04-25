import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://seo.kickcheck.ru";
const YANDEX_METRIKA_ID = 106920463;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Проверка кроссовок и сумок на оригинальность — KickCheck",
    template: "%s — KickCheck",
  },
  description:
    "Каталог из 4000+ моделей кроссовок, сумок и брендовых товаров для проверки подлинности с помощью ИИ. Узнайте, как отличить оригинал от подделки за 30 секунд.",
  keywords: [
    "проверка подлинности",
    "оригинал или подделка",
    "проверить кроссовки",
    "проверить сумку",
    "Nike",
    "Louis Vuitton",
    "Gucci",
    "Adidas",
    "KickCheck",
  ],
  authors: [{ name: "KickCheck" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "KickCheck",
    title: "Проверка кроссовок и сумок на оригинальность — KickCheck",
    description:
      "Каталог из 4000+ моделей для проверки подлинности с помощью ИИ за 30 секунд.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Проверка кроссовок и сумок на оригинальность — KickCheck",
    description:
      "Каталог из 4000+ моделей для проверки подлинности с помощью ИИ.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    yandex: "6700351c8e2165ba",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        {/* Яндекс.Метрика */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(${YANDEX_METRIKA_ID}, "init", { defer: true, clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true });
          `}
        </Script>
        <noscript>
          <div>
            <img
              src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
