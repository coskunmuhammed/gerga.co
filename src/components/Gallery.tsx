"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Maximize2, Info } from "lucide-react";
import { getDictionary } from "@/dictionaries";
import LightboxModal from "./LightboxModal";

interface GalleryProps {
  lang: string;
}

export default function Gallery({ lang }: GalleryProps) {
  const dict = getDictionary(lang);
  const [activeCategory, setActiveCategory] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryItems = [
    {
      src: "/images/hero.png",
      title: lang === "en" ? "Aegean Fig Grove Representative View" : "Ege İncir Bahçesi Temsilî Görseli",
      category: dict.gallery.categories[1] || "Bahçe",
      aspect: "aspect-[4/5]",
    },
    {
      src: "/images/product-fig.png",
      title: lang === "en" ? "Dried Figs Selection Representative Visual" : "Kuru İncir Seçkisi Temsilî Görseli",
      category: dict.gallery.categories[2] || "Hasat",
      aspect: "aspect-[3/4]",
    },
    {
      src: "/images/aegean-terroir.png",
      title: lang === "en" ? "Büyük Menderes Valley Terrain Visual" : "Büyük Menderes Havzası Temsilî Görseli",
      category: dict.gallery.categories[4] || "Manzara",
      aspect: "aspect-[16/10]",
    },
    {
      src: "/images/nursery.png",
      title: lang === "en" ? "Fig Sapling Production Site Representative Visual" : "Fidanlık ve Üretim Alanı Temsilî Görseli",
      category: dict.gallery.categories[3] || "Saha",
      aspect: "aspect-[4/3]",
    },
    {
      src: "/images/engineering.png",
      title: lang === "en" ? "Orchard Establishment Grid Layout Visual" : "Bahçe Kurulum Düzeni Temsilî Görseli",
      category: dict.gallery.categories[3] || "Saha",
      aspect: "aspect-[16/9]",
    },
  ];

  const filteredItems = activeCategory === 0
    ? galleryItems
    : galleryItems.filter(
        item => item.category === dict.gallery.categories[activeCategory]
      );

  return (
    <section id="gallery" className="py-28 bg-[#090b09] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#d4af37]" />
              <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#d4af37]">
                {dict.gallery.tag}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-light">
              {dict.gallery.title}
            </h2>
          </div>
          <div className="flex flex-col max-w-md">
            <p className="text-gray-300 font-light text-sm">
              {dict.gallery.subtitle}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs font-mono text-gray-400 bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
              <Info className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>{dict.gallery.disclaimer}</span>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {dict.gallery.categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(idx)}
              className={`px-5 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap min-h-[44px] ${
                activeCategory === idx
                  ? "bg-[#d4af37] text-black font-semibold shadow-lg"
                  : "bg-white/5 border border-white/10 text-gray-300 hover:border-[#d4af37]/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              onClick={() => setLightboxIndex(idx)}
              className={`relative ${item.aspect} rounded-3xl overflow-hidden border border-white/10 group cursor-pointer break-inside-avoid bg-black`}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover img-editorial filter brightness-90 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-widest mb-1">
                  {item.category}
                </span>
                <h4 className="font-serif text-base text-white font-medium">
                  {item.title}
                </h4>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-300 font-mono">
                  <Maximize2 className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{lang === "en" ? "View Full Screen" : "Tam Ekran İncele"}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Component */}
      <LightboxModal
        images={filteredItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </section>
  );
}
