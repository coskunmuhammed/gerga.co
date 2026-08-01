"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Clock, Award, CheckCircle2, TrendingUp } from "lucide-react";
import { getDictionary } from "@/dictionaries";

interface WhyUsProps {
  lang: string;
}

export default function WhyUs({ lang }: WhyUsProps) {
  const dict = getDictionary(lang);

  return (
    <section id="why-us" className="py-32 bg-[#090b09] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#d4af37]" />
              <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#d4af37]">
                {dict.whyUs.tag}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-light">
              {dict.whyUs.title}
            </h2>
          </div>
          <p className="text-gray-400 font-light text-sm sm:text-base max-w-md">
            {dict.whyUs.subtitle}
          </p>
        </div>

        {/* Timeline & Core Values Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Historical Legacy Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 flex flex-col gap-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-[#d4af37]" />
              <h3 className="font-serif text-2xl text-white font-medium">
                The GERGA Milestones
              </h3>
            </div>

            <div className="relative border-l border-white/10 pl-8 space-y-10 ml-2">
              {dict.whyUs.timeline.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Marker Dot */}
                  <div className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-[#090b09] border-2 border-[#d4af37] group-hover:scale-125 transition-transform" />
                  
                  <span className="font-mono text-xs text-[#d4af37] font-semibold tracking-wider">
                    {item.year}
                  </span>
                  <h4 className="font-serif text-xl text-white font-medium mt-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-400 font-light mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Key Trust Pillars */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 flex flex-col gap-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
              <h3 className="font-serif text-2xl text-white font-medium">
                Core Quality Guarantees
              </h3>
            </div>

            {dict.whyUs.values.map((val, idx) => (
              <div
                key={idx}
                className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-white font-medium">
                      {val.title}
                    </h4>
                    <p className="text-xs text-gray-300 font-light mt-2 leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
