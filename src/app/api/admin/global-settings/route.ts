import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { ContentService } from "@/services/content-service";

export async function GET() {
  const settings = await ContentService.getGlobalSettings();
  return NextResponse.json({ success: true, settings });
}

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const settings = await ContentService.updateGlobalSettings(body);
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Global settings update error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
