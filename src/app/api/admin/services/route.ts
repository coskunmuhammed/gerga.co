import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { ContentService } from "@/services/content-service";

export async function GET() {
  const services = await ContentService.getAllServices();
  return NextResponse.json({ success: true, services });
}

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...data } = body;

    const service = await ContentService.saveService(id, data);
    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error("Service save error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
