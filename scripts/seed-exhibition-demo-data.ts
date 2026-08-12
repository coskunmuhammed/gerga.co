import { prisma } from "../src/lib/database/prisma";
import { calculateLeadScore } from "../src/lib/lead-scoring";
import { B2BInterestArea, SupportedLocale, B2BRequestStatus } from "@prisma/client";

async function seed() {
  console.log("Seeding Exhibition Demo Data...");

  // 1. Upsert Exhibition Config
  await prisma.exhibitionConfig.upsert({
    where: { id: "default" },
    update: {
      active: true,
      fairName: "Fruit Logistica 2026",
      city: "Berlin, Germany",
      dates: "5-7 Şubat 2026",
      hall: "4",
      standNumber: "B21",
      ctaTextTr: "GERGA ile fuarda buluşun — Hall 4 / Stand B21",
      ctaTextEn: "Meet GERGA at the exhibition — Hall 4 / Stand B21",
    },
    create: {
      id: "default",
      active: true,
      fairName: "Fruit Logistica 2026",
      city: "Berlin, Germany",
      dates: "5-7 Şubat 2026",
      hall: "4",
      standNumber: "B21",
      ctaTextTr: "GERGA ile fuarda buluşun — Hall 4 / Stand B21",
      ctaTextEn: "Meet GERGA at the exhibition — Hall 4 / Stand B21",
    },
  });

  // 2. Seed QR Campaigns
  const campaigns = [
    { name: "Berlin Stand QR", sourceCode: "stand-qr-berlin", targetLanguage: "en", targetRoute: "/" },
    { name: "English Brochure", sourceCode: "brochure-en", targetLanguage: "en", targetRoute: "/" },
    { name: "Business Card", sourceCode: "business-card", targetLanguage: "tr", targetRoute: "/" },
  ];

  for (const c of campaigns) {
    await prisma.qRCampaign.upsert({
      where: { sourceCode: c.sourceCode },
      update: c,
      create: c,
    });
  }

  // 3. Seed Sample Leads with scoring
  const sampleLeads = [
    {
      referenceNumber: "GERGA-B2B-2026-981240",
      fullName: "Markus Weber",
      companyName: "Organic Bio-Import GmbH",
      country: "Germany",
      email: "m.weber@bioimport.de",
      phone: "+49 30 987654",
      interestArea: "WHOLESALE",
      message: "We are looking for regular monthly shipments of 10 tons dried Sarılop figs in retail cartons.",
      preferredLanguage: "EN",
      source: "stand-qr",
      status: "QUALIFIED",
    },
    {
      referenceNumber: "GERGA-B2B-2026-104928",
      fullName: "Elena Rostova",
      companyName: "Eastern Gourmet Trading",
      country: "Poland",
      email: "elena@gourmettrading.pl",
      phone: "+48 22 123456",
      interestArea: "DISTRIBUTION",
      message: "Requesting distributor pricing for organic mountain figs and fig paste.",
      preferredLanguage: "EN",
      source: "business-card",
      status: "CONTACTED",
    },
    {
      referenceNumber: "GERGA-B2B-2026-304912",
      fullName: "Ahmet Yılmaz",
      companyName: "Ege Agro Tarım Ltd.",
      country: "Türkiye",
      email: "ahmet@egeagro.com.tr",
      phone: "+90 532 111 2233",
      interestArea: "ORCHARD_ESTABLISHMENT",
      message: "Aydın Germencik bölgesinde 50 dönüm kapama incir bahçesi kurulumu için teklif almak istiyoruz.",
      preferredLanguage: "TR",
      source: "brochure",
      status: "NEW",
    },
  ];

  for (const lead of sampleLeads) {
    const scoreRes = calculateLeadScore({
      companyName: lead.companyName,
      country: lead.country,
      phone: lead.phone,
      message: lead.message,
      interestArea: lead.interestArea,
      source: lead.source,
    });

    await prisma.b2BMeetingRequest.upsert({
      where: { referenceNumber: lead.referenceNumber },
      update: {
        priority: scoreRes.priority,
        score: scoreRes.score,
        scoreReasons: JSON.stringify(scoreRes.reasons),
        source: lead.source,
      },
      create: {
        referenceNumber: lead.referenceNumber,
        fullName: lead.fullName,
        companyName: lead.companyName,
        country: lead.country,
        email: lead.email,
        phone: lead.phone,
        interestArea: lead.interestArea as B2BInterestArea,
        message: lead.message,
        preferredLanguage: lead.preferredLanguage as SupportedLocale,
        status: lead.status as B2BRequestStatus,
        priority: scoreRes.priority,
        score: scoreRes.score,
        scoreReasons: JSON.stringify(scoreRes.reasons),
        privacyAccepted: true,
        privacyVersion: "1.0",
        privacyAcceptedAt: new Date(),
        source: lead.source,
      },
    });
  }

  // 4. Seed Analytics Events
  const events = [
    { eventName: "site_visit", source: "stand-qr", locale: "en" },
    { eventName: "site_visit", source: "business-card", locale: "tr" },
    { eventName: "b2b_form_start", source: "stand-qr", locale: "en" },
    { eventName: "b2b_form_submit", source: "stand-qr", locale: "en" },
    { eventName: "catalogue_view", source: "brochure", locale: "tr" },
  ];

  for (const ev of events) {
    await prisma.analyticsEvent.create({
      data: ev,
    });
  }

  console.log("Exhibition demo data seeded successfully.");
}

seed().catch(console.error);
