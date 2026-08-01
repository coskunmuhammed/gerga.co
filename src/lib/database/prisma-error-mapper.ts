import { Prisma } from "@prisma/client";

export interface SafeAppError {
  code: string;
  status: number;
  message: string;
}

export function mapPrismaError(error: unknown): SafeAppError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return {
          code: "DUPLICATE_SUBMISSION",
          status: 409,
          message: "Bu başvuru veya kayıt halihazırda sistemde mevcuttur. / A duplicate entry exists.",
        };
      case "P2003":
        return {
          code: "INVALID_RELATION",
          status: 400,
          message: "Geçersiz veri ilişkisi. / Invalid data relationship.",
        };
      case "P2025":
        return {
          code: "RECORD_NOT_FOUND",
          status: 404,
          message: "Kayıt bulunamadı. / Record not found.",
        };
      default:
        return {
          code: "DATABASE_ERROR",
          status: 500,
          message: "Veritabanı işlemi gerçekleştirilemedi. / Database operation failed.",
        };
    }
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      code: "PERSISTENCE_UNAVAILABLE",
      status: 503,
      message: "Veritabanı bağlantısı geçici olarak kurulamadı. / Database connection unavailable.",
    };
  }

  if (error instanceof Prisma.PrismaClientRustPanicError || error instanceof Prisma.PrismaClientUnknownRequestError) {
    return {
      code: "DATABASE_UNAVAILABLE",
      status: 503,
      message: "Veritabanı servisi geçici olarak kesintiye uğradı. / Service temporarily unavailable.",
    };
  }

  return {
    code: "INTERNAL_SERVER_ERROR",
    status: 500,
    message: "Beklenmeyen bir sunucu hatası oluştu. / An unexpected server error occurred.",
  };
}
