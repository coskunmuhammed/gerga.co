"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Compass, CheckCircle2, Info } from "lucide-react";
import { getDictionary } from "@/dictionaries";
import { MEDIA_CONFIG } from "@/config/media";

interface EngineeringProps {
  lang: string;
  servicesData?: unknown[];
}

export default function Engineering({ lang, servicesData }: EngineeringProps) {
  void servicesData;
  const dict = getDictionary(lang);
  const media = MEDIA_CONFIG.engineering;

  return (
    <section id="engineering" className="py-28 bg-[#090b09] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Tag */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[1px] bg-[#d4af37]" />
          <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#d4af37]">
            {dict.engineering.tag}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
          <div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-light">
              {dict.engineering.title}
            </h2>
            <p className="mt-3 text-sm sm:text-lg text-[#d4af37] font-light max-w-2xl">
              {dict.engineering.subtitle}
            </p>
          </div>
          <div className="flex flex-col max-w-md">
            <p className="text-gray-300 text-sm leading-relaxed font-light">
              {dict.engineering.p1}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs font-mono text-gray-400 bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
              <Info className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>{dict.engineering.disclaimer}</span>
            </div>
          </div>
        </div>

        {/* Drone Engineering Image Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden mb-16 border border-white/10 shadow-2xl bg-black"
        >
          <Image
            src={media.src}
            alt={media.alt[lang === "en" ? "en" : "tr"]}
            fill
            className="object-cover img-editorial filter brightness-90 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-gray-300">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#d4af37]" />
              <span>{media.caption?.[lang === "en" ? "en" : "tr"]}</span>
            </div>
            <span className="text-[10px] text-[#d4af37] uppercase tracking-widest bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/30">
              {lang === "en" ? "Field Execution" : "Saha Uygulaması"}
            </span>
          </div>
        </motion.div>

        {/* 4 Engineering Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dict.engineering.services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="glass-card p-6 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-mono text-[#d4af37] mb-3">
                  {`0${idx + 1} // ${lang === "en" ? "STEP" : "ADIM"}`}
                </div>
                <h4 className="font-serif text-lg text-white font-medium mb-3">
                  {service.name}
                </h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  {service.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] font-mono text-[#d4af37]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{lang === "en" ? "GERGA Service Standard" : "GERGA Hizmet Standardı"}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
