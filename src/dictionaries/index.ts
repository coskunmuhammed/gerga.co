import { tr } from "./tr";
import { en } from "./en";

export type Locale = "tr" | "en" | string;

const dictionaries: Record<string, typeof tr> = {
  tr,
  en,
};

export const getDictionary = (locale: string = "tr") => {
  return dictionaries[locale] || dictionaries.tr;
};

export const locales = ["tr", "en"] as const;
export const defaultLocale = "tr";
