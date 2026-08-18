"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Printer, ArrowLeft, CheckCircle2, Phone, Mail, MapPin, Globe, Leaf, Shield, Award } from "lucide-react";
import { getDictionary } from "@/dictionaries";
import { trackEvent } from "@/lib/analytics";

import GergaLogo from "@/components/GergaLogo";

interface CatalogueClientProps {
  lang: string;
}

export default function CatalogueClient({ lang }: CatalogueClientProps) {
  const dict = getDictionary(lang);
  const isEn = lang === "en";

  useEffect(() => {
    trackEvent("catalogue_view", { locale: lang });
  }, [lang]);

  const handlePrint = () => {
    trackEvent("catalogue_download", { type: "pdf_print" });
    window.print();
  };

  return (
    <main className="min-h-screen bg-[#090b09] text-[#f7f5ef] print:bg-white print:text-black font-sans selection:bg-[#d4af37] selection:text-black">
      {/* Print-Hidden Top Bar */}
      <div className="print:hidden border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-50 py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-300 hover:text-[#d4af37] transition-colors min-h-[44px] px-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? "Back to GERGA.CO" : "GERGA Ana Sayfaya Dön"}</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#e5c158] transition-all min-h-[44px] cursor-pointer shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>{dict.catalogue.downloadPdf}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Catalogue Sheet Container */}
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-8 print:py-0 print:px-0">
        <article className="glass-card print:glass-card-none bg-[#0e120e] print:bg-white border border-[#d4af37]/30 print:border-none rounded-3xl p-8 sm:p-12 print:p-0 shadow-2xl text-white print:text-black">
          
          {/* Header & Logo */}
          <header className="border-b border-white/10 print:border-black/20 pb-8 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <GergaLogo variant="inline" size="md" theme="gold" showSubtitle={true} />
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 print:bg-black/10 text-[#d4af37] print:text-black border border-[#d4af37]/40 print:border-black/20 uppercase tracking-widest">
                  B2B Profile
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-white print:text-black font-light">
                {dict.catalogue.title}
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 print:text-gray-700 font-light mt-1">
                {dict.catalogue.subtitle}
              </p>
            </div>

            <div className="text-left sm:text-right font-mono text-xs text-gray-400 print:text-gray-600 space-y-1">
              <div>Ref: GERGA-CAT-2026</div>
              <div>Aydın / TÜRKİYE</div>
              <div>info@gerga.co</div>
            </div>
          </header>

          {/* Section 1: About GERGA */}
          <section className="mb-10">
            <div className="flex items-center gap-2 text-[#d4af37] print:text-black text-xs font-mono uppercase tracking-widest mb-3">
              <Leaf className="w-4 h-4" />
              <span>01. {isEn ? "About GERGA" : "GERGA Hakkında"}</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-200 print:text-gray-800 font-light">
              {isEn
                ? "GERGA is an integrated agricultural ecosystem rooted in the Aegean basin. We unite centuries-old fig farming traditions with scientific orchard management, certified true-to-type sapling production, and direct commercial supply chains."
                : "GERGA, Ege havzasının kadim tarım mirasını ve bilimsel yetiştiricilik esaslarını bir araya getiren entegre bir tarım ekosistemidir. Aydın ve Büyük Menderes havzasında kuru incir ihracatı, sertifikalı fidan üretimi ve kapama bahçe kurulumu alanlarında hizmet vermektedir."}
            </p>
          </section>

          {/* Section 2: Dried Figs */}
          <section className="mb-10 border-t border-white/10 print:border-black/10 pt-8">
            <div className="flex items-center gap-2 text-[#d4af37] print:text-black text-xs font-mono uppercase tracking-widest mb-3">
              <Award className="w-4 h-4" />
              <span>02. {isEn ? "Aegean Dried Figs Selection" : "Ege Kuru İncir Seçkisi"}</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-200 print:text-gray-800 font-light mb-4">
              {isEn
                ? "Naturally sun-dried Sarılop & Mountain figs, hand-selected from the mountain slopes of Aydın and the Meander valley. Available in export grade calibers and bulk B2B packaging."
                : "Aydın dağlarından ve Büyük Menderes ovasından özenle seçilen, kalibrelerine ayrıştırılmış doğal Sarılop ve dağ incirleri. İhracat standartlarında toptan ambalaj ve özel ambalajlama seçenekleri sunulmaktadır."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300 print:text-gray-700 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] print:text-black shrink-0" />
                <span>{isEn ? "Calibers: Lerida, Protoben, Pulled, Layer" : "Kalibreler: Lerida, Protoben, Pulled, Layer"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] print:text-black shrink-0" />
                <span>{isEn ? "Packaging: 5kg / 10kg Cartons & Retail" : "Ambalaj: 5kg / 10kg Kasa ve Perakende"}</span>
              </div>
            </div>
          </section>

          {/* Section 3: Sapling Production & Orchard Setup */}
          <section className="mb-10 border-t border-white/10 print:border-black/10 pt-8">
            <div className="flex items-center gap-2 text-[#d4af37] print:text-black text-xs font-mono uppercase tracking-widest mb-3">
              <Shield className="w-4 h-4" />
              <span>03. {isEn ? "Sapling Production & Turnkey Orchards" : "Fidan Üretimi & Kapama Bahçe Kurulumu"}</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-200 print:text-gray-800 font-light mb-4">
              {isEn
                ? "High-yield, virus-free, true-to-type fig saplings produced specifically for commercial orchards. Full turnkey field preparation, planting, irrigation layout, and agronomic advisory."
                : "Ticari kapama bahçeler için çeşide doğru, hastalıksız, yüksek verimli incir fidanı üretimi. Toprak analizinden dikim düzenine, sulama altyapısından teknik bakıma kadar anahtar teslim saha kurulumu."}
            </p>
          </section>

          {/* Section 4: B2B Partnership Options */}
          <section className="mb-10 border-t border-white/10 print:border-black/10 pt-8">
            <div className="flex items-center gap-2 text-[#d4af37] print:text-black text-xs font-mono uppercase tracking-widest mb-3">
              <Globe className="w-4 h-4" />
              <span>04. {isEn ? "B2B Partnership & Supply Models" : "İş Birliği ve Tedarik Modelleri"}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white/5 print:bg-gray-100 border border-white/10 print:border-gray-300">
                <div className="font-semibold text-white print:text-black mb-1">
                  {isEn ? "Wholesale Export" : "Toptan İhracat"}
                </div>
                <div className="text-gray-300 print:text-gray-700 font-light">
                  {isEn ? "Direct container / truck supply for international importers." : "Uluslararası ithalatçılar için doğrudan tır/konteyner yükleme."}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 print:bg-gray-100 border border-white/10 print:border-gray-300">
                <div className="font-semibold text-white print:text-black mb-1">
                  {isEn ? "Sample Evaluation" : "Numune Değerlendirme"}
                </div>
                <div className="text-gray-300 print:text-gray-700 font-light">
                  {isEn ? "Product sample dispatch for quality compliance & testing." : "Kalite testi ve numune talepleri değerlendirme süreci."}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 print:bg-gray-100 border border-white/10 print:border-gray-300">
                <div className="font-semibold text-white print:text-black mb-1">
                  {isEn ? "Regional Distribution" : "Bölgesel Distribütörlük"}
                </div>
                <div className="text-gray-300 print:text-gray-700 font-light">
                  {isEn ? "Long-term partnership agreements for target regional markets." : "Hedef pazar ve bölgelerde uzun vadeli distribütörlük anlaşmaları."}
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Contact Footer */}
          <footer className="border-t border-white/10 print:border-black/20 pt-8 mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2 text-xs text-gray-300 print:text-gray-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37] print:text-black" />
                <span>Büyük Menderes Havzası, Aydın / TÜRKİYE</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#d4af37] print:text-black" />
                <span>info@gerga.co</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#d4af37] print:text-black" />
                <span>+90 (850) 885 43 74</span>
              </div>
            </div>

            <div className="print:hidden">
              <Link
                href={`/${lang}#b2b-meeting`}
                className="inline-block px-5 py-3 rounded-xl bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#e5c158] transition-all min-h-[44px]"
              >
                {isEn ? "Submit B2B Inquiry" : "B2B Talep Gönder"}
              </Link>
            </div>
          </footer>

        </article>
      </div>
    </main>
  );
}
