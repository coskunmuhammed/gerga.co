"use client";

import { useEffect, useState } from "react";
import { Calendar, ArrowRight, MapPin } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface ExhibitionConfigData {
  active: boolean;
  fairName?: string | null;
  city?: string | null;
  dates?: string | null;
  hall?: string | null;
  standNumber?: string | null;
  ctaTextTr?: string | null;
  ctaTextEn?: string | null;
}

interface ExhibitionBannerProps {
  lang: string;
  initialConfig?: ExhibitionConfigData | null;
}

export default function ExhibitionBanner({ lang, initialConfig }: ExhibitionBannerProps) {
  const [config, setConfig] = useState<ExhibitionConfigData | null>(initialConfig || null);

  useEffect(() => {
    if (initialConfig === undefined) {
      fetch("/api/admin/exhibition-config")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.config) {
            setConfig(data.config);
          }
        })
        .catch(() => {});
    }
  }, [initialConfig]);

  if (!config || !config.active || (!config.fairName && !config.standNumber)) {
    return null; // Completely hidden if inactive or missing real info
  }

  const isEn = lang === "en";

  const defaultText = isEn
    ? `Meet GERGA at ${config.fairName || "the exhibition"} ${config.city ? `(${config.city})` : ""} — Hall ${config.hall || "4"} / Stand ${config.standNumber || "B21"}`
    : `GERGA ile ${config.fairName || "fuarda"} buluşun ${config.city ? `(${config.city})` : ""} — Hall ${config.hall || "4"} / Stand ${config.standNumber || "B21"}`;

  const bannerText = isEn
    ? config.ctaTextEn || defaultText
    : config.ctaTextTr || defaultText;

  const ctaLabel = isEn ? "Stand Info & Meeting" : "Stand Bilgisi ve Görüşme";

  const handleCtaClick = () => {
    trackEvent("exhibition_banner_click", { fairName: config.fairName, stand: config.standNumber });
    const target = document.getElementById("b2b-meeting");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside
      aria-label="Exhibition Information"
      className="bg-gradient-to-r from-[#121612] via-[#1c241c] to-[#121612] border-b border-[#d4af37]/30 text-white py-2.5 px-4 text-xs font-sans relative z-50 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-center sm:text-left flex-wrap justify-center sm:justify-start">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-[11px] font-mono uppercase tracking-wider font-medium shrink-0">
            <Calendar className="w-3.5 h-3.5" />
            <span>Exhibition</span>
          </span>
          <span className="text-gray-200 font-medium leading-tight">
            {bannerText}
          </span>
          {config.dates && (
            <span className="hidden md:inline-flex items-center gap-1 text-[#d4af37]/80 text-[11px] font-mono">
              <MapPin className="w-3 h-3" />
              {config.dates}
            </span>
          )}
        </div>

        <button
          onClick={handleCtaClick}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#d4af37] text-black font-semibold text-[11px] hover:bg-[#e5c158] transition-all cursor-pointer shrink-0 shadow"
        >
          <span>{ctaLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
