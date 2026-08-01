/* eslint-disable @typescript-eslint/no-require-imports */
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const SCREENSHOT_DIR = path.join(__dirname, "..", "docs", "exhibition", "screenshots");

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function capture() {
  console.log("Starting QA screenshot capture...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // 1. Desktop /tr 1440px
  console.log("Capturing Desktop /tr 1440px...");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3005/tr", { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "desktop_tr_full.png"), fullPage: true });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "desktop_tr_hero.png") });

  // 2. Desktop /en 1440px
  console.log("Capturing Desktop /en 1440px...");
  await page.goto("http://localhost:3005/en", { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "desktop_en_full.png"), fullPage: true });

  // 3. Mobile /tr 390px
  console.log("Capturing Mobile /tr 390px...");
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3005/tr", { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "mobile_tr_full.png"), fullPage: true });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "mobile_tr_hero.png") });

  // Mobile menu screenshot
  const menuButton = await page.$('button[aria-label="Toggle Navigation Menu"]');
  if (menuButton) {
    await menuButton.click();
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "mobile_tr_nav.png") });
  }

  // 4. Mobile /en 390px
  console.log("Capturing Mobile /en 390px...");
  await page.goto("http://localhost:3005/en", { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "mobile_en_full.png"), fullPage: true });

  // Specific section screenshots (Desktop)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3005/tr", { waitUntil: "networkidle0" });

  const sections = [
    { id: "#products", name: "section_products.png" },
    { id: "#nursery", name: "section_nursery.png" },
    { id: "#engineering", name: "section_engineering.png" },
    { id: "#b2b-meeting", name: "section_b2b_form.png" },
    { id: "#gallery", name: "section_gallery.png" },
    { id: "#contact", name: "section_contact.png" },
  ];

  for (const sec of sections) {
    const el = await page.$(sec.id);
    if (el) {
      await el.scrollIntoView();
      await new Promise(r => setTimeout(r, 300));
      await el.screenshot({ path: path.join(SCREENSHOT_DIR, sec.name) });
    }
  }

  // 5. Admin Panel Screenshots
  console.log("Capturing Admin Panel...");
  await page.goto("http://localhost:3005/admin/giris", { waitUntil: "domcontentloaded" });
  await page.waitForSelector('input[type="password"]', { timeout: 5000 });
  await page.type('input[type="password"]', "GergaExhibition2026Admin!");
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "admin_b2b_list.png") });

  const detailLink = await page.$('a[href*="/admin/b2b-talepleri/"]');
  if (detailLink) {
    await detailLink.click();
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "admin_b2b_detail.png") });
  }

  console.log("All QA & Admin screenshots captured successfully!");
  await browser.close();
}

capture().catch((err) => {
  console.error("Screenshot capture error:", err);
  process.exit(1);
});
