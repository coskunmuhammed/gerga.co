import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { sanitizeAnalyticsProps } from "@/lib/analytics";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventName, source, locale, properties } = body;

    if (!eventName) {
      return NextResponse.json({ success: false, message: "eventName is required" }, { status: 400 });
    }

    const cleanProperties = sanitizeAnalyticsProps(properties);

    await prisma.analyticsEvent.create({
      data: {
        eventName: String(eventName),
        source: source ? String(source) : null,
        locale: locale ? String(locale) : null,
        properties: cleanProperties ? JSON.stringify(cleanProperties) : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics track error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
