export interface LeadScoringInput {
  companyName?: string | null;
  country?: string | null;
  phone?: string | null;
  message?: string | null;
  interestArea?: string | null;
  source?: string | null;
}

export interface LeadScoringResult {
  score: number;
  priority: "High Priority" | "Medium Priority" | "Standard";
  reasons: string[];
}

export function calculateLeadScore(input: LeadScoringInput): LeadScoringResult {
  let score = 0;
  const reasons: string[] = [];

  if (input.companyName && input.companyName.trim().length > 0) {
    score += 20;
    reasons.push("Company information provided");
  }

  if (input.country && input.country.trim().length > 0) {
    score += 10;
    reasons.push("Country information provided");
  }

  if (input.phone && input.phone.trim().length > 4) {
    score += 15;
    reasons.push("Phone number provided");
  }

  if (input.message) {
    const trimmedMsg = input.message.trim();
    if (trimmedMsg.length > 30) {
      score += 15;
      reasons.push("Detailed project message");
    }
    if (trimmedMsg.length > 100) {
      score += 10;
    }
  }

  const highIntentAreas = [
    "WHOLESALE",
    "DISTRIBUTION",
    "ORCHARD_ESTABLISHMENT",
    "SAPLINGS",
    "Wholesale",
    "Distribution",
    "Orchard Establishment",
    "Saplings",
    "Ürün ve Toptan Satış",
    "Distribütörlük ve İş Birliği",
    "Bahçe Kurulumu",
    "Fidan Teklifi"
  ];

  if (input.interestArea && highIntentAreas.some((area) => input.interestArea?.toLowerCase().includes(area.toLowerCase()))) {
    score += 15;
    reasons.push("High-intent commercial interest selected");
  }

  const exhibitionSources = [
    "stand-qr",
    "business-card",
    "brochure",
    "product-packaging",
    "fruit-logistica",
    "gulfood",
    "sial"
  ];

  if (input.source && exhibitionSources.some((src) => input.source?.toLowerCase().includes(src))) {
    score += 15;
    reasons.push("Exhibition source visitor");
  }

  let priority: "High Priority" | "Medium Priority" | "Standard" = "Standard";
  if (score >= 60) {
    priority = "High Priority";
  } else if (score >= 35) {
    priority = "Medium Priority";
  }

  return {
    score,
    priority,
    reasons,
  };
}
