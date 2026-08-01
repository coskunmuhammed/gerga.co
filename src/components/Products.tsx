"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, CheckCircle, Sparkles } from "lucide-react";
import { getDictionary } from "@/dictionaries";
import ProductModal from "./ProductModal";

interface ProductsProps {
  lang: string;
}

export default function Products({ lang }: ProductsProps) {
  const dict = getDictionary(lang);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  return (
    <section id="products" className="py-32 bg-[#090b09] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#d4af37]" />
              <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#d4af37]">
                {dict.products.tag}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-light">
              {dict.products.title}
            </h2>
          </div>
          <p className="text-gray-400 max-w-lg text-sm sm:text-base leading-relaxed font-light">
            {dict.products.subtitle}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {dict.products.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              onClick={() => setSelectedProduct(item)}
              className="glass-card rounded-3xl overflow-hidden cursor-pointer group flex flex-col justify-between border border-white/10"
            >
              {/* Product Image Box */}
              <div className="relative aspect-[16/10] w-full bg-black overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover img-editorial filter brightness-90 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111511] via-transparent to-transparent opacity-90" />
                
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#d4af37]/30 text-[10px] font-mono text-[#d4af37] uppercase">
                  {item.category}
                </div>
              </div>

              {/* Product Details */}
              <div className="p-8 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif text-2xl text-white font-medium group-hover:text-[#d4af37] transition-colors mb-3">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-light leading-relaxed mb-6 line-clamp-3">
                    {item.desc}
                  </p>
                </div>

                {/* Inspect Action */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-[#d4af37] uppercase tracking-wider group-hover:underline">
                    {dict.products.viewDetails}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#d4af37] group-hover:border-[#d4af37] transition-all">
                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        lang={lang}
      />
    </section>
  );
}
