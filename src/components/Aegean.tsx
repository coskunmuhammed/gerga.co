"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sun, Wind, Mountain, MapPin, Info } from "lucide-react";
import { getDictionary } from "@/dictionaries";
import { MEDIA_CONFIG } from "@/config/media";

interface AegeanProps {
  lang: string;
}

export default function Aegean({ lang }: AegeanProps) {
  const dict = getDictionary(lang);
  const media = MEDIA_CONFIG.aegeanTerroir;

  const icons = [Wind, Mountain, Sun];

  return (
    <section id="aegean" className="py-28 bg-[#090b09] relative overflow-hidden border-t border-white/5">
      {/* Full-width Immersive Photographic Background Banner */}
      <div className="relative w-full h-[450px] lg:h-[580px] mb-20 overflow-hidden">
        <Image
          src={media.src}
          alt={media.alt[lang === "en" ? "en" : "tr"]}
          fill
          className="object-cover object-center filter brightness-90 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b09] via-[#090b09]/50 to-[#090b09]" />
        
        {/* Overlay Title */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/40 bg-black/70 backdrop-blur-md mb-6">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-xs font-mono tracking-[0.2em] text-[#d4af37] uppercase">
                Büyük Menderes Basin • Aydın, Turkey
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-light tracking-tight leading-tight">
              {dict.aegean.title}
            </h2>
            <p className="mt-4 text-sm sm:text-lg text-gray-300 font-light max-w-2xl">
              {dict.aegean.subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Terroir Detail Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-start justify-between mb-12 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[1px] bg-[#d4af37]" />
              <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#d4af37]">
                {dict.aegean.tag}
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-white">
              Doğal İklim ve Toprak Dengesi
            </h3>
          </div>
          <div className="flex flex-col max-w-xl">
            <p className="text-gray-300 text-sm leading-relaxed font-light">
              {dict.aegean.description}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs font-mono text-gray-400 bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
              <Info className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>{dict.aegean.disclaimer}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dict.aegean.cards.map((card, index) => {
            const IconComponent = icons[index % icons.length];
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                className="glass-card p-8 rounded-3xl flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center mb-6 group-hover:bg-[#d4af37] transition-all duration-300">
                    <IconComponent className="w-6 h-6 text-[#d4af37] group-hover:text-black transition-colors" />
                  </div>

                  <h4 className="font-serif text-xl text-white font-medium mb-3">
                    {card.title}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">
                    {card.desc}
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
