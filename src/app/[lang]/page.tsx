import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Aegean from "@/components/Aegean";
import Products from "@/components/Products";
import Nursery from "@/components/Nursery";
import Engineering from "@/components/Engineering";
import Academy from "@/components/Academy";
import ExhibitionMeeting from "@/components/ExhibitionMeeting";
import PostExhibitionConversion from "@/components/PostExhibitionConversion";
import ExhibitionBanner from "@/components/ExhibitionBanner";
import Gallery from "@/components/Gallery";
import ContactCard from "@/components/ContactCard";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/database/prisma";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  let exhibitionConfig = null;
  try {
    exhibitionConfig = await prisma.exhibitionConfig.findUnique({
      where: { id: "default" },
    });
  } catch {
    // Graceful fallback if database unavailable
  }

  return (
    <main className="min-h-screen bg-[#090b09] text-[#f7f5ef] selection:bg-[#d4af37] selection:text-black overflow-x-hidden">
      {/* 0. Exhibition Mode Banner */}
      <ExhibitionBanner lang={lang} initialConfig={exhibitionConfig} />

      {/* Sticky Luxury Navigation */}
      <Header lang={lang} />

      {/* 1. Hero */}
      <Hero lang={lang} />

      {/* 2. GERGA’nın Kısa Tanımı */}
      <Intro lang={lang} />

      {/* 3. Ege ve İncir Kökeni */}
      <Aegean lang={lang} />

      {/* 4. Ürün Yaklaşımı */}
      <Products lang={lang} />

      {/* 5. Fidan Üretimi */}
      <Nursery lang={lang} />

      {/* 6. Bahçe Kurulumu ve Saha Hizmetleri */}
      <Engineering lang={lang} />

      {/* 7. GERGA Akademi */}
      <Academy lang={lang} />

      {/* 8. Fuar Görüşmesi ve B2B İletişim */}
      <ExhibitionMeeting lang={lang} />

      {/* 9. Fuar Sonrası Dönüşüm */}
      <PostExhibitionConversion lang={lang} />

      {/* 10. Galeri */}
      <Gallery lang={lang} />

      {/* 11. İletişim ve Dijital Kart */}
      <ContactCard lang={lang} />

      {/* 12. Footer */}
      <Footer lang={lang} />
    </main>
  );
}
