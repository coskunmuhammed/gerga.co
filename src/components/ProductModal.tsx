"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, ShieldAlert, Award, Send } from "lucide-react";
import Image from "next/image";
import { getDictionary } from "@/dictionaries";

interface Product {
  id: string;
  name: string;
  category: string;
  desc: string;
  specs: string[];
  image: string;
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  lang: string;
}

export default function ProductModal({ product, onClose, lang }: ProductModalProps) {
  const dict = getDictionary(lang);

  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#111511] border border-[#d4af37]/30 rounded-3xl p-6 sm:p-10 shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Image View */}
            <div className="md:col-span-5 relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#d4af37]/40 text-[10px] font-mono text-[#d4af37] uppercase">
                {product.category}
              </div>
            </div>

            {/* Right Details View */}
            <div className="md:col-span-7 flex flex-col justify-between h-full">
              <div>
                <span className="text-xs font-mono tracking-widest text-[#d4af37] uppercase">
                  {dict.productModal.origin}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium mt-1 mb-4">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-300 font-light leading-relaxed mb-6">
                  {product.desc}
                </p>

                {/* Specs List */}
                <div className="border-t border-white/10 pt-6 mb-6">
                  <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#d4af37]" />
                    <span>{dict.productModal.technicalSpecs}</span>
                  </h4>
                  <ul className="space-y-3">
                    {product.specs.map((spec, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-3 text-xs sm:text-sm text-gray-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action for Trade Delegates */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4">
                <a
                  href={`#contact`}
                  onClick={onClose}
                  className="w-full text-center py-3.5 rounded-full bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-[0.18em] hover:bg-[#e5c158] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{dict.productModal.requestSample}</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
