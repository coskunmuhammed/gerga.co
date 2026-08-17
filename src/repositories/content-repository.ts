import { prisma } from "@/lib/database/prisma";
import { ContentStatus, PortfolioType } from "@prisma/client";

export class ContentRepository {
  // --- Section Configs ---
  static async getAllSectionConfigs() {
    return prisma.sectionConfig.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }

  static async upsertSectionConfig(sectionKey: string, data: {
    sortOrder?: number;
    active?: boolean;
    navVisible?: boolean;
    titleTr: string;
    titleEn: string;
  }) {
    return prisma.sectionConfig.upsert({
      where: { sectionKey },
      update: data,
      create: {
        sectionKey,
        sortOrder: data.sortOrder ?? 0,
        active: data.active ?? true,
        navVisible: data.navVisible ?? true,
        titleTr: data.titleTr,
        titleEn: data.titleEn,
      },
    });
  }

  // --- Site Content (Hero, Intro, Aegean, etc.) ---
  static async getSiteContent(key: string) {
    const record = await prisma.siteContent.findUnique({
      where: { key },
    });
    if (!record) return null;
    try {
      return JSON.parse(record.dataJson);
    } catch {
      return null;
    }
  }

  static async setSiteContent(key: string, dataObj: Record<string, unknown>) {
    const dataJson = JSON.stringify(dataObj);
    return prisma.siteContent.upsert({
      where: { key },
      update: { dataJson },
      create: { key, dataJson },
    });
  }

  // --- Products ---
  static async getPublicProducts() {
    return prisma.product.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
      },
      orderBy: [
        { portfolioType: "asc" },
        { sortOrder: "asc" },
      ],
    });
  }

  static async getAllProducts() {
    return prisma.product.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }

  static async getProductById(id: string) {
    return prisma.product.findUnique({ where: { id } });
  }

  static async upsertProduct(id: string | undefined, data: {
    status?: ContentStatus;
    portfolioType?: PortfolioType;
    sortOrder?: number;
    nameTr: string;
    nameEn: string;
    shortDescTr: string;
    shortDescEn: string;
    fullDescTr?: string;
    fullDescEn?: string;
    coverImage?: string;
    galleryJson?: string;
    category?: string;
    specsJson?: string;
    packagingTr?: string;
    packagingEn?: string;
    originTr?: string;
    originEn?: string;
    verificationStatus?: string;
    documentsJson?: string;
    ctaLabelTr?: string;
    ctaLabelEn?: string;
    ctaDestination?: string;
    sampleRequestEnabled?: boolean;
    seoTitleTr?: string;
    seoTitleEn?: string;
    seoDescTr?: string;
    seoDescEn?: string;
  }) {
    if (id) {
      return prisma.product.update({
        where: { id },
        data,
      });
    }
    return prisma.product.create({
      data: {
        ...data,
        nameTr: data.nameTr,
        nameEn: data.nameEn,
        shortDescTr: data.shortDescTr,
        shortDescEn: data.shortDescEn,
      },
    });
  }

  static async deleteProduct(id: string) {
    return prisma.product.delete({ where: { id } });
  }

  // --- Saplings ---
  static async getPublicSaplings() {
    return prisma.sapling.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        publicVisibility: true,
      },
      orderBy: { sortOrder: "asc" },
    });
  }

  static async getAllSaplings() {
    return prisma.sapling.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }

  static async upsertSapling(id: string | undefined, data: {
    varietyCode: string;
    nameTr: string;
    nameEn: string;
    descTr: string;
    descEn: string;
    status?: ContentStatus;
    imagesJson?: string;
    specsJson?: string;
    verificationStatus?: string;
    documentsJson?: string;
    seasonalAvailabilityTr?: string;
    seasonalAvailabilityEn?: string;
    sampleQuoteEnabled?: boolean;
    ctaLabelTr?: string;
    ctaLabelEn?: string;
    sortOrder?: number;
    publicVisibility?: boolean;
  }) {
    if (id) {
      return prisma.sapling.update({
        where: { id },
        data,
      });
    }
    return prisma.sapling.create({ data });
  }

  // --- Services ---
  static async getPublicServices() {
    return prisma.service.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { sortOrder: "asc" },
    });
  }

  static async getAllServices() {
    return prisma.service.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }

  static async upsertService(id: string | undefined, data: {
    serviceType: string;
    titleTr: string;
    titleEn: string;
    descTr: string;
    descEn: string;
    status?: ContentStatus;
    stepsJson?: string;
    heroImage?: string;
    ctaLabelTr?: string;
    ctaLabelEn?: string;
    ctaDestination?: string;
    sortOrder?: number;
  }) {
    if (id) {
      return prisma.service.update({ where: { id }, data });
    }
    return prisma.service.create({ data });
  }

  // --- Contact Config ---
  static async getContactConfig() {
    return prisma.contactConfig.upsert({
      where: { id: "default" },
      update: {},
      create: { id: "default" },
    });
  }

  static async updateContactConfig(data: Record<string, string>) {
    return prisma.contactConfig.upsert({
      where: { id: "default" },
      update: data,
      create: {
        id: "default",
        companyLegalName: (data.companyLegalName as string) || "GERGA Tarım San. ve Tic. A.Ş.",
        displayBrandName: (data.displayBrandName as string) || "GERGA Aegean Agriculture",
        contactPerson: data.contactPerson as string | undefined,
        publicEmail: (data.publicEmail as string) || "info@gerga.co",
        b2bEmail: (data.b2bEmail as string) || "b2b@gerga.co",
        phone: (data.phone as string) || "+90 850 885 43 74",
        whatsapp: (data.whatsapp as string) || "+90 850 885 43 74",
        addressTr: (data.addressTr as string) || "Büyük Menderes Havzası, Aydın, Türkiye",
        addressEn: (data.addressEn as string) || "Büyük Menderes Basin, Aydın, Turkey",
        city: (data.city as string) || "Aydın",
        country: (data.country as string) || "Türkiye",
        websiteUrl: (data.websiteUrl as string) || "https://gerga.co",
        googleMapsUrl: data.googleMapsUrl as string | undefined,
        openingNotesTr: data.openingNotesTr as string | undefined,
        openingNotesEn: data.openingNotesEn as string | undefined,
      },
    });
  }

  // --- Social Links ---
  static async getActiveSocialLinks() {
    return prisma.socialLink.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
  }

  static async getAllSocialLinks() {
    return prisma.socialLink.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }

  static async upsertSocialLink(id: string | undefined, data: {
    platform: string;
    url: string;
    active?: boolean;
    sortOrder?: number;
  }) {
    if (id) {
      return prisma.socialLink.update({ where: { id }, data });
    }
    return prisma.socialLink.create({ data });
  }

  static async deleteSocialLink(id: string) {
    return prisma.socialLink.delete({ where: { id } });
  }

  // --- SEO Config ---
  static async getSeoConfig() {
    return prisma.seoConfig.upsert({
      where: { id: "default" },
      update: {},
      create: { id: "default" },
    });
  }

  static async updateSeoConfig(data: Record<string, string | boolean>) {
    return prisma.seoConfig.upsert({
      where: { id: "default" },
      update: data,
      create: {
        id: "default",
        siteWideTitleTr: (data.siteWideTitleTr as string) || "GERGA | Ege İnciri & B2B İhracat",
        siteWideTitleEn: (data.siteWideTitleEn as string) || "GERGA | Aegean Dried Figs & B2B Export",
        siteWideDescTr: (data.siteWideDescTr as string) || "Ege'nin köklü mirasıyla premium kuru incir üretimi.",
        siteWideDescEn: (data.siteWideDescEn as string) || "Premium Aegean dried fig production.",
        ogImage: data.ogImage as string | undefined,
        siteName: (data.siteName as string) || "GERGA Aegean Agriculture",
        indexingEnabled: typeof data.indexingEnabled === "boolean" ? data.indexingEnabled : true,
      },
    });
  }

  // --- Global Settings ---
  static async getGlobalSettings() {
    return prisma.globalSettings.upsert({
      where: { id: "default" },
      update: {},
      create: { id: "default" },
    });
  }

  static async updateGlobalSettings(data: Record<string, string | boolean>) {
    return prisma.globalSettings.upsert({
      where: { id: "default" },
      update: data,
      create: {
        id: "default",
        liveMode: typeof data.liveMode === "boolean" ? data.liveMode : true,
        maintenanceMode: typeof data.maintenanceMode === "boolean" ? data.maintenanceMode : false,
        defaultLanguage: (data.defaultLanguage as string) || "tr",
        whatsappWidgetEnabled: typeof data.whatsappWidgetEnabled === "boolean" ? data.whatsappWidgetEnabled : true,
        catalogueEnabled: typeof data.catalogueEnabled === "boolean" ? data.catalogueEnabled : true,
        galleryEnabled: typeof data.galleryEnabled === "boolean" ? data.galleryEnabled : true,
      },
    });
  }

  // --- Media Library ---
  static async getAllMediaAssets() {
    return prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async createMediaAsset(data: {
    filename: string;
    url: string;
    altTextTr?: string;
    altTextEn?: string;
    category?: string;
    isPlaceholder?: boolean;
  }) {
    return prisma.mediaAsset.create({ data });
  }

  static async deleteMediaAsset(id: string) {
    return prisma.mediaAsset.delete({ where: { id } });
  }

  // --- Legal Documents ---
  static async getActiveLegalDocument(documentType: string, language: string) {
    return prisma.legalDocument.findFirst({
      where: {
        documentType,
        language: language.toUpperCase(),
        active: true,
      },
      orderBy: { publishedAt: "desc" },
    });
  }

  static async getAllLegalDocuments() {
    return prisma.legalDocument.findMany({
      orderBy: { publishedAt: "desc" },
    });
  }

  static async createLegalDocument(data: {
    documentType: string;
    language: string;
    version: string;
    content: string;
    active?: boolean;
  }) {
    return prisma.legalDocument.create({ data });
  }

  // --- Audit Log ---
  static async logAudit(action: string, entity: string, summary: string, entityId?: string, adminUser = "admin") {
    return prisma.auditLog.create({
      data: {
        action,
        entity,
        summary,
        entityId,
        adminUser,
      },
    });
  }

  static async getAuditLogs(limit = 100) {
    return prisma.auditLog.findMany({
      take: limit,
      orderBy: { timestamp: "desc" },
    });
  }
}
