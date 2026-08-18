"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe, ArrowUp } from "lucide-react";
import { getDictionary } from "@/dictionaries";
import GergaLogo from "./GergaLogo";

interface FooterProps {
  lang: string;
  contactData?: {
    phone?: string;
    publicEmail?: string;
    whatsapp?: string;
    addressTr?: string;
    addressEn?: string;
  } | null;
}

export default function Footer({ lang, contactData }: FooterProps) {
  void contactData;
  const dict = getDictionary(lang);
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = (newLang: string) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && (segments[0] === "tr" || segments[0] === "en")) {
      segments[0] = newLang;
    } else {
      segments.unshift(newLang);
    }
    const newPath = "/" + segments.join("/");
    router.push(newPath);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#060806] text-gray-400 py-16 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-white/10">
          {/* Logo & Tagline */}
          <div className="flex flex-col gap-2">
            <Link href={`/${lang}`} className="flex items-center">
              <GergaLogo variant="inline" size="sm" theme="gold" showSubtitle={true} />
            </Link>
            <p className="text-xs text-gray-500 font-light font-sans max-w-sm">
              {dict.footer.tagline}
            </p>
          </div>

          {/* Language Switcher & Scroll to Top */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs">
              <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
              <button
                onClick={() => switchLanguage("tr")}
                className={`px-2 py-0.5 rounded ${
                  lang === "tr" ? "text-[#d4af37] font-bold" : "hover:text-white"
                }`}
              >
                TR
              </button>
              <span className="text-gray-600">/</span>
              <button
                onClick={() => switchLanguage("en")}
                className={`px-2 py-0.5 rounded ${
                  lang === "en" ? "text-[#d4af37] font-bold" : "hover:text-white"
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={scrollToTop}
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-[#d4af37] text-gray-300 hover:text-[#d4af37] transition-all"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <p>{dict.footer.rights}</p>
          <p className="text-gray-600">{dict.footer.legalNotice}</p>
        </div>
      </div>
    </footer>
  );
}
