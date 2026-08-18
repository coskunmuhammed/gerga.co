"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Menu, X, ArrowUpRight, Award } from "lucide-react";
import { getDictionary } from "@/dictionaries";

import GergaLogo from "./GergaLogo";

interface HeaderProps {
  lang: string;
}

export default function Header({ lang }: HeaderProps) {
  const dict = getDictionary(lang);
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const switchLanguage = (newLang: string) => {
    // Save language choice in cookie
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000; SameSite=Lax`;

    // Preserve hash fragment if present
    const hash = typeof window !== "undefined" ? window.location.hash : "";

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && (segments[0] === "tr" || segments[0] === "en")) {
      segments[0] = newLang;
      if (newLang === "en" && segments[1] === "katalog") {
        segments[1] = "catalogue";
      } else if (newLang === "tr" && segments[1] === "catalogue") {
        segments[1] = "katalog";
      }
    } else {
      segments.unshift(newLang);
    }
    const newPath = "/" + segments.join("/") + hash;
    router.push(newPath);
  };

  const catalogueHref = lang === "en" ? "/en/catalogue" : "/tr/katalog";

  const navLinks = [
    { href: "#intro", label: dict.nav.intro },
    { href: "#aegean", label: dict.nav.aegean },
    { href: "#products", label: dict.nav.products },
    { href: "#nursery", label: dict.nav.nursery },
    { href: "#engineering", label: dict.nav.engineering },
    { href: "#b2b-meeting", label: dict.nav.b2bMeeting },
    { href: "#post-exhibition", label: dict.nav.postExhibition },
    { href: catalogueHref, label: dict.nav.catalogue, isExternal: true },
    { href: "#gallery", label: dict.nav.gallery },
    { href: "#contact", label: dict.nav.contact },
  ];

  return (
    <header
      className={`w-full transition-all duration-500 relative z-40 ${
        isScrolled
          ? "glass-header py-2.5 shadow-2xl"
          : "bg-gradient-to-b from-black/90 via-black/50 to-transparent py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        {/* Brand Logo & Emblem */}
        <Link href={`/${lang}`} className="group flex items-center shrink-0">
          <GergaLogo variant="inline" size="sm" theme="gold" showSubtitle={true} />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2.5 xl:gap-5 2xl:gap-7 overflow-x-auto scrollbar-none">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[10px] xl:text-[11px] uppercase tracking-[0.12em] xl:tracking-[0.16em] text-gray-300 hover:text-[#d4af37] transition-colors font-medium relative group py-1 whitespace-nowrap shrink-0"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#d4af37] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Language Switcher & Exhibition Badge */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center bg-black/60 border border-white/10 rounded-full p-1 text-xs">
            <button
              onClick={() => switchLanguage("tr")}
              className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 min-h-[36px] ${
                lang === "tr"
                  ? "bg-[#d4af37] text-black font-semibold shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span>🇹🇷</span> TR
            </button>
            <button
              onClick={() => switchLanguage("en")}
              className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 min-h-[36px] ${
                lang === "en"
                  ? "bg-[#d4af37] text-black font-semibold shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span>🇬🇧</span> EN
            </button>
          </div>

          <a
            href="#b2b-meeting"
            className="px-4 py-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] text-[11px] font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-[#d4af37] hover:text-black transition-all duration-300 min-h-[44px]"
          >
            <Award className="w-3.5 h-3.5" />
            <span>{dict.nav.exhibitionBadge}</span>
          </a>
        </div>

        {/* Mobile View Controls */}
        <div className="flex lg:hidden items-center gap-2.5">
          {/* Quick Lang Switch */}
          <button
            onClick={() => switchLanguage(lang === "tr" ? "en" : "tr")}
            className="px-3 py-1.5 rounded-full border border-white/20 text-xs font-semibold flex items-center gap-1.5 text-gray-200 min-h-[44px]"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Hamburger Menu Button (Min 44px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] bg-[#090b09]/98 backdrop-blur-2xl z-40 px-6 py-6 flex flex-col justify-between border-t border-white/10 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div className="text-[10px] tracking-[0.25em] uppercase text-[#d4af37] font-mono border-b border-white/10 pb-2">
              GERGA Menu
            </div>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-serif text-gray-200 hover:text-[#d4af37] transition-colors py-2 flex items-center justify-between min-h-[44px]"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-4 h-4 text-gray-500" />
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-6 mt-6">
            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-xs text-gray-400 font-mono">Language / Dil</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    switchLanguage("tr");
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold min-h-[44px] ${
                    lang === "tr"
                      ? "bg-[#d4af37] text-black"
                      : "bg-white/10 text-gray-300"
                  }`}
                >
                  Türkçe 🇹🇷
                </button>
                <button
                  onClick={() => {
                    switchLanguage("en");
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold min-h-[44px] ${
                    lang === "en"
                      ? "bg-[#d4af37] text-black"
                      : "bg-white/10 text-gray-300"
                  }`}
                >
                  English 🇬🇧
                </button>
              </div>
            </div>

            <a
              href="#b2b-meeting"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3.5 rounded-xl bg-[#d4af37] text-black font-semibold uppercase tracking-wider text-xs shadow-lg min-h-[44px] flex items-center justify-center"
            >
              {dict.nav.exhibitionBadge}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
