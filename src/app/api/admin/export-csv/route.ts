import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { DatabaseB2BMeetingRepository } from "@/repositories/database/database-b2b-meeting-repository";

const repository = new DatabaseB2BMeetingRepository();

// Escape formula injection characters (=, +, -, @)
function escapeCsvCell(value: string | null | undefined): string {
  if (!value) return '""';
  let str = String(value).trim();

  // If starts with =, +, -, @, prepend single quote '
  if (/^[=+\-@]/.test(str)) {
    str = `'${str}`;
  }

  // Double quotes escaping
  str = str.replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const requests = await repository.findMany();

    const headers = [
      "Reference Number",
      "Created At",
      "Full Name",
      "Company",
      "Country",
      "Email",
      "Phone",
      "Interest Area",
      "Preferred Language",
      "Status",
    ];

    const rows = requests.map((req) => [
      escapeCsvCell(req.referenceNumber),
      escapeCsvCell(new Date(req.createdAt).toISOString()),
      escapeCsvCell(req.fullName),
      escapeCsvCell(req.companyName),
      escapeCsvCell(req.country),
      escapeCsvCell(req.email),
      escapeCsvCell(req.phone),
      escapeCsvCell(req.interestArea),
      escapeCsvCell(req.preferredLanguage),
      escapeCsvCell(req.status),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="GERGA_B2B_Requests_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ success: false, message: "CSV aktarımı başarısız." }, { status: 500 });
  }
}
