import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET() {
  try {
    const totalVisitsCount = await prisma.analyticsEvent.count({
      where: { eventName: { in: ["site_visit", "qr_source_visit"] } },
    });

    const formStartCount = await prisma.analyticsEvent.count({
      where: { eventName: { in: ["b2b_form_start", "sample_request_start"] } },
    });

    const totalSubmissions = await prisma.b2BMeetingRequest.count();

    const highPriorityCount = await prisma.b2BMeetingRequest.count({
      where: { priority: "High Priority" },
    });

    const contactedCount = await prisma.b2BMeetingRequest.count({
      where: { status: "CONTACTED" },
    });

    const qualifiedCount = await prisma.b2BMeetingRequest.count({
      where: { status: "QUALIFIED" },
    });

    // Breakdown by source
    const allRequests = await prisma.b2BMeetingRequest.findMany({
      select: { source: true },
    });

    const sourceCounts: Record<string, number> = {
      "Stand QR": 0,
      "Business Card": 0,
      "Brochure": 0,
      "LinkedIn": 0,
      "WhatsApp": 0,
      "Other": 0,
    };

    allRequests.forEach((req) => {
      const src = (req.source || "").toLowerCase();
      if (src.includes("stand-qr")) {
        sourceCounts["Stand QR"]++;
      } else if (src.includes("business-card")) {
        sourceCounts["Business Card"]++;
      } else if (src.includes("brochure")) {
        sourceCounts["Brochure"]++;
      } else if (src.includes("linkedin")) {
        sourceCounts["LinkedIn"]++;
      } else if (src.includes("whatsapp")) {
        sourceCounts["WhatsApp"]++;
      } else {
        sourceCounts["Other"]++;
      }
    });

    const formatMetric = (count: number) => (count > 0 ? count.toString() : "Henüz veri yok");

    const funnel = [
      { name: "Toplam Ziyaret", count: totalVisitsCount, display: formatMetric(totalVisitsCount) },
      { name: "B2B Form Başlatan", count: formStartCount, display: formatMetric(formStartCount) },
      { name: "B2B Başvurusu", count: totalSubmissions, display: formatMetric(totalSubmissions) },
      { name: "High Priority Lead", count: highPriorityCount, display: formatMetric(highPriorityCount) },
      { name: "Contacted", count: contactedCount, display: formatMetric(contactedCount) },
      { name: "Qualified", count: qualifiedCount, display: formatMetric(qualifiedCount) },
    ];

    const sourceBreakdown = Object.entries(sourceCounts).map(([name, count]) => ({
      name,
      count,
      display: formatMetric(count),
    }));

    return NextResponse.json({
      success: true,
      funnel,
      sourceBreakdown,
    });
  } catch (error) {
    console.error("Funnel stats API error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
