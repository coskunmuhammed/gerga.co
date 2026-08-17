"use client";

import { motion } from "framer-motion";
import { BookOpen, Leaf, Droplets, GraduationCap } from "lucide-react";
import { getDictionary } from "@/dictionaries";

interface AcademyProps {
  lang: string;
}

export default function Academy({ lang }: AcademyProps) {
  const dict = getDictionary(lang);

  const icons = [Leaf, Droplets, GraduationCap];

  return (
    <section id="academy" className="py-24 bg-[#090b09] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#d4af37]" />
              <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#d4af37]">
                {dict.academy.tag}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-light">
              {dict.academy.title}
            </h2>
          </div>
          <p className="text-[#d4af37] font-serif text-lg sm:text-xl max-w-md font-light">
            {dict.academy.subtitle}
          </p>
        </div>

        {/* 3 Research Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dict.academy.cards.map((card, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.2 }}
                className="glass-card p-8 rounded-3xl flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center mb-6 group-hover:bg-[#d4af37] transition-all duration-300">
                    <Icon className="w-6 h-6 text-[#d4af37] group-hover:text-black transition-colors" />
                  </div>

                  <h3 className="font-serif text-2xl text-white font-medium mb-4">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-300 font-light leading-relaxed">
                    {card.text}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400 uppercase tracking-wider group-hover:text-[#d4af37]">
                    {(dict.academy as Record<string, unknown>).researchNote as string || (lang === "en" ? "Research Note" : "Araştırma Notu")} #{idx + 1}
                  </span>
                  <BookOpen className="w-4 h-4 text-gray-500 group-hover:text-[#d4af37] transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
