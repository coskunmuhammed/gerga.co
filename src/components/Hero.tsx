"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, Compass, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import { getDictionary } from "@/dictionaries";

interface HeroProps {
  lang: string;
}

export default function Hero({ lang }: HeroProps) {
  const dict = getDictionary(lang);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#090b09]">
      {/* Background Photography with Parallax Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.png"
          alt="GERGA Aegean Fig Orchard"
          fill
          priority
          className="object-cover object-center scale-105 opacity-35 filter brightness-75 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b09] via-[#090b09]/60 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#090b09]/40 to-[#090b09]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 text-center flex flex-col items-center">
        {/* Exhibition Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#d4af37]/30 bg-black/60 backdrop-blur-md mb-8 shadow-2xl"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#d4af37] uppercase">
            {dict.hero.subtitle}
          </span>
        </motion.div>

        {/* Cinematic Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[1.08] font-light max-w-5xl"
        >
          {dict.hero.title}{" "}
          <span className="font-semibold block sm:inline text-gold-gradient italic">
            {dict.hero.titleGold}
          </span>
        </motion.h1>

        {/* Short Manifesto Block */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 text-base sm:text-xl text-gray-300 font-light max-w-3xl leading-relaxed tracking-wide font-sans"
        >
          “{dict.hero.manifesto}”
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <a
            href="#products"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#e5c158] transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <span>{dict.hero.primaryCta}</span>
            <ArrowDownRight className="w-4 h-4 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
          </a>

          <a
            href="#contact"
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white font-medium text-xs uppercase tracking-[0.2em] hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300 flex items-center justify-center gap-3"
          >
            <Compass className="w-4 h-4 text-[#d4af37]" />
            <span>{dict.hero.secondaryCta}</span>
          </a>
        </motion.div>

        {/* Bottom Metrics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl border-t border-white/10 pt-10"
        >
          {dict.hero.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:border-[#d4af37]/30 transition-all"
            >
              <span className="font-serif text-3xl md:text-4xl text-[#d4af37] font-semibold tracking-tight">
                {metric.value}
              </span>
              <span className="mt-1 text-xs tracking-[0.18em] uppercase text-gray-400 font-mono">
                {metric.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Subtle Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[10px] tracking-[0.3em] font-mono uppercase text-[#d4af37]">
          Scroll
        </span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#d4af37] to-transparent animate-bounce" />
      </div>
    </section>
  );
}
