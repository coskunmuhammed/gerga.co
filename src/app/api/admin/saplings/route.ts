import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { ContentService } from "@/services/content-service";

export async function GET() {
  const saplings = await ContentService.getAllSaplings();
  return NextResponse.json({ success: true, saplings });
}

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...data } = body;

    const sapling = await ContentService.saveSapling(id, data);
    return NextResponse.json({ success: true, sapling });
  } catch (error) {
    console.error("Sapling save error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
