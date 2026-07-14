import { expect, test, type Page } from "@playwright/test";

const evidenceViewports = [
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 412, height: 915 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
];

async function preparePage(page: Page, route: string) {
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toBeVisible();
  await page.evaluate(async () => {
    const pause = (duration: number) =>
      new Promise((resolve) => window.setTimeout(resolve, duration));
    document.documentElement.style.scrollBehavior = "auto";
    for (const reveal of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
      reveal.scrollIntoView({ block: "center", behavior: "auto" });
      await pause(100);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  });
  await page.waitForTimeout(route === "/" ? 1_150 : 800);
}

for (const route of ["/", "/instagram"]) {
  const routeName = route === "/" ? "home" : "instagram";
  for (const viewport of evidenceViewports) {
    test(`captura ${routeName} ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await preparePage(page, route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
      await page.screenshot({
        path: `.qa/correction-2026-07-13/after/${routeName}-${viewport.width}x${viewport.height}.png`,
        fullPage: true,
      });
    });
  }
}

test("captura o vídeo editorial em reprodução", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/instagram", { waitUntil: "domcontentloaded" });
  const frame = page.locator("[data-instagram-video]");
  await frame.scrollIntoViewIfNeeded();
  await expect
    .poll(() => frame.locator("video").evaluate((video) => !(video as HTMLVideoElement).paused))
    .toBeTruthy();
  await page.waitForTimeout(950);
  await page.screenshot({
    path: ".qa/correction-2026-07-13/after/video-playing-390x844.png",
  });
});

test("grava um avanço automático completo da galeria", async ({ browser }) => {
  test.setTimeout(24_000);
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    recordVideo: {
      dir: ".qa/correction-2026-07-13/tmp-video",
      size: { width: 390, height: 844 },
    },
  });
  const page = await context.newPage();
  await page.goto("/instagram", { waitUntil: "domcontentloaded" });
  const gallery = page.locator('[data-series="04"]');
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery).toHaveAttribute("data-gallery-running", "true");
  const initial = await gallery.getAttribute("data-active-item");
  await expect
    .poll(() => gallery.getAttribute("data-active-item"), { timeout: 7_000 })
    .not.toBe(initial);
  await page.waitForTimeout(1_200);
  const recording = page.video();
  await page.close();
  await recording?.saveAs(
    ".qa/correction-2026-07-13/after/gallery-autoplay-390x844.webm",
  );
  await context.close();
});
