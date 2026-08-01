import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Aegean from "@/components/Aegean";
import Products from "@/components/Products";
import Nursery from "@/components/Nursery";
import Engineering from "@/components/Engineering";
import Academy from "@/components/Academy";
import ExhibitionMeeting from "@/components/ExhibitionMeeting";
import Gallery from "@/components/Gallery";
import ContactCard from "@/components/ContactCard";
import Footer from "@/components/Footer";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <main className="min-h-screen bg-[#090b09] text-[#f7f5ef] selection:bg-[#d4af37] selection:text-black overflow-x-hidden">
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

      {/* 9. Galeri */}
      <Gallery lang={lang} />

      {/* 10. İletişim ve Dijital Kart */}
      <ContactCard lang={lang} />

      {/* 11. Footer */}
      <Footer lang={lang} />
    </main>
  );
}
