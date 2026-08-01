import { z } from "zod";

export const b2bInterestAreaEnum = z.enum([
  "PRODUCT_SUPPLY",
  "WHOLESALE",
  "SAPLINGS",
  "ORCHARD_ESTABLISHMENT",
  "CONSULTANCY",
  "DISTRIBUTION",
  "OTHER",
]);

export const supportedLocaleEnum = z.enum(["TR", "EN"]);

export const createB2BMeetingSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Ad Soyad en az 2 karakter olmalıdır. / Full Name must be at least 2 characters.")
    .max(100, "Ad Soyad en fazla 100 karakter olabilir. / Full Name max 100 characters."),
  companyName: z
    .string()
    .trim()
    .max(100, "Şirket adı en fazla 100 karakter olabilir. / Company name max 100 characters.")
    .optional()
    .or(z.literal("")),
  country: z
    .string()
    .trim()
    .min(2, "Ülke en az 2 karakter olmalıdır. / Country must be at least 2 characters.")
    .max(100, "Ülke en fazla 100 karakter olabilir. / Country max 100 characters."),
  email: z
    .string()
    .trim()
    .email("Geçerli bir e-posta adresi giriniz. / Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .max(30, "Telefon numarası en fazla 30 karakter olabilir.")
    .optional()
    .or(z.literal("")),
  areaOfInterest: b2bInterestAreaEnum,
  message: z
    .string()
    .trim()
    .min(5, "Mesaj en az 5 karakter olmalıdır. / Message must be at least 5 characters.")
    .max(2000, "Mesaj en fazla 2000 karakter olabilir. / Message max 2000 characters."),
  preferredLanguage: supportedLocaleEnum.default("TR"),
  privacyConsent: z
    .boolean()
    .refine((val) => val === true, {
      message: "Gizlilik ve KVKK aydınlatmasını onaylamalısınız. / Privacy notice consent is required.",
    }),
  marketingConsent: z.boolean().default(false).optional(),
  honeypot: z
    .string()
    .max(0, "Spam algılandı. / Spam detected.")
    .optional()
    .or(z.literal("")),
  formStartTime: z.number().optional(),
});

export type CreateB2BMeetingSchemaType = z.infer<typeof createB2BMeetingSchema>;
