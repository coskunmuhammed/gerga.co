import { B2BMeetingRequestEntity } from "@/domain/b2b/b2b-meeting-request";
import { B2BRequestStatus } from "@/domain/b2b/b2b-request-status";
import { B2BInterestArea } from "@/domain/b2b/b2b-interest-area";

export interface CreateB2BMeetingInput {
  referenceNumber: string;
  fullName: string;
  companyName?: string;
  country?: string;
  email: string;
  phone?: string;
  interestArea: B2BInterestArea;
  message?: string;
  preferredLanguage: "TR" | "EN";
  privacyAccepted: boolean;
  privacyVersion: string;
  privacyAcceptedAt: Date;
  marketingAccepted?: boolean;
  marketingVersion?: string;
  marketingAcceptedAt?: Date;
  source?: string;
  requestType?: string;
  priority?: string;
  score?: number;
  scoreReasons?: string;
  lastContactedAt?: Date;
  nextFollowUpAt?: Date;
}

export interface B2BFilterParams {
  status?: B2BRequestStatus;
  interestArea?: B2BInterestArea;
  search?: string;
  country?: string;
  archived?: boolean;
}

export interface IB2BMeetingRepository {
  create(input: CreateB2BMeetingInput): Promise<B2BMeetingRequestEntity>;
  findById(id: string): Promise<B2BMeetingRequestEntity | null>;
  findByReferenceNumber(ref: string): Promise<B2BMeetingRequestEntity | null>;
  findRecentDuplicate(email: string, message: string, windowSeconds?: number): Promise<B2BMeetingRequestEntity | null>;
  findMany(filters?: B2BFilterParams): Promise<B2BMeetingRequestEntity[]>;
  updateStatus(id: string, status: B2BRequestStatus, internalNote?: string): Promise<B2BMeetingRequestEntity>;
  archive(id: string): Promise<B2BMeetingRequestEntity>;
}
