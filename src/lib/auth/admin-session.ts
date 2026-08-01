import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "gerga_admin_session";

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "GergaExhibition2026Admin!";
}

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "e9b28b74c5208f23789a24cf96515f4398e09f582bc0e19487d60f4c3b1712a8";
}

// Generate token hash
export function createSessionToken(password: string): string | null {
  if (password !== getAdminPassword()) {
    return null;
  }
  const secret = getSessionSecret();
  const timestamp = Date.now().toString();
  const signature = crypto.createHmac("sha256", secret).update(`admin:${timestamp}`).digest("hex");
  return `${timestamp}:${signature}`;
}

// Verify token
export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !token.includes(":")) return false;

  const [timestamp, signature] = token.split(":");
  const age = Date.now() - parseInt(timestamp, 10);

  // Session valid for 24 hours
  if (isNaN(age) || age > 24 * 60 * 60 * 1000 || age < 0) {
    return false;
  }

  const secret = getSessionSecret();
  const expectedSignature = crypto.createHmac("sha256", secret).update(`admin:${timestamp}`).digest("hex");

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

// Helper for server components and routes
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export const ADMIN_COOKIE_NAME = SESSION_COOKIE_NAME;
