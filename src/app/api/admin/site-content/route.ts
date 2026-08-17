import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { ContentService } from "@/services/content-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sectionKey = searchParams.get("key");
  if (!sectionKey) {
    return NextResponse.json({ success: false, message: "Section key is required" }, { status: 400 });
  }

  const content = await ContentService.getSiteContentSection(sectionKey);
  return NextResponse.json({ success: true, content });
}

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { key, data } = body;

    if (!key || !data) {
      return NextResponse.json({ success: false, message: "Key and data are required" }, { status: 400 });
    }

    const updated = await ContentService.updateSiteContentSection(key, data);
    return NextResponse.json({ success: true, content: updated });
  } catch (error) {
    console.error("Site content update error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
