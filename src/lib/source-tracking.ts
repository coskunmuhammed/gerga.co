"use client";

const SOURCE_STORAGE_KEY = "gerga_lead_source";
const SOURCE_COOKIE_KEY = "gerga_lead_source";

/**
 * Capture source query parameter from URL and store in sessionStorage and cookie.
 */
export function initSourceTracking(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const sourceParam = urlParams.get("source");

    if (sourceParam) {
      const sanitized = sourceParam.trim().toLowerCase();
      sessionStorage.setItem(SOURCE_STORAGE_KEY, sanitized);
      document.cookie = `${SOURCE_COOKIE_KEY}=${encodeURIComponent(sanitized)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
      return sanitized;
    }

    // Check existing stored source
    const stored = sessionStorage.getItem(SOURCE_STORAGE_KEY);
    if (stored) return stored;

    const cookieMatch = document.cookie.match(new RegExp(`(?:^|; )${SOURCE_COOKIE_KEY}=([^;]*)`));
    if (cookieMatch) {
      const value = decodeURIComponent(cookieMatch[1]);
      sessionStorage.setItem(SOURCE_STORAGE_KEY, value);
      return value;
    }
  } catch {
    // Gracefully handle storage errors
  }

  return null;
}

/**
 * Get stored lead source for form submissions.
 */
export function getStoredLeadSource(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = sessionStorage.getItem(SOURCE_STORAGE_KEY);
    if (stored) return stored;

    const cookieMatch = document.cookie.match(new RegExp(`(?:^|; )${SOURCE_COOKIE_KEY}=([^;]*)`));
    if (cookieMatch) return decodeURIComponent(cookieMatch[1]);
  } catch {
    // Ignore errors
  }

  return null;
}
