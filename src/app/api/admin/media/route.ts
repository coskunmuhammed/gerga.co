import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { ContentService } from "@/services/content-service";

export async function GET() {
  const media = await ContentService.getMediaAssets();
  return NextResponse.json({ success: true, media });
}

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { filename, url, altTextTr, altTextEn, category, isPlaceholder } = body;

    if (!filename || !url) {
      return NextResponse.json({ success: false, message: "Filename and URL are required" }, { status: 400 });
    }

    const asset = await ContentService.saveMediaAsset({
      filename,
      url,
      altTextTr,
      altTextEn,
      category: category || "Gallery",
      isPlaceholder: Boolean(isPlaceholder),
    });

    return NextResponse.json({ success: true, asset });
  } catch (error) {
    console.error("Media asset save error:", error);
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

    await ContentService.deleteMediaAsset(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Media asset delete error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
