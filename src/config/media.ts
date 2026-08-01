export interface MediaItem {
  id: string;
  src: string;
  isPlaceholder: boolean;
  alt: {
    tr: string;
    en: string;
  };
  caption?: {
    tr: string;
    en: string;
  };
}

export const MEDIA_CONFIG: Record<string, MediaItem> = {
  hero: {
    id: "hero",
    src: "/images/hero.png",
    isPlaceholder: true,
    alt: {
      tr: "Ege incir bahçelerini temsil eden temsili görsel",
      en: "Representative visual of Aegean fig orchards",
    },
    caption: {
      tr: "Ege havzası incir bahçeleri görsel temsili",
      en: "Visual representation of Aegean basin fig orchards",
    },
  },
  productFig: {
    id: "productFig",
    src: "/images/product-fig.png",
    isPlaceholder: true,
    alt: {
      tr: "Ege kuru incir ürün grubunu temsil eden görsel",
      en: "Representative visual of Aegean dried fig product range",
    },
    caption: {
      tr: "Kuru incir seçkisi temsilî ürün görseli",
      en: "Representative product visual for dried fig selection",
    },
  },
  aegeanTerroir: {
    id: "aegeanTerroir",
    src: "/images/aegean-terroir.png",
    isPlaceholder: true,
    alt: {
      tr: "Ege coğrafyasını ve vadi yapısını temsil eden görsel",
      en: "Representative visual of Aegean geography and valley terrain",
    },
    caption: {
      tr: "Ege havzası vadi yapısı görsel temsili",
      en: "Visual representation of Aegean basin terrain",
    },
  },
  nursery: {
    id: "nursery",
    src: "/images/nursery.png",
    isPlaceholder: true,
    alt: {
      tr: "Fidan üretim ve seralama alanlarını temsil eden görsel",
      en: "Representative visual of sapling nursery and greenhouse facilities",
    },
    caption: {
      tr: "İncir fidanlığı ve üretim alanı görsel temsili",
      en: "Visual representation of fig nursery and production site",
    },
  },
  engineering: {
    id: "engineering",
    src: "/images/engineering.png",
    isPlaceholder: true,
    alt: {
      tr: "Modern bahçe kurulumu ve dikey düzeni temsil eden havadan görsel",
      en: "Aerial representative visual of modern orchard establishment and layout",
    },
    caption: {
      tr: "Profesyonel bahçe kurulumu havadan görsel temsili",
      en: "Aerial visual representation of professional orchard establishment",
    },
  },
};
