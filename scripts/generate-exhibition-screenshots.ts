import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

async function run() {
  const screenshotsDir = path.join(process.cwd(), "docs", "exhibition", "screenshots");
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const baseUrl = "http://localhost:3000";

  // 1. Mobile Exhibition Mode (390x844)
  console.log("Capturing mobile_exhibition_mode.png...");
  const pageMobile = await browser.newPage();
  await pageMobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await pageMobile.goto(`${baseUrl}/tr?source=stand-qr`, { waitUntil: "networkidle2" });
  await pageMobile.screenshot({ path: path.join(screenshotsDir, "mobile_exhibition_mode.png") });

  // 2. Desktop Exhibition Mode (1440x900)
  console.log("Capturing desktop_exhibition_mode.png...");
  const pageDesktop = await browser.newPage();
  await pageDesktop.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await pageDesktop.goto(`${baseUrl}/en?source=business-card`, { waitUntil: "networkidle2" });
  await pageDesktop.screenshot({ path: path.join(screenshotsDir, "desktop_exhibition_mode.png") });

  // 3. Mobile Post Exhibition CTA (390x844)
  console.log("Capturing mobile_post_exhibition_cta.png...");
  const pagePostCta = await browser.newPage();
  await pagePostCta.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await pagePostCta.goto(`${baseUrl}/tr#post-exhibition`, { waitUntil: "networkidle2" });
  await pagePostCta.screenshot({ path: path.join(screenshotsDir, "mobile_post_exhibition_cta.png") });

  // 4. Admin Lead Dashboard (1440x900)
  console.log("Capturing admin_lead_dashboard.png...");
  const pageAdmin = await browser.newPage();
  await pageAdmin.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await pageAdmin.goto(`${baseUrl}/admin/b2b-talepleri`, { waitUntil: "networkidle2" });
  await pageAdmin.screenshot({ path: path.join(screenshotsDir, "admin_lead_dashboard.png") });

  // 5. Admin Lead Detail (1440x900)
  console.log("Capturing admin_lead_detail.png...");
  const pageDetail = await browser.newPage();
  await pageDetail.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await pageDetail.goto(`${baseUrl}/admin/b2b-talepleri`, { waitUntil: "networkidle2" });
  const detailLink = await pageDetail.$('a[href^="/admin/b2b-talepleri/"]');
  if (detailLink) {
    await detailLink.click();
    await pageDetail.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => {});
  }
  await pageDetail.screenshot({ path: path.join(screenshotsDir, "admin_lead_detail.png") });

  // 6. Catalogue Mobile (390x844)
  console.log("Capturing catalogue_mobile.png...");
  const pageCatMobile = await browser.newPage();
  await pageCatMobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await pageCatMobile.goto(`${baseUrl}/tr/katalog`, { waitUntil: "networkidle2" });
  await pageCatMobile.screenshot({ path: path.join(screenshotsDir, "catalogue_mobile.png") });

  await browser.close();
  console.log("All screenshots captured successfully.");
}

run().catch((err) => {
  console.error("Screenshot capture error:", err);
});
