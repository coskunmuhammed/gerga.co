import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { ContentService } from "@/services/content-service";

export async function GET() {
  const sections = await ContentService.getSectionConfigs();
  return NextResponse.json({ success: true, sections });
}

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { sectionKey, sortOrder, active, navVisible, titleTr, titleEn } = body;

    if (!sectionKey) {
      return NextResponse.json({ success: false, message: "sectionKey is required" }, { status: 400 });
    }

    const updated = await ContentService.updateSectionConfig(sectionKey, {
      sortOrder,
      active,
      navVisible,
      titleTr: titleTr || sectionKey,
      titleEn: titleEn || sectionKey,
    });

    return NextResponse.json({ success: true, section: updated });
  } catch (error) {
    console.error("Section config update error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
