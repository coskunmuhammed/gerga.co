"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getDictionary } from "@/dictionaries";
import { MEDIA_CONFIG } from "@/config/media";
import { Sprout, Shield, Layers, BookOpen } from "lucide-react";

interface IntroProps {
  lang: string;
}

export default function Intro({ lang }: IntroProps) {
  const dict = getDictionary(lang);
  const media = MEDIA_CONFIG.productFig;

  const pillarIcons = [Shield, Sprout, Layers, BookOpen];

  return (
    <section id="intro" className="py-24 lg:py-32 bg-[#090b09] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Tagline Header */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-[1px] bg-[#d4af37]" />
          <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#d4af37]">
            {dict.intro.tag}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 flex flex-col gap-6"
          >
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-light leading-[1.15]">
              {dict.intro.title}
            </h2>
            <p className="text-gray-300 font-light text-base sm:text-lg leading-relaxed">
              {dict.intro.description}
            </p>
          </motion.div>

          {/* Right Column Photography */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black"
          >
            <Image
              src={media.src}
              alt={media.alt[lang === "en" ? "en" : "tr"]}
              fill
              className="object-cover img-editorial filter brightness-90 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-gray-300">
              {media.caption?.[lang === "en" ? "en" : "tr"]}
            </div>
          </motion.div>
        </div>

        {/* 4 Brand Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 pt-12 border-t border-white/10">
          {dict.intro.pillars.map((pillar, idx) => {
            const Icon = pillarIcons[idx % pillarIcons.length];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="glass-card p-6 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg text-white font-medium mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
