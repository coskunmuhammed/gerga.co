import { prisma } from "@/lib/database/prisma";
import { Prisma } from "@prisma/client";
import {
  IB2BMeetingRepository,
  CreateB2BMeetingInput,
  B2BFilterParams,
} from "../b2b-meeting-repository";
import { B2BMeetingRequestEntity } from "@/domain/b2b/b2b-meeting-request";
import { B2BRequestStatus } from "@/domain/b2b/b2b-request-status";

export class DatabaseB2BMeetingRepository implements IB2BMeetingRepository {
  async create(input: CreateB2BMeetingInput): Promise<B2BMeetingRequestEntity> {
    const created = await prisma.b2BMeetingRequest.create({
      data: {
        referenceNumber: input.referenceNumber,
        fullName: input.fullName,
        companyName: input.companyName || null,
        country: input.country || null,
        email: input.email.toLowerCase(),
        phone: input.phone || null,
        interestArea: input.interestArea,
        message: input.message || null,
        preferredLanguage: input.preferredLanguage,
        privacyAccepted: input.privacyAccepted,
        privacyVersion: input.privacyVersion,
        privacyAcceptedAt: input.privacyAcceptedAt,
        marketingAccepted: input.marketingAccepted ?? false,
        marketingVersion: input.marketingVersion || null,
        marketingAcceptedAt: input.marketingAcceptedAt || null,
        source: input.source || "Exhibition Web Form",
      },
    });

    return created as B2BMeetingRequestEntity;
  }

  async findById(id: string): Promise<B2BMeetingRequestEntity | null> {
    const record = await prisma.b2BMeetingRequest.findUnique({
      where: { id },
    });
    return record as B2BMeetingRequestEntity | null;
  }

  async findByReferenceNumber(ref: string): Promise<B2BMeetingRequestEntity | null> {
    const record = await prisma.b2BMeetingRequest.findUnique({
      where: { referenceNumber: ref },
    });
    return record as B2BMeetingRequestEntity | null;
  }

  async findRecentDuplicate(
    email: string,
    message: string,
    windowSeconds: number = 300
  ): Promise<B2BMeetingRequestEntity | null> {
    const cutoff = new Date(Date.now() - windowSeconds * 1000);
    const record = await prisma.b2BMeetingRequest.findFirst({
      where: {
        email: email.toLowerCase(),
        message: message,
        createdAt: { gte: cutoff },
      },
    });
    return record as B2BMeetingRequestEntity | null;
  }

  async findMany(filters?: B2BFilterParams): Promise<B2BMeetingRequestEntity[]> {
    const where: Prisma.B2BMeetingRequestWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.interestArea) {
      where.interestArea = filters.interestArea;
    }

    if (filters?.archived === true) {
      where.archivedAt = { not: null };
    } else if (filters?.archived === false) {
      where.archivedAt = null;
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.trim();
      where.OR = [
        { referenceNumber: { contains: q } },
        { fullName: { contains: q } },
        { email: { contains: q } },
        { companyName: { contains: q } },
        { country: { contains: q } },
      ];
    }

    const records = await prisma.b2BMeetingRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return records as B2BMeetingRequestEntity[];
  }

  async updateStatus(
    id: string,
    status: B2BRequestStatus,
    internalNote?: string
  ): Promise<B2BMeetingRequestEntity> {
    const updated = await prisma.b2BMeetingRequest.update({
      where: { id },
      data: {
        status,
        ...(internalNote !== undefined ? { internalNote } : {}),
      },
    });
    return updated as B2BMeetingRequestEntity;
  }

  async archive(id: string): Promise<B2BMeetingRequestEntity> {
    const archived = await prisma.b2BMeetingRequest.update({
      where: { id },
      data: {
        archivedAt: new Date(),
      },
    });
    return archived as B2BMeetingRequestEntity;
  }
}
