import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { ContentService } from "@/services/content-service";

export async function GET() {
  const seo = await ContentService.getSeoConfig("tr");
  return NextResponse.json({ success: true, seo });
}

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const seo = await ContentService.updateSeoConfig(body);
    return NextResponse.json({ success: true, seo });
  } catch (error) {
    console.error("SEO update error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
