"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sun, Wind, Mountain, Compass, MapPin } from "lucide-react";
import { getDictionary } from "@/dictionaries";

interface AegeanProps {
  lang: string;
}

export default function Aegean({ lang }: AegeanProps) {
  const dict = getDictionary(lang);

  const icons = [Wind, Mountain, Sun];

  return (
    <section id="aegean" className="py-28 bg-[#090b09] relative overflow-hidden">
      {/* Full-width Immersive Photographic Background Banner */}
      <div className="relative w-full h-[500px] lg:h-[650px] mb-20 overflow-hidden">
        <Image
          src="/images/aegean-terroir.png"
          alt="Aegean Terroir Landscape"
          fill
          className="object-cover object-center filter brightness-90 contrast-110 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b09] via-[#090b09]/50 to-[#090b09]" />
        
        {/* Overlay Terroir Badge & Title */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/40 bg-black/70 backdrop-blur-md mb-6">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-xs font-mono tracking-[0.25em] text-[#d4af37] uppercase">
                Büyük Menderes Basin • Aydın, Turkey
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-white font-light tracking-tight leading-tight">
              {dict.aegean.title}
            </h2>
            <p className="mt-4 text-base sm:text-xl text-gray-300 font-light max-w-2xl">
              {dict.aegean.subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Terroir Detail Cards */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-start justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[1px] bg-[#d4af37]" />
              <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#d4af37]">
                {dict.aegean.tag}
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-white">
              Microclimate & Soil Parameters
            </h3>
          </div>
          <p className="text-gray-400 max-w-xl text-sm leading-relaxed font-light">
            {dict.aegean.description}
          </p>
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

                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col">
                  <span className="font-serif text-3xl text-[#d4af37] font-semibold">
                    {card.stat}
                  </span>
                  <span className="text-[11px] font-mono tracking-wider text-gray-400 uppercase mt-1">
                    {card.statLabel}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
