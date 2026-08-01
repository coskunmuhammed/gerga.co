"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Cpu, Layers, Compass, CheckCircle2, SlidersHorizontal } from "lucide-react";
import { getDictionary } from "@/dictionaries";

interface EngineeringProps {
  lang: string;
}

export default function Engineering({ lang }: EngineeringProps) {
  const dict = getDictionary(lang);

  return (
    <section id="engineering" className="py-32 bg-[#090b09] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Tag */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[1px] bg-[#d4af37]" />
          <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#d4af37]">
            {dict.engineering.tag}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-light">
              {dict.engineering.title}
            </h2>
            <p className="mt-3 text-base sm:text-xl text-[#d4af37] font-light max-w-2xl">
              {dict.engineering.subtitle}
            </p>
          </div>
          <p className="text-gray-400 max-w-md text-sm leading-relaxed font-light">
            {dict.engineering.p1}
          </p>
        </div>

        {/* Drone Engineering Image Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden mb-16 border border-white/10 shadow-2xl"
        >
          <Image
            src="/images/engineering.png"
            alt="Drone View Precision Orchard Engineering"
            fill
            className="object-cover img-editorial filter brightness-90 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5 text-[#d4af37]" />
              <span className="text-xs font-mono text-gray-200 tracking-wider">
                Precision GPS Grid & Sub-Surface Drip Irrigation Protocol
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-widest bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/30">
              Turnkey Execution Ready
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
                  0{idx + 1} // STEP
                </div>
                <h4 className="font-serif text-xl text-white font-medium mb-3">
                  {service.name}
                </h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  {service.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] font-mono text-[#d4af37]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>GERGA Certified</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
