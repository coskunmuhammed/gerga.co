import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { DatabaseB2BMeetingRepository } from "@/repositories/database/database-b2b-meeting-repository";
import { B2BRequestStatus } from "@/domain/b2b/b2b-request-status";
import { B2BInterestArea } from "@/domain/b2b/b2b-interest-area";

const repository = new DatabaseB2BMeetingRepository();

// GET: List requests
export async function GET(request: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as B2BRequestStatus | undefined;
  const interestArea = searchParams.get("interestArea") as B2BInterestArea | undefined;
  const search = searchParams.get("search") || undefined;
  const archived = searchParams.get("archived") === "true" ? true : searchParams.get("archived") === "false" ? false : undefined;

  try {
    const requests = await repository.findMany({
      status,
      interestArea,
      search,
      archived,
    });

    return NextResponse.json({ success: true, data: requests });
  } catch {
    return NextResponse.json({ success: false, message: "Veriler getirilemedi." }, { status: 500 });
  }
}

// PATCH: Update status, internal note, or follow-up dates
export async function PATCH(request: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const { id, status, internalNote, archive, lastContactedAt, nextFollowUpAt } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "ID gereklidir." }, { status: 400 });
    }

    if (archive === true) {
      const archived = await repository.archive(id);
      return NextResponse.json({ success: true, data: archived });
    }

    const { prisma } = await import("@/lib/database/prisma");
    const updated = await prisma.b2BMeetingRequest.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(internalNote !== undefined ? { internalNote } : {}),
        ...(lastContactedAt !== undefined ? { lastContactedAt: lastContactedAt ? new Date(lastContactedAt) : null } : {}),
        ...(nextFollowUpAt !== undefined ? { nextFollowUpAt: nextFollowUpAt ? new Date(nextFollowUpAt) : null } : {}),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PATCH b2b-requests error:", error);
    return NextResponse.json({ success: false, message: "Güncelleme başarısız." }, { status: 500 });
  }
}
