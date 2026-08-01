"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";
import { getDictionary } from "@/dictionaries";

interface StoryProps {
  lang: string;
}

export default function Story({ lang }: StoryProps) {
  const dict = getDictionary(lang);

  return (
    <section id="story" className="py-24 lg:py-36 bg-[#090b09] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header Tag */}
        <div className="flex items-center gap-3 mb-16">
          <div className="w-8 h-[1px] bg-[#d4af37]" />
          <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#d4af37]">
            {dict.story.tag}
          </span>
        </div>

        {/* Two-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Headline & Editorial Paragraphs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 flex flex-col justify-between h-full"
          >
            <div>
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-light leading-[1.15] mb-8">
                {dict.story.title}
              </h2>

              <div className="space-y-6 text-gray-300 font-light text-base sm:text-lg leading-relaxed">
                <p>{dict.story.p1}</p>
                <p>{dict.story.p2}</p>
              </div>
            </div>

            {/* Editorial Quote Block */}
            <div className="mt-12 p-8 rounded-2xl bg-white/[0.03] border border-[#d4af37]/20 relative">
              <Quote className="w-8 h-8 text-[#d4af37]/40 absolute -top-4 -left-2" />
              <blockquote className="font-serif italic text-xl sm:text-2xl text-white leading-snug">
                “{dict.story.quote}”
              </blockquote>
              <cite className="block mt-4 text-xs tracking-[0.2em] font-mono uppercase text-[#d4af37] not-italic">
                — {dict.story.quoteAuthor}
              </cite>
            </div>
          </motion.div>

          {/* Right Column: Oversized Magazine Photography & Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 flex flex-col gap-10"
          >
            {/* Magazine Style Image Frame */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl group border border-white/10">
              <Image
                src="/images/product-fig.png"
                alt="GERGA Fig Harvest Craftsmanship"
                fill
                className="object-cover img-editorial filter brightness-90 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono tracking-widest text-gray-300 uppercase">
                  Aydın Mountain Harvest
                </span>
                <span className="text-xs font-mono text-[#d4af37]">
                  GERGA Reserve
                </span>
              </div>
            </div>

            {/* Highlights List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/10">
              {dict.story.highlights.map((item) => (
                <div key={item.number} className="flex flex-col gap-2">
                  <span className="font-mono text-xs text-[#d4af37] tracking-widest">
                    [{item.number}]
                  </span>
                  <h4 className="font-serif text-lg text-white font-medium">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
