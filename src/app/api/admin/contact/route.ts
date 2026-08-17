import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { ContentService } from "@/services/content-service";

export async function GET() {
  const contact = await ContentService.getContactConfig("tr");
  return NextResponse.json({ success: true, contact });
}

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const contact = await ContentService.updateContactConfig(body);
    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error("Contact config update error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
