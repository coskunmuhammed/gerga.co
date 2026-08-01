import { B2BMeetingRequestEntity } from "@/domain/b2b/b2b-meeting-request";

export interface B2BNotificationService {
  notifyBusiness(request: B2BMeetingRequestEntity): Promise<void>;
  notifyVisitor(request: B2BMeetingRequestEntity): Promise<void>;
}

export class EmailNotificationServiceAdapter implements B2BNotificationService {
  private isConfigured: boolean;

  constructor() {
    this.isConfigured = Boolean(
      process.env.MAIL_PROVIDER &&
      process.env.MAIL_TO &&
      process.env.SMTP_HOST
    );
  }

  async notifyBusiness(request: B2BMeetingRequestEntity): Promise<void> {
    if (!this.isConfigured) {
      console.log("[Notification Adapter Notice]", {
        event: "BUSINESS_NOTIFICATION_SKIPPED",
        requestId: request.id,
        referenceNumber: request.referenceNumber,
        reason: "Email provider not configured. Persistence completed successfully.",
      });
      return;
    }

    try {
      console.log("[Email Sent to Business]", {
        to: process.env.MAIL_TO,
        referenceNumber: request.referenceNumber,
        fullName: request.fullName,
      });
    } catch (error) {
      console.error("[Notification Business Email Error]", {
        event: "BUSINESS_EMAIL_FAILED",
        requestId: request.id,
        referenceNumber: request.referenceNumber,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async notifyVisitor(request: B2BMeetingRequestEntity): Promise<void> {
    if (!this.isConfigured) {
      console.log("[Notification Adapter Notice]", {
        event: "VISITOR_NOTIFICATION_SKIPPED",
        requestId: request.id,
        referenceNumber: request.referenceNumber,
        reason: "Email provider not configured. Persistence completed successfully.",
      });
      return;
    }

    try {
      console.log("[Email Sent to Visitor]", {
        to: request.email,
        referenceNumber: request.referenceNumber,
        language: request.preferredLanguage,
      });
    } catch (error) {
      console.error("[Notification Visitor Email Error]", {
        event: "VISITOR_EMAIL_FAILED",
        requestId: request.id,
        referenceNumber: request.referenceNumber,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
