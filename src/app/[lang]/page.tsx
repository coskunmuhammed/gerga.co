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
import { ContentService } from "@/services/content-service";

interface HeroContent {
  trOverline?: string;
  enOverline?: string;
  trHeadline?: string;
  enHeadline?: string;
  trDescription?: string;
  enDescription?: string;
  trPrimaryCta?: string;
  enPrimaryCta?: string;
}

interface SectionConfigItem {
  sectionKey: string;
  active: boolean;
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  let exhibitionConfig = null;
  let heroContent: HeroContent | null = null;
  let productsData: unknown[] = [];
  let saplingsData: unknown[] = [];
  let servicesData: unknown[] = [];
  let contactData: Record<string, unknown> | null = null;
  let sectionConfigs: SectionConfigItem[] = [];

  try {
    exhibitionConfig = await prisma.exhibitionConfig.findUnique({
      where: { id: "default" },
    });
    heroContent = await ContentService.getSiteContentSection("hero");
    productsData = await ContentService.getPublicProducts(lang);
    saplingsData = await ContentService.getPublicSaplings(lang);
    servicesData = await ContentService.getPublicServices(lang);
    contactData = await ContentService.getContactConfig(lang);
    sectionConfigs = await ContentService.getSectionConfigs();
  } catch {
    // Graceful fallback if database unavailable
  }

  const isSectionActive = (key: string) => {
    if (!sectionConfigs || sectionConfigs.length === 0) return true;
    const sec = sectionConfigs.find((s) => s.sectionKey === key);
    return sec ? sec.active : true;
  };

  return (
    <main className="min-h-screen bg-[#090b09] text-[#f7f5ef] selection:bg-[#d4af37] selection:text-black overflow-x-hidden">
      {/* Top Navigation Stack (Exhibition Banner + Header) */}
      <div className="sticky top-0 left-0 right-0 z-50 w-full bg-[#090b09]">
        <ExhibitionBanner lang={lang} initialConfig={exhibitionConfig} />
        <Header lang={lang} />
      </div>

      {/* 1. Hero */}
      {isSectionActive("hero") && <Hero lang={lang} content={heroContent} />}

      {/* 2. GERGA’nın Kısa Tanımı */}
      {isSectionActive("intro") && <Intro lang={lang} />}

      {/* 3. Ege ve İncir Kökeni */}
      {isSectionActive("aegean") && <Aegean lang={lang} />}

      {/* 4. Ürün Yaklaşımı */}
      {isSectionActive("products") && <Products lang={lang} productsData={productsData} />}

      {/* 5. Fidan Üretimi */}
      {isSectionActive("nursery") && <Nursery lang={lang} saplingsData={saplingsData} />}

      {/* 6. Bahçe Kurulumu ve Saha Hizmetleri */}
      {isSectionActive("engineering") && <Engineering lang={lang} servicesData={servicesData} />}

      {/* 7. GERGA Akademi */}
      {isSectionActive("academy") && <Academy lang={lang} />}

      {/* 8. Fuar Görüşmesi ve B2B İletişim */}
      {isSectionActive("b2bMeeting") && <ExhibitionMeeting lang={lang} />}

      {/* 9. Fuar Sonrası Dönüşüm */}
      {isSectionActive("postExhibition") && <PostExhibitionConversion lang={lang} />}

      {/* 10. Galeri */}
      {isSectionActive("gallery") && <Gallery lang={lang} />}

      {/* 11. İletişim ve Dijital Kart */}
      {isSectionActive("contact") && <ContactCard lang={lang} contactData={contactData} />}

      {/* 12. Footer */}
      <Footer lang={lang} contactData={contactData} />
    </main>
  );
}
