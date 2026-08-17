import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";
import { getDictionary, locales } from "@/dictionaries";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

import { ContentService } from "@/services/content-service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  let seo = null;
  try {
    seo = await ContentService.getSeoConfig(lang);
  } catch {
    // Fallback
  }

  const title = seo?.title || dict.meta.title;
  const description = seo?.description || dict.meta.description;

  return {
    title,
    description,
    keywords: dict.meta.keywords,
    authors: [{ name: "GERGA" }],
    openGraph: {
      title,
      description,
      url: `https://gerga.co/${lang}`,
      siteName: "GERGA",
      images: [
        {
          url: "https://gerga.co/images/hero.png",
          width: 1200,
          height: 630,
          alt: lang === "en" ? "Representative visual of Aegean fig orchards" : "Ege incir bahçelerini temsil eden temsili görsel",
        },
      ],
      locale: lang === "tr" ? "tr_TR" : "en_US",
      type: "website",
    },
    alternates: {
      canonical: `https://gerga.co/${lang}`,
      languages: {
        "tr-TR": "https://gerga.co/tr",
        "en": "https://gerga.co/en",
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang === "tr" ? "tr" : "en"} className={`${playfair.variable} ${jakarta.variable} scroll-smooth`}>
      <head>
        <link rel="alternate" hrefLang="tr-TR" href="https://gerga.co/tr" />
        <link rel="alternate" hrefLang="en" href="https://gerga.co/en" />
      </head>
      <body className="font-sans bg-[#090b09] text-[#f7f5ef] antialiased selection:bg-[#d4af37] selection:text-black">
        {children}
      </body>
    </html>
  );
}
