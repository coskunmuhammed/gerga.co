import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required in production environment."),
  ADMIN_PASSWORD: z.string().min(1, "ADMIN_PASSWORD is required in production environment."),
  ADMIN_SESSION_SECRET: z.string().min(1, "ADMIN_SESSION_SECRET is required in production environment."),
  GERGA_SITE_URL: z.string().default("https://gerga.co"),
  GERGA_COMPANY_NAME: z.string().default("GERGA Tarımsal İnovasyon"),
  GERGA_PUBLIC_EMAIL: z.string().default("info@gerga.co"),
  GERGA_PUBLIC_PHONE: z.string().default("+908508854374"),
  GERGA_WHATSAPP_NUMBER: z.string().default("908508854374"),
  GERGA_ADDRESS: z.string().default("Büyük Menderes Havzası, Aydın / TÜRKİYE"),
});

export function validateEnv() {
  if (process.env.NODE_ENV === "production") {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
      console.error("CRITICAL PRODUCTION CONFIGURATION ERROR:", result.error.format());
      throw new Error("CRITICAL: Missing or invalid environment variables for production deployment.");
    }
  }
}
