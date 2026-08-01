import { NextRequest, NextResponse } from "next/server";
import { createB2BMeetingSchema } from "@/validation/b2b-meeting-schema";
import { DatabaseB2BMeetingRepository } from "@/repositories/database/database-b2b-meeting-repository";
import { EmailNotificationServiceAdapter } from "@/services/b2b-notification-service";
import { B2BMeetingService } from "@/services/b2b-meeting-service";
import { MemoryRateLimiter } from "@/services/rate-limit-service";
import { mapPrismaError } from "@/lib/database/prisma-error-mapper";

const repository = new DatabaseB2BMeetingRepository();
const notificationService = new EmailNotificationServiceAdapter();
const meetingService = new B2BMeetingService(repository, notificationService);
const rateLimiter = new MemoryRateLimiter(5, 60);

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Body size check (max 64KB)
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 65536) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "PAYLOAD_TOO_LARGE",
            message: "İstek boyutu çok yüksek. / Payload too large.",
          },
        },
        { status: 413 }
      );
    }

    // 2. Rate Limiting
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0] || "anon";
    const rateCheck = await rateLimiter.consume(clientIp);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: "Çok fazla istek gönderildi. Lütfen bekleyin. / Too many requests.",
            retryAfterSeconds: rateCheck.retryAfterSeconds,
          },
        },
        { status: 429 }
      );
    }

    // 3. Request parse
    const rawBody = await request.json();

    // 4. DTO Validation via Zod
    const parseResult = createB2BMeetingSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (path) fieldErrors[path] = issue.message;
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Lütfen form alanlarını kontrol edin. / Please check the form fields.",
            fieldErrors,
          },
        },
        { status: 422 }
      );
    }

    const validatedData = parseResult.data;

    // 5. Honeypot check
    if (validatedData.honeypot && validatedData.honeypot.trim().length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SPAM_DETECTED",
            message: "İstek kabul edilmedi. / Request rejected.",
          },
        },
        { status: 400 }
      );
    }

    // 6. Minimum filling time check (min 1500ms)
    if (validatedData.formStartTime && Date.now() - validatedData.formStartTime < 1500) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SPAM_FAST_FILL",
            message: "Lütfen formu doğrulayarak doldurunuz.",
          },
        },
        { status: 400 }
      );
    }

    // 7. Business Service Processing
    const { referenceNumber } = await meetingService.processMeetingRequest({
      fullName: validatedData.fullName,
      companyName: validatedData.companyName,
      country: validatedData.country,
      email: validatedData.email,
      phone: validatedData.phone,
      areaOfInterest: validatedData.areaOfInterest,
      message: validatedData.message,
      preferredLanguage: validatedData.preferredLanguage,
      privacyConsent: validatedData.privacyConsent,
      marketingConsent: validatedData.marketingConsent,
    });

    // 8. Safe Log without PII
    const duration = Date.now() - startTime;
    console.log("[B2B Meeting Log]", {
      event: "B2B_SUBMISSION_SUCCESS",
      route: "/api/b2b-meeting",
      status: 201,
      duration,
      referenceNumber,
    });

    // 9. Safe Response (HTTP 201 Created)
    return NextResponse.json(
      {
        success: true,
        data: {
          referenceNumber,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    const errObj = error as Error & { code?: string };

    if (errObj?.code === "DUPLICATE_SUBMISSION") {
      console.log("[B2B Meeting Log]", {
        event: "B2B_SUBMISSION_DUPLICATE",
        route: "/api/b2b-meeting",
        status: 409,
        duration,
        errorCode: "DUPLICATE_SUBMISSION",
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "DUPLICATE_SUBMISSION",
            message: "Bu görüşme talebi halihazırda alınmıştır. / This meeting request has already been received.",
          },
        },
        { status: 409 }
      );
    }

    const safeErr = mapPrismaError(error);
    console.error("[B2B Meeting Log Error]", {
      event: "B2B_SUBMISSION_ERROR",
      route: "/api/b2b-meeting",
      status: safeErr.status,
      duration,
      errorCode: safeErr.code,
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          code: safeErr.code,
          message: safeErr.message,
        },
      },
      { status: safeErr.status }
    );
  }
}
