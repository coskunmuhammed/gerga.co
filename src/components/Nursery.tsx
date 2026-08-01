"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sprout, Dna, ShieldCheck, TrendingUp } from "lucide-react";
import { getDictionary } from "@/dictionaries";

interface NurseryProps {
  lang: string;
}

export default function Nursery({ lang }: NurseryProps) {
  const dict = getDictionary(lang);

  return (
    <section id="nursery" className="py-32 bg-[#090b09] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[1px] bg-[#d4af37]" />
          <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#d4af37]">
            {dict.nursery.tag}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image with Stats Overlay */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/images/nursery.png"
                alt="GERGA High-Tech Sapling Nursery"
                fill
                className="object-cover img-editorial filter brightness-95 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
            </div>

            {/* Nursery Floating Metrics Card */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {dict.nursery.stats.map((stat, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-[#d4af37]/30 backdrop-blur-md flex flex-col justify-center"
                >
                  <span className="font-serif text-3xl lg:text-4xl text-[#d4af37] font-semibold">
                    {stat.value}
                  </span>
                  <span className="text-[11px] font-mono tracking-wider uppercase text-gray-400 mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Information & Key Genetics */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-light leading-tight mb-4">
              {dict.nursery.title}
            </h2>
            <h3 className="text-base sm:text-xl text-[#d4af37] font-light mb-6">
              {dict.nursery.subtitle}
            </h3>
            <p className="text-gray-300 font-light text-sm sm:text-base leading-relaxed mb-8">
              {dict.nursery.desc}
            </p>

            {/* Genetics Feature List */}
            <div className="space-y-6">
              {dict.nursery.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#d4af37]/30 transition-all">
                  <div className="p-2.5 rounded-lg bg-[#d4af37]/10 text-[#d4af37] shrink-0 mt-0.5">
                    {idx === 0 && <Dna className="w-5 h-5" />}
                    {idx === 1 && <TrendingUp className="w-5 h-5" />}
                    {idx === 2 && <ShieldCheck className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-white font-medium">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-gray-400 font-light mt-1 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
