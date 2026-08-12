"use client";

import { getStoredLeadSource } from "./source-tracking";

const PII_KEYS = [
  "name",
  "fullName",
  "email",
  "phone",
  "message",
  "address",
  "company",
  "companyName",
];

export type AnalyticsValue = string | number | boolean | null | undefined;

export function sanitizeAnalyticsProps(
  props?: Record<string, AnalyticsValue>
): Record<string, AnalyticsValue> | undefined {
  if (!props) return undefined;
  const cleanProps: Record<string, AnalyticsValue> = {};

  for (const key of Object.keys(props)) {
    if (PII_KEYS.some((pii) => key.toLowerCase().includes(pii.toLowerCase()))) {
      continue; // Exclude PII fields
    }
    cleanProps[key] = props[key];
  }

  return cleanProps;
}

export function trackEvent(eventName: string, properties?: Record<string, AnalyticsValue>): void {
  if (typeof window === "undefined") return;

  try {
    const source = getStoredLeadSource() || undefined;
    const cleanProperties = sanitizeAnalyticsProps(properties);
    const locale = window.location.pathname.startsWith("/en") ? "en" : "tr";

    const payload = {
      eventName,
      source,
      locale,
      properties: cleanProperties,
    };

    // First-party analytics endpoint call (non-blocking)
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/track", blob);
    } else {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Fail silently without disturbing user experience
  }
}
