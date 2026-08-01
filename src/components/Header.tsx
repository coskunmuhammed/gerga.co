"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Menu, X, ArrowUpRight, Award } from "lucide-react";
import { getDictionary } from "@/dictionaries";

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
    // Replace current lang in URL path
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && (segments[0] === "tr" || segments[0] === "en")) {
      segments[0] = newLang;
    } else {
      segments.unshift(newLang);
    }
    const newPath = "/" + segments.join("/");
    router.push(newPath);
  };

  const navLinks = [
    { href: "#story", label: dict.nav.story },
    { href: "#aegean", label: dict.nav.aegean },
    { href: "#products", label: dict.nav.products },
    { href: "#nursery", label: dict.nav.nursery },
    { href: "#engineering", label: dict.nav.engineering },
    { href: "#academy", label: dict.nav.academy },
    { href: "#gallery", label: dict.nav.gallery },
    { href: "#why-us", label: dict.nav.whyUs },
    { href: "#contact", label: dict.nav.contact },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "glass-header py-3 shadow-2xl"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Brand Logo & Emblem */}
        <Link href={`/${lang}`} className="group flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#d4af37]/40 flex items-center justify-center bg-[#090b09]/80 group-hover:border-[#d4af37] transition-all">
            <span className="text-[#d4af37] font-serif text-lg font-bold tracking-widest">
              G
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl tracking-[0.25em] text-white font-bold group-hover:text-[#d4af37] transition-colors">
              GERGA
            </span>
            <span className="text-[9px] tracking-[0.3em] text-[#8e998f] uppercase font-mono">
              Aegean Terroir
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-[0.18em] text-gray-300 hover:text-[#d4af37] transition-colors font-medium relative group py-1"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#d4af37] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Language Switcher & Exhibition Badge */}
        <div className="hidden lg:flex items-center gap-5">
          {/* Language Switch Button */}
          <div className="flex items-center bg-black/60 border border-white/10 rounded-full p-1 text-xs">
            <button
              onClick={() => switchLanguage("tr")}
              className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                lang === "tr"
                  ? "bg-[#d4af37] text-black font-semibold shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span>🇹🇷</span> TR
            </button>
            <button
              onClick={() => switchLanguage("en")}
              className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                lang === "en"
                  ? "bg-[#d4af37] text-black font-semibold shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span>🇬🇧</span> EN
            </button>
          </div>

          {/* B2B Exhibition CTA */}
          <a
            href="#contact"
            className="px-4 py-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-[#d4af37] hover:text-black transition-all duration-300 pulse-badge"
          >
            <Award className="w-3.5 h-3.5" />
            <span>{dict.nav.exhibitionBadge}</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center gap-3">
          {/* Quick Lang switch mobile */}
          <button
            onClick={() => switchLanguage(lang === "tr" ? "en" : "tr")}
            className="px-2.5 py-1 rounded-full border border-white/20 text-xs font-semibold flex items-center gap-1 text-gray-200"
          >
            <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{lang.toUpperCase()}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-200 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[65px] bg-[#090b09]/95 backdrop-blur-2xl z-40 px-6 py-8 flex flex-col justify-between border-t border-white/10 overflow-y-auto">
          <div className="flex flex-col gap-5">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af37] font-mono border-b border-white/10 pb-2">
              GERGA Menu
            </div>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-serif text-gray-200 hover:text-[#d4af37] transition-colors py-1 flex items-center justify-between"
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
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
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3.5 rounded-xl bg-[#d4af37] text-black font-semibold uppercase tracking-wider text-xs shadow-lg"
            >
              {dict.nav.exhibitionBadge}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
