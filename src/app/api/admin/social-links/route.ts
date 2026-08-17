import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { ContentService } from "@/services/content-service";

export async function GET() {
  const socialLinks = await ContentService.getAllSocialLinks();
  return NextResponse.json({ success: true, socialLinks });
}

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...data } = body;

    const socialLink = await ContentService.saveSocialLink(id, data);
    return NextResponse.json({ success: true, socialLink });
  } catch (error) {
    console.error("Social link save error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    await ContentService.deleteSocialLink(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Social link delete error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
