"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, Calendar, Sparkles, Info } from "lucide-react";
import Image from "next/image";
import { getDictionary } from "@/dictionaries";
import { MEDIA_CONFIG } from "@/config/media";

interface HeroProps {
  lang: string;
  content?: {
    trOverline?: string;
    enOverline?: string;
    trHeadline?: string;
    enHeadline?: string;
    trDescription?: string;
    enDescription?: string;
    trPrimaryCta?: string;
    enPrimaryCta?: string;
  } | null;
}

export default function Hero({ lang, content }: HeroProps) {
  const dict = getDictionary(lang);
  const media = MEDIA_CONFIG.hero;
  const isEn = lang === "en";

  const overline = isEn ? (content?.enOverline || dict.hero.overline) : (content?.trOverline || dict.hero.overline);
  const headline = isEn ? (content?.enHeadline || dict.hero.headline) : (content?.trHeadline || dict.hero.headline);
  const description = isEn ? (content?.enDescription || dict.hero.description) : (content?.trDescription || dict.hero.description);
  const primaryCta = isEn ? (content?.enPrimaryCta || dict.hero.primaryCta) : (content?.trPrimaryCta || dict.hero.primaryCta);

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center pt-12 sm:pt-16 pb-16 overflow-hidden bg-[#090b09]">
      {/* Hero Photography Overlay with Alt tag */}
      <div className="absolute inset-0 z-0">
        <Image
          src={media.src}
          alt={media.alt[lang === "en" ? "en" : "tr"]}
          fill
          priority
          className="object-cover object-center scale-105 opacity-35 filter brightness-75 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b09] via-[#090b09]/60 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#090b09]/40 to-[#090b09]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 text-center flex flex-col items-center">
        {/* Overline Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/40 bg-black/70 backdrop-blur-md mb-8 shadow-2xl"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-[#d4af37] uppercase font-semibold">
            {overline}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-serif text-3xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[1.1] font-light max-w-5xl"
        >
          {headline}
        </motion.h1>

        {/* Core Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 sm:mt-8 text-base sm:text-xl text-gray-200 font-light max-w-3xl leading-relaxed tracking-wide font-sans"
        >
          {description}
        </motion.p>

        {/* Action Buttons (Min 44px height for mobile touch targets) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <a
            href="#intro"
            className="w-full sm:w-auto px-8 py-4 min-h-[48px] rounded-full bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#e5c158] transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <span>{primaryCta}</span>
            <ArrowDownRight className="w-4 h-4 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
          </a>

          <a
            href="#b2b-meeting"
            className="w-full sm:w-auto px-8 py-4 min-h-[48px] rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white font-medium text-xs uppercase tracking-[0.2em] hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300 flex items-center justify-center gap-3"
          >
            <Calendar className="w-4 h-4 text-[#d4af37]" />
            <span>{dict.hero.secondaryCta}</span>
          </a>
        </motion.div>

        {/* Representative Disclaimer Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 inline-flex items-center gap-2 text-[11px] font-mono text-gray-400 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-full"
        >
          <Info className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{dict.hero.disclaimer}</span>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[10px] tracking-[0.3em] font-mono uppercase text-[#d4af37]">
          Scroll
        </span>
        <div className="w-[1px] h-6 bg-gradient-to-b from-[#d4af37] to-transparent animate-bounce" />
      </div>
    </section>
  );
}
