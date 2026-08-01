import { B2BInterestArea } from "@/domain/b2b/b2b-interest-area";

export interface CreateB2BMeetingDto {
  fullName: string;
  companyName?: string;
  country: string;
  email: string;
  phone?: string;
  areaOfInterest: B2BInterestArea;
  message: string;
  preferredLanguage: "TR" | "EN";
  privacyConsent: boolean;
  marketingConsent?: boolean;
  honeypot?: string;
  formStartTime?: number;
}

export interface B2BMeetingResponseDto {
  success: boolean;
  data?: {
    referenceNumber: string;
    createdAt: string;
  };
  error?: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string>;
  };
}
