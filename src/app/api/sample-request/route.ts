import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { calculateLeadScore } from "@/lib/lead-scoring";
import { B2BInterestArea, SupportedLocale } from "@prisma/client";

function generateReferenceNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
  return `SMP-${dateStr}-${randomStr}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      company,
      country,
      email,
      phone,
      interestedProduct,
      estimatedVolume,
      message,
      privacyConsent,
      source,
      preferredLanguage,
    } = body;

    if (!fullName || !country || !email || !message || !privacyConsent) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    const leadScoreResult = calculateLeadScore({
      companyName: company,
      country,
      phone,
      message,
      interestArea: "WHOLESALE",
      source,
    });

    const referenceNumber = generateReferenceNumber();
    const locale: SupportedLocale = preferredLanguage === "EN" ? "EN" : "TR";

    const created = await prisma.b2BMeetingRequest.create({
      data: {
        referenceNumber,
        fullName,
        companyName: company || null,
        country,
        email,
        phone: phone || null,
        interestArea: B2BInterestArea.WHOLESALE,
        message: message || null,
        preferredLanguage: locale,
        requestType: "SAMPLE_REQUEST",
        priority: leadScoreResult.priority,
        score: leadScoreResult.score,
        scoreReasons: JSON.stringify(leadScoreResult.reasons),
        interestedProduct: interestedProduct || null,
        estimatedVolume: estimatedVolume || null,
        privacyAccepted: Boolean(privacyConsent),
        privacyVersion: "1.0",
        privacyAcceptedAt: new Date(),
        source: source || null,
      },
    });

    const successMsg =
      locale === "EN"
        ? "Your request will be reviewed by the GERGA team."
        : "Talebiniz GERGA ekibi tarafından değerlendirilecektir.";

    return NextResponse.json({
      success: true,
      referenceNumber: created.referenceNumber,
      message: successMsg,
    });
  } catch (error) {
    console.error("Sample request API error:", error);
    return NextResponse.json(
      { success: false, message: "Sample request submission failed" },
      { status: 500 }
    );
  }
}
