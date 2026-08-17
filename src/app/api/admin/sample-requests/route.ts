import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { prisma } from "@/lib/database/prisma";

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
  }

  const sampleRequests = await prisma.b2BMeetingRequest.findMany({
    where: { requestType: "SAMPLE_REQUEST" },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, sampleRequests });
}
