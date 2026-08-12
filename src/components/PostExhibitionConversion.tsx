"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, PackageCheck, Globe2, Sprout, Compass, Users, ArrowRight } from "lucide-react";
import { getDictionary } from "@/dictionaries";
import SampleRequestModal from "./SampleRequestModal";
import { trackEvent } from "@/lib/analytics";

interface PostExhibitionConversionProps {
  lang: string;
}

export default function PostExhibitionConversion({ lang }: PostExhibitionConversionProps) {
  const dict = getDictionary(lang);
  const peDict = dict.postExhibition;
  const isEn = lang === "en";

  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

  const tiles = [
    {
      id: "wholesale",
      title: peDict.options.wholesale,
      desc: peDict.options.wholesaleDesc,
      icon: ShoppingBag,
      targetInterest: "Wholesale",
    },
    {
      id: "sample",
      title: peDict.options.sample,
      desc: peDict.options.sampleDesc,
      icon: PackageCheck,
      isModal: true,
    },
    {
      id: "distribution",
      title: peDict.options.distribution,
      desc: peDict.options.distributionDesc,
      icon: Globe2,
      targetInterest: "Distribution",
    },
    {
      id: "saplings",
      title: peDict.options.saplings,
      desc: peDict.options.saplingsDesc,
      icon: Sprout,
      targetInterest: "Saplings",
    },
    {
      id: "orchard",
      title: peDict.options.orchard,
      desc: peDict.options.orchardDesc,
      icon: Compass,
      targetInterest: "Orchard Establishment",
    },
    {
      id: "consultancy",
      title: peDict.options.consultancy,
      desc: peDict.options.consultancyDesc,
      icon: Users,
      targetInterest: "Consultancy",
    },
  ];

  const handleTileClick = (tile: typeof tiles[0]) => {
    trackEvent("post_exhibition_tile_click", { tileId: tile.id });

    if (tile.isModal) {
      setIsSampleModalOpen(true);
      return;
    }

    // Connect to existing B2B demand system and pre-fill interestArea
    const formElement = document.getElementById("b2b-meeting");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });

      const selectElement = formElement.querySelector<HTMLSelectElement>('select[name="areaOfInterest"]');
      if (selectElement && tile.targetInterest) {
        selectElement.value = tile.targetInterest;

        // Trigger change event for React state updates
        const event = new Event("change", { bubbles: true });
        selectElement.dispatchEvent(event);
      }
    }
  };

  return (
    <section id="post-exhibition" className="py-20 bg-[#070907] relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[1px] bg-[#d4af37]" />
          <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#d4af37]">
            {peDict.tag}
          </span>
        </div>

        <div className="mb-12">
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-light">
            {peDict.title}
          </h2>
          <p className="mt-3 text-sm sm:text-lg text-gray-300 font-light max-w-2xl">
            {peDict.subtitle}
          </p>
        </div>

        {/* 6 Tile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiles.map((tile, index) => {
            const Icon = tile.icon;
            return (
              <motion.div
                key={tile.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                onClick={() => handleTileClick(tile)}
                className="group glass-card p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-[#d4af37]/50 bg-gradient-to-b from-white/[0.03] to-transparent hover:from-[#d4af37]/[0.08] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-[#d4af37]/60 uppercase tracking-widest">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl text-white font-medium mb-2 group-hover:text-[#d4af37] transition-colors">
                    {tile.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed mb-6">
                    {tile.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-300 group-hover:text-[#d4af37] transition-colors">
                  <span>{tile.isModal ? (isEn ? "Request Form" : "Talep Formu") : (isEn ? "Select & Continue" : "Seç ve Devam Et")}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Sample Request Modal */}
      <SampleRequestModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        lang={lang}
      />
    </section>
  );
}
