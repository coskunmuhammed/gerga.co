"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Image from "next/image";

interface ImageItem {
  src: string;
  title: string;
  category: string;
}

interface LightboxModalProps {
  images: ImageItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function LightboxModal({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxModalProps) {
  if (currentIndex === null) return null;

  const currentImage = images[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIdx = (currentIndex - 1 + images.length) % images.length;
    onNavigate(newIdx);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIdx = (currentIndex + 1) % images.length;
    onNavigate(newIdx);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-3 rounded-full bg-white/10 text-white hover:bg-[#d4af37] hover:text-black transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full bg-black/60 border border-white/20 text-white hover:bg-[#d4af37] hover:text-black transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full bg-black/60 border border-white/20 text-white hover:bg-[#d4af37] hover:text-black transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Lightbox Content */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center"
        >
          <div className="relative w-full h-[65vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src={currentImage.src}
              alt={currentImage.title}
              fill
              className="object-contain"
            />
          </div>

          <div className="mt-4 flex items-center justify-between w-full text-xs font-mono text-gray-300">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] uppercase">
                {currentImage.category}
              </span>
              <span className="text-sm font-serif text-white">{currentImage.title}</span>
            </div>
            <span className="text-gray-500">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
