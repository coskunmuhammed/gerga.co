import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth/admin-session";
import { MemoryRateLimiter } from "@/services/rate-limit-service";

const loginRateLimiter = new MemoryRateLimiter(5, 300); // 5 attempts per 5 mins

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0] || "anon";
  const rateCheck = await loginRateLimiter.consume(`login:${clientIp}`);

  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, message: "Çok fazla hatalı giriş denemesi. Lütfen bekleyin." },
      { status: 429 }
    );
  }

  try {
    const { password } = await request.json();
    const token = createSessionToken(password);

    if (!token) {
      console.warn("[Admin Login Failure]", { clientIp, timestamp: new Date().toISOString() });
      return NextResponse.json(
        { success: false, message: "Geçersiz admin şifresi." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true, message: "Giriş başarılı." });
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    console.log("[Admin Login Success]", { clientIp, timestamp: new Date().toISOString() });
    return response;
  } catch {
    return NextResponse.json({ success: false, message: "Giriş işlemi başarısız." }, { status: 400 });
  }
}
