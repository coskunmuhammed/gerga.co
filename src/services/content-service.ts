import { ContentRepository } from "@/repositories/content-repository";
import { revalidatePath } from "next/cache";

export class ContentService {
  // Revalidate both TR and EN paths
  static triggerRevalidation() {
    try {
      revalidatePath("/[lang]", "layout");
      revalidatePath("/tr");
      revalidatePath("/en");
      revalidatePath("/tr/katalog");
      revalidatePath("/en/catalogue");
    } catch {
      // Graceful fallback during build / edge contexts
    }
  }

  // --- Section Config ---
  static async getSectionConfigs() {
    return ContentRepository.getAllSectionConfigs();
  }

  static async updateSectionConfig(sectionKey: string, data: {
    sortOrder?: number;
    active?: boolean;
    navVisible?: boolean;
    titleTr: string;
    titleEn: string;
  }) {
    const result = await ContentRepository.upsertSectionConfig(sectionKey, data);
    await ContentRepository.logAudit("UPDATE_SECTION", "SectionConfig", `Updated section ${sectionKey}`, sectionKey);
    this.triggerRevalidation();
    return result;
  }

  // --- Site Content ---
  static async getSiteContentSection<T = Record<string, unknown>>(sectionKey: string): Promise<T | null> {
    return ContentRepository.getSiteContent(sectionKey) as Promise<T | null>;
  }

  static async updateSiteContentSection(sectionKey: string, data: Record<string, unknown>) {
    const result = await ContentRepository.setSiteContent(sectionKey, data);
    await ContentRepository.logAudit("UPDATE_CONTENT", "SiteContent", `Updated site content key: ${sectionKey}`, sectionKey);
    this.triggerRevalidation();
    return result;
  }

  // --- Products ---
  static async getPublicProducts(lang: string) {
    const products = await ContentRepository.getPublicProducts();
    return products.map((p) => {
      const isEn = lang === "en";
      const name = isEn ? (p.nameEn || p.nameTr) : p.nameTr;
      const shortDesc = isEn ? (p.shortDescEn || p.shortDescTr) : p.shortDescTr;
      const fullDesc = isEn ? (p.fullDescEn || p.fullDescTr) : p.fullDescTr;
      const ctaLabel = isEn ? (p.ctaLabelEn || p.ctaLabelTr) : p.ctaLabelTr;
      const packaging = isEn ? (p.packagingEn || p.packagingTr) : p.packagingTr;
      const origin = isEn ? (p.originEn || p.originTr) : p.originTr;

      return {
        ...p,
        name,
        shortDesc,
        fullDesc,
        ctaLabel,
        packaging,
        origin,
      };
    });
  }

  static async getAllProducts() {
    return ContentRepository.getAllProducts();
  }

  static async saveProduct(id: string | undefined, data: Parameters<typeof ContentRepository.upsertProduct>[1]) {
    const result = await ContentRepository.upsertProduct(id, data);
    await ContentRepository.logAudit(id ? "UPDATE_PRODUCT" : "CREATE_PRODUCT", "Product", `Saved product ${data.nameTr}`, result.id);
    this.triggerRevalidation();
    return result;
  }

  static async deleteProduct(id: string) {
    const result = await ContentRepository.deleteProduct(id);
    await ContentRepository.logAudit("DELETE_PRODUCT", "Product", `Deleted product ID ${id}`, id);
    this.triggerRevalidation();
    return result;
  }

  // --- Saplings ---
  static async getPublicSaplings(lang: string) {
    const saplings = await ContentRepository.getPublicSaplings();
    return saplings.map((s) => {
      const isEn = lang === "en";
      return {
        ...s,
        name: isEn ? (s.nameEn || s.nameTr) : s.nameTr,
        desc: isEn ? (s.descEn || s.descTr) : s.descTr,
        seasonalAvailability: isEn ? (s.seasonalAvailabilityEn || s.seasonalAvailabilityTr) : s.seasonalAvailabilityTr,
        ctaLabel: isEn ? (s.ctaLabelEn || s.ctaLabelTr) : s.ctaLabelTr,
      };
    });
  }

  static async getAllSaplings() {
    return ContentRepository.getAllSaplings();
  }

  static async saveSapling(id: string | undefined, data: Parameters<typeof ContentRepository.upsertSapling>[1]) {
    const result = await ContentRepository.upsertSapling(id, data);
    await ContentRepository.logAudit(id ? "UPDATE_SAPLING" : "CREATE_SAPLING", "Sapling", `Saved sapling ${data.varietyCode}`, result.id);
    this.triggerRevalidation();
    return result;
  }

  // --- Services ---
  static async getPublicServices(lang: string) {
    const services = await ContentRepository.getPublicServices();
    return services.map((svc) => {
      const isEn = lang === "en";
      return {
        ...svc,
        title: isEn ? (svc.titleEn || svc.titleTr) : svc.titleTr,
        desc: isEn ? (svc.descEn || svc.descTr) : svc.descTr,
        ctaLabel: isEn ? (svc.ctaLabelEn || svc.ctaLabelTr) : svc.ctaLabelTr,
      };
    });
  }

  static async getAllServices() {
    return ContentRepository.getAllServices();
  }

  static async saveService(id: string | undefined, data: Parameters<typeof ContentRepository.upsertService>[1]) {
    const result = await ContentRepository.upsertService(id, data);
    await ContentRepository.logAudit(id ? "UPDATE_SERVICE" : "CREATE_SERVICE", "Service", `Saved service ${data.titleTr}`, result.id);
    this.triggerRevalidation();
    return result;
  }

  // --- Contact Config ---
  static async getContactConfig(lang: string) {
    const c = await ContentRepository.getContactConfig();
    const isEn = lang === "en";
    return {
      ...c,
      address: isEn ? (c.addressEn || c.addressTr) : c.addressTr,
      openingNotes: isEn ? (c.openingNotesEn || c.openingNotesTr) : c.openingNotesTr,
    };
  }

  static async updateContactConfig(data: Parameters<typeof ContentRepository.updateContactConfig>[0]) {
    const result = await ContentRepository.updateContactConfig(data);
    await ContentRepository.logAudit("UPDATE_CONTACT", "ContactConfig", "Updated central contact information");
    this.triggerRevalidation();
    return result;
  }

  // --- Social Links ---
  static async getPublicSocialLinks() {
    return ContentRepository.getActiveSocialLinks();
  }

  static async getAllSocialLinks() {
    return ContentRepository.getAllSocialLinks();
  }

  static async saveSocialLink(id: string | undefined, data: Parameters<typeof ContentRepository.upsertSocialLink>[1]) {
    const result = await ContentRepository.upsertSocialLink(id, data);
    await ContentRepository.logAudit(id ? "UPDATE_SOCIAL" : "CREATE_SOCIAL", "SocialLink", `Saved social link ${data.platform}`, result.id);
    this.triggerRevalidation();
    return result;
  }

  static async deleteSocialLink(id: string) {
    const result = await ContentRepository.deleteSocialLink(id);
    await ContentRepository.logAudit("DELETE_SOCIAL", "SocialLink", `Deleted social link ${id}`, id);
    this.triggerRevalidation();
    return result;
  }

  // --- SEO Config ---
  static async getSeoConfig(lang: string) {
    const seo = await ContentRepository.getSeoConfig();
    const isEn = lang === "en";
    return {
      ...seo,
      title: isEn ? (seo.siteWideTitleEn || seo.siteWideTitleTr) : seo.siteWideTitleTr,
      description: isEn ? (seo.siteWideDescEn || seo.siteWideDescTr) : seo.siteWideDescTr,
    };
  }

  static async updateSeoConfig(data: Parameters<typeof ContentRepository.updateSeoConfig>[0]) {
    const result = await ContentRepository.updateSeoConfig(data);
    await ContentRepository.logAudit("UPDATE_SEO", "SeoConfig", "Updated SEO metadata configuration");
    this.triggerRevalidation();
    return result;
  }

  // --- Global Settings ---
  static async getGlobalSettings() {
    return ContentRepository.getGlobalSettings();
  }

  static async updateGlobalSettings(data: Parameters<typeof ContentRepository.updateGlobalSettings>[0]) {
    const result = await ContentRepository.updateGlobalSettings(data);
    await ContentRepository.logAudit("UPDATE_SETTINGS", "GlobalSettings", "Updated global site settings");
    this.triggerRevalidation();
    return result;
  }

  // --- Media Assets ---
  static async getMediaAssets() {
    return ContentRepository.getAllMediaAssets();
  }

  static async saveMediaAsset(data: Parameters<typeof ContentRepository.createMediaAsset>[0]) {
    const result = await ContentRepository.createMediaAsset(data);
    await ContentRepository.logAudit("UPLOAD_MEDIA", "MediaAsset", `Uploaded media asset ${data.filename}`, result.id);
    return result;
  }

  static async deleteMediaAsset(id: string) {
    const result = await ContentRepository.deleteMediaAsset(id);
    await ContentRepository.logAudit("DELETE_MEDIA", "MediaAsset", `Deleted media asset ID ${id}`, id);
    return result;
  }

  // --- Audit Log ---
  static async getAuditLogs(limit = 100) {
    return ContentRepository.getAuditLogs(limit);
  }
}
