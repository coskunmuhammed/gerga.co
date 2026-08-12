import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET() {
  try {
    const campaigns = await prisma.qRCampaign.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, campaigns });
  } catch (error) {
    console.error("QR campaign GET error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, sourceCode, targetLanguage, targetRoute } = body;

    if (!name || !sourceCode) {
      return NextResponse.json(
        { success: false, message: "Name and sourceCode are required" },
        { status: 400 }
      );
    }

    const campaign = await prisma.qRCampaign.create({
      data: {
        name,
        sourceCode: sourceCode.trim().toLowerCase(),
        targetLanguage: targetLanguage || "tr",
        targetRoute: targetRoute || "/",
        active: true,
      },
    });

    return NextResponse.json({ success: true, campaign });
  } catch (error) {
    console.error("QR campaign POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create QR campaign" },
      { status: 500 }
    );
  }
}
