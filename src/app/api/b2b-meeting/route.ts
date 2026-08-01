import { NextRequest, NextResponse } from "next/server";

export interface B2BMeetingPayload {
  fullName: string;
  company?: string;
  country: string;
  email: string;
  phone?: string;
  areaOfInterest: string;
  message: string;
  preferredLanguage: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: B2BMeetingPayload = await request.json();

    // Validation
    if (!body.fullName || !body.fullName.trim()) {
      return NextResponse.json(
        { success: false, error: "FULL_NAME_REQUIRED", message: "Full Name is required." },
        { status: 400 }
      );
    }

    if (!body.email || !body.email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "INVALID_EMAIL", message: "A valid Email address is required." },
        { status: 400 }
      );
    }

    if (!body.country || !body.country.trim()) {
      return NextResponse.json(
        { success: false, error: "COUNTRY_REQUIRED", message: "Country is required." },
        { status: 400 }
      );
    }

    if (!body.areaOfInterest || !body.areaOfInterest.trim()) {
      return NextResponse.json(
        { success: false, error: "AREA_OF_INTEREST_REQUIRED", message: "Area of Interest is required." },
        { status: 400 }
      );
    }

    if (!body.message || !body.message.trim()) {
      return NextResponse.json(
        { success: false, error: "MESSAGE_REQUIRED", message: "Message content is required." },
        { status: 400 }
      );
    }

    // Server-side log for B2B meeting request
    console.log("[B2B Meeting Request Received]", {
      timestamp: new Date().toISOString(),
      payload: body,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Meeting request received successfully.",
        receivedAt: new Date().toISOString(),
        referenceId: `GERGA-B2B-${Date.now()}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[B2B Meeting API Error]", error);
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR", message: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
