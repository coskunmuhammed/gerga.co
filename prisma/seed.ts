import { PrismaClient, B2BInterestArea, SupportedLocale, B2BRequestStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding GERGA B2B Database...");

  const seedRequests = [
    {
      referenceNumber: "GERGA-B2B-2026-104859",
      fullName: "Hans Müller",
      companyName: "EuroFruit Import GmbH",
      country: "Germany",
      email: "h.mueller@eurofruit.de",
      phone: "+491712345678",
      interestArea: B2BInterestArea.PRODUCT_SUPPLY,
      message: "We are interested in sourcing organic dried figs in bulk 5kg wooden crates for German retail chains.",
      preferredLanguage: SupportedLocale.EN,
      status: B2BRequestStatus.NEW,
      privacyAccepted: true,
      privacyVersion: "v1.0",
      privacyAcceptedAt: new Date(),
      source: "Exhibition QR Scan",
    },
    {
      referenceNumber: "GERGA-B2B-2026-284910",
      fullName: "Mehmet Demir",
      companyName: "Ege Tarım Yatırım A.Ş.",
      country: "Türkiye",
      email: "mdemir@egetarim.com.tr",
      phone: "+905321002030",
      interestArea: B2BInterestArea.ORCHARD_ESTABLISHMENT,
      message: "Aydın yöresinde 50 dönüm ticari incir bahçesi kurulumu ve altyapı danışmanlığı talep ediyoruz.",
      preferredLanguage: SupportedLocale.TR,
      status: B2BRequestStatus.REVIEWING,
      privacyAccepted: true,
      privacyVersion: "v1.0",
      privacyAcceptedAt: new Date(),
      source: "Direct Web Form",
      internalNote: "Saha incelemesi için ön teklif hazırlanıyor.",
    },
  ];

  for (const req of seedRequests) {
    await prisma.b2BMeetingRequest.upsert({
      where: { referenceNumber: req.referenceNumber },
      update: {},
      create: req,
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
