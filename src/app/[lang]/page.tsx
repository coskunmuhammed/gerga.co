import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Aegean from "@/components/Aegean";
import Products from "@/components/Products";
import Nursery from "@/components/Nursery";
import Engineering from "@/components/Engineering";
import Academy from "@/components/Academy";
import Gallery from "@/components/Gallery";
import WhyUs from "@/components/WhyUs";
import Contact from "@/components/Contact";
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

      {/* 1. Opening Hero */}
      <Hero lang={lang} />

      {/* 2. The Story of GERGA */}
      <Story lang={lang} />

      {/* 3. The Aegean Terroir */}
      <Aegean lang={lang} />

      {/* 4. Our Products (Exhibition Collection) */}
      <Products lang={lang} />

      {/* 5. Fig Nursery */}
      <Nursery lang={lang} />

      {/* 6. Orchard Engineering */}
      <Engineering lang={lang} />

      {/* 7. GERGA Academy */}
      <Academy lang={lang} />

      {/* 8. Gallery (Masonry & Lightbox) */}
      <Gallery lang={lang} />

      {/* 9. Why GERGA */}
      <WhyUs lang={lang} />

      {/* 10. Contact & Partner Desk */}
      <Contact lang={lang} />

      {/* 11. Minimalist Luxury Footer */}
      <Footer lang={lang} />
    </main>
  );
}
