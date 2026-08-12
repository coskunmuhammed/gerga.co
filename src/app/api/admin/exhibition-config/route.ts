import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET() {
  try {
    let config = await prisma.exhibitionConfig.findUnique({
      where: { id: "default" },
    });

    if (!config) {
      config = await prisma.exhibitionConfig.create({
        data: {
          id: "default",
          active: false,
          fairName: null,
          city: null,
          dates: null,
          hall: null,
          standNumber: null,
        },
      });
    }

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("Exhibition config GET error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { active, fairName, city, dates, hall, standNumber, ctaTextTr, ctaTextEn } = body;

    const config = await prisma.exhibitionConfig.upsert({
      where: { id: "default" },
      update: {
        active: Boolean(active),
        fairName: fairName || null,
        city: city || null,
        dates: dates || null,
        hall: hall || null,
        standNumber: standNumber || null,
        ctaTextTr: ctaTextTr || null,
        ctaTextEn: ctaTextEn || null,
      },
      create: {
        id: "default",
        active: Boolean(active),
        fairName: fairName || null,
        city: city || null,
        dates: dates || null,
        hall: hall || null,
        standNumber: standNumber || null,
        ctaTextTr: ctaTextTr || null,
        ctaTextEn: ctaTextEn || null,
      },
    });

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("Exhibition config POST error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
