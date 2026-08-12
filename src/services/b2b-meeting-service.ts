import { IB2BMeetingRepository } from "@/repositories/b2b-meeting-repository";
import { CreateB2BMeetingDto } from "@/dto/b2b-meeting.dto";
import { B2BMeetingRequestEntity } from "@/domain/b2b/b2b-meeting-request";
import { B2BNotificationService } from "./b2b-notification-service";

export class B2BMeetingService {
  constructor(
    private repository: IB2BMeetingRepository,
    private notificationService: B2BNotificationService
  ) {}

  private generateReferenceNumber(): string {
    const year = new Date().getFullYear();
    const randomHex = Math.floor(100000 + Math.random() * 900000);
    return `GERGA-B2B-${year}-${randomHex}`;
  }

  async processMeetingRequest(
    dto: CreateB2BMeetingDto,
    source: string = "Exhibition Web Form"
  ): Promise<{ entity: B2BMeetingRequestEntity; referenceNumber: string }> {
    // 1. Check duplicate submission (same email + message in last 5 mins)
    const duplicate = await this.repository.findRecentDuplicate(dto.email, dto.message, 300);
    if (duplicate) {
      const error = new Error("Bu başvuru halihazırda alınmıştır. / A duplicate submission was received recently.") as Error & { code?: string };
      error.code = "DUPLICATE_SUBMISSION";
      throw error;
    }

    // 2. Generate unique reference number
    let referenceNumber = this.generateReferenceNumber();
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      const existing = await this.repository.findByReferenceNumber(referenceNumber);
      if (!existing) {
        isUnique = true;
      } else {
        referenceNumber = this.generateReferenceNumber();
        attempts++;
      }
    }

    // 3. Server timestamp for consent
    const now = new Date();

    // 4. Calculate Lead Score
    const { calculateLeadScore } = await import("@/lib/lead-scoring");
    const scoreResult = calculateLeadScore({
      companyName: dto.companyName,
      country: dto.country,
      phone: dto.phone,
      message: dto.message,
      interestArea: dto.areaOfInterest,
      source,
    });

    // 5. Persistence via repository
    const createdEntity = await this.repository.create({
      referenceNumber,
      fullName: dto.fullName,
      companyName: dto.companyName,
      country: dto.country,
      email: dto.email,
      phone: dto.phone,
      interestArea: dto.areaOfInterest,
      message: dto.message,
      preferredLanguage: dto.preferredLanguage,
      privacyAccepted: dto.privacyConsent,
      privacyVersion: "v1.0",
      privacyAcceptedAt: now,
      marketingAccepted: dto.marketingConsent ?? false,
      marketingVersion: dto.marketingConsent ? "v1.0" : undefined,
      marketingAcceptedAt: dto.marketingConsent ? now : undefined,
      source,
      priority: scoreResult.priority,
      score: scoreResult.score,
      scoreReasons: JSON.stringify(scoreResult.reasons),
    });

    // 5. Trigger notifications safely (does not affect DB persistence)
    try {
      await Promise.allSettled([
        this.notificationService.notifyBusiness(createdEntity),
        this.notificationService.notifyVisitor(createdEntity),
      ]);
    } catch (err) {
      console.error("[Notification Dispatch Error]", err);
    }

    return { entity: createdEntity, referenceNumber: createdEntity.referenceNumber };
  }
}
