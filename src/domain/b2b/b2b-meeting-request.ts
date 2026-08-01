import { B2BRequestStatus } from "./b2b-request-status";
import { B2BInterestArea } from "./b2b-interest-area";

export interface B2BMeetingRequestEntity {
  id: string;
  referenceNumber: string;
  fullName: string;
  companyName?: string | null;
  country?: string | null;
  email: string;
  phone?: string | null;
  interestArea: B2BInterestArea;
  message?: string | null;
  preferredLanguage: "TR" | "EN";
  status: B2BRequestStatus;
  privacyAccepted: boolean;
  privacyVersion: string;
  privacyAcceptedAt: Date;
  marketingAccepted: boolean;
  marketingVersion?: string | null;
  marketingAcceptedAt?: Date | null;
  source?: string | null;
  internalNote?: string | null;
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date | null;
}
