import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface B2BMeetingPayload {
  fullName: string;
  company?: string;
  country: string;
  email: string;
  phone?: string;
  areaOfInterest: string;
  message: string;
  preferredLanguage: string;
  kvkkConsent?: boolean;
}

export interface B2BRecord {
  id: string;
  receivedAt: string;
  ip: string;
  payload: {
    fullName: string;
    company: string;
    country: string;
    email: string;
    phone: string;
    areaOfInterest: string;
    message: string;
    preferredLanguage: string;
  };
}

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "b2b-submissions.json");

function saveSubmissionToFile(submission: B2BRecord): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    let existingData: B2BRecord[] = [];
    if (fs.existsSync(FILE_PATH)) {
      const fileContent = fs.readFileSync(FILE_PATH, "utf-8");
      existingData = JSON.parse(fileContent || "[]") as B2BRecord[];
    }

    existingData.push(submission);
    fs.writeFileSync(FILE_PATH, JSON.stringify(existingData, null, 2), "utf-8");
  } catch (error) {
    console.error("[B2B Persistence Error]", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: B2BMeetingPayload = await request.json();

    if (!body.fullName || !body.fullName.trim()) {
      return NextResponse.json(
        { success: false, error: "FULL_NAME_REQUIRED", message: "Ad Soyad alanı zorunludur. / Full Name is required." },
        { status: 400 }
      );
    }

    if (!body.email || !body.email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "INVALID_EMAIL", message: "Geçerli bir e-posta adresi giriniz. / Valid Email address required." },
        { status: 400 }
      );
    }

    if (!body.country || !body.country.trim()) {
      return NextResponse.json(
        { success: false, error: "COUNTRY_REQUIRED", message: "Ülke alanı zorunludur. / Country is required." },
        { status: 400 }
      );
    }

    if (!body.areaOfInterest || !body.areaOfInterest.trim()) {
      return NextResponse.json(
        { success: false, error: "AREA_OF_INTEREST_REQUIRED", message: "İlgi alanı seçilmelidir. / Area of Interest required." },
        { status: 400 }
      );
    }

    if (!body.message || !body.message.trim()) {
      return NextResponse.json(
        { success: false, error: "MESSAGE_REQUIRED", message: "Mesaj alanı zorunludur. / Message content required." },
        { status: 400 }
      );
    }

    if (body.kvkkConsent !== true) {
      return NextResponse.json(
        { success: false, error: "KVKK_REQUIRED", message: "Gizlilik ve KVKK aydınlatmasını onaylamalısınız. / Privacy notice consent is required." },
        { status: 400 }
      );
    }

    const newRecord: B2BRecord = {
      id: `GERGA-B2B-${Date.now()}`,
      receivedAt: new Date().toISOString(),
      ip: request.headers.get("x-forwarded-for") || "local",
      payload: {
        fullName: body.fullName.trim(),
        company: body.company?.trim() || "-",
        country: body.country.trim(),
        email: body.email.trim(),
        phone: body.phone?.trim() || "-",
        areaOfInterest: body.areaOfInterest,
        message: body.message.trim(),
        preferredLanguage: body.preferredLanguage || "TR",
      },
    };

    saveSubmissionToFile(newRecord);

    return NextResponse.json(
      {
        success: true,
        message: "Görüşme talebiniz başarıyla kaydedilmiştir. / Meeting request recorded successfully.",
        referenceId: newRecord.id,
        receivedAt: newRecord.receivedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[B2B Meeting API Error]", error);
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR", message: "Sunucu hatası oluştu. / Internal server error." },
      { status: 500 }
    );
  }
}
