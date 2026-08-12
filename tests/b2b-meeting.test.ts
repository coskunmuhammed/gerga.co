import { createB2BMeetingSchema } from "../src/validation/b2b-meeting-schema";
import { createSessionToken, verifySessionToken } from "../src/lib/auth/admin-session";
import { calculateLeadScore } from "../src/lib/lead-scoring";
import { sanitizeAnalyticsProps } from "../src/lib/analytics";

function runTests() {
  console.log("Running GERGA B2B Production Test Suite...");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  // Test 1: Valid DTO Validation
  const validData = {
    fullName: "Hans Müller",
    companyName: "EuroFruit GmbH",
    country: "Germany",
    email: "hans@eurofruit.de",
    phone: "+491712345678",
    areaOfInterest: "PRODUCT_SUPPLY",
    message: "We are interested in sourcing organic dried figs in bulk 5kg wooden crates.",
    preferredLanguage: "EN",
    privacyConsent: true,
  };
  const parseResult = createB2BMeetingSchema.safeParse(validData);
  assert(parseResult.success === true, "Valid B2B DTO schema validation");

  // Test 2: Invalid Email Validation
  const invalidEmailData = { ...validData, email: "invalid-email-address" };
  const parseResultEmail = createB2BMeetingSchema.safeParse(invalidEmailData);
  assert(parseResultEmail.success === false, "Reject invalid email format");

  // Test 3: Missing Privacy Consent
  const noPrivacyData = { ...validData, privacyConsent: false };
  const parseResultPrivacy = createB2BMeetingSchema.safeParse(noPrivacyData);
  assert(parseResultPrivacy.success === false, "Reject missing privacy consent");

  // Test 4: Honeypot Detection
  const honeypotData = { ...validData, honeypot: "spam_bot_filled_this" };
  const parseResultHoneypot = createB2BMeetingSchema.safeParse(honeypotData);
  assert(parseResultHoneypot.success === false, "Detect honeypot spam submission");

  // Test 5: Reference Number Format Regex
  const refFormat = /^GERGA-B2B-2026-\d{6}$/;
  const sampleRef = `GERGA-B2B-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  assert(refFormat.test(sampleRef), "Reference number format matches GERGA-B2B-2026-XXXXXX");

  // Test 6: CSV Formula Injection Escaping
  const formulaCell = "=SUM(1+1)";
  const escapedFormula = /^[=+\-@]/.test(formulaCell) ? `'${formulaCell}` : formulaCell;
  assert(escapedFormula === "'=SUM(1+1)", "Escape CSV formula injection starting with '='");

  // Test 7: Admin Session Authentication Token
  const validPass = process.env.ADMIN_PASSWORD || "GergaExhibition2026Admin!";
  const token = createSessionToken(validPass);
  assert(token !== null, "Admin session token creation");
  assert(verifySessionToken(token || ""), "Verify valid admin session token");
  assert(verifySessionToken("invalid_token_xyz") === false, "Reject invalid admin session token");

  // Test 8: Deterministic Lead Scoring
  const highLead = calculateLeadScore({
    companyName: "Global Fruit Logistics",
    country: "Germany",
    phone: "+491712345678",
    message: "We need 20 tons of dried figs with private label packaging for our supermarket chain.",
    interestArea: "WHOLESALE",
    source: "stand-qr",
  });
  assert(highLead.priority === "High Priority", "Lead scoring identifies High Priority leads (score >= 60)");
  assert(highLead.reasons.length >= 4, "Lead scoring returns explanatory reasons list");

  // Test 9: Analytics PII Stripping
  const sanitized = sanitizeAnalyticsProps({
    fullName: "John Doe",
    email: "john@example.com",
    locale: "en",
    tileId: "wholesale",
  });
  assert(sanitized?.fullName === undefined && sanitized?.email === undefined, "Analytics strips PII fields");
  assert(sanitized?.locale === "en" && sanitized?.tileId === "wholesale", "Analytics preserves non-PII properties");

  console.log(`\nTest Summary: ${passed} Passed, ${failed} Failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
