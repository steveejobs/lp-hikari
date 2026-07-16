import { expect, test, type Page } from "@playwright/test";
import axe from "axe-core";

async function revealFullPage(page: Page) {
  await page.evaluate(async () => {
    const wait = (duration: number) => new Promise((resolve) => window.setTimeout(resolve, duration));
    document.documentElement.style.scrollBehavior = "auto";
    for (const element of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
      element.scrollIntoView({ block: "center", behavior: "auto" });
      await wait(90);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    await wait(120);
  });
}

for (const viewport of [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
]) {
  test(`auditoria visual e técnica da home em ${viewport.width}x${viewport.height}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];
    const notFoundResponses: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("requestfailed", (request) => {
      if (request.url().startsWith("http://127.0.0.1:3100")) failedRequests.push(request.url());
    });
    page.on("response", (response) => {
      if (response.status() === 404) notFoundResponses.push(response.url());
    });

    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toBeVisible();
    await revealFullPage(page);

    const metrics = await page.evaluate(() => {
      const primaryCta = document.querySelector<HTMLElement>(".hero-actions .button-primary");
      const heroImage = document.querySelector<HTMLImageElement>("[data-light-trail-hero] img");
      const introImage = document.querySelector<HTMLImageElement>('[data-reveal="light-concentrate"] img');
      const rect = primaryCta?.getBoundingClientRect();

      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        primaryCta: rect ? { width: rect.width, height: rect.height, top: rect.top, bottom: rect.bottom } : null,
        brokenImages: [...document.images]
          .filter((image) => image.complete && image.naturalWidth === 0)
          .map((image) => image.currentSrc),
        hero: heroImage
          ? {
              fit: getComputedStyle(heroImage).objectFit,
              naturalRatio: heroImage.naturalWidth / heroImage.naturalHeight,
              frameRatio: heroImage.parentElement!.clientWidth / heroImage.parentElement!.clientHeight,
            }
          : null,
        intro: introImage
          ? {
              fit: getComputedStyle(introImage).objectFit,
              naturalRatio: introImage.naturalWidth / introImage.naturalHeight,
              frameRatio: introImage.parentElement!.clientWidth / introImage.parentElement!.clientHeight,
            }
          : null,
        duplicatedHeroImages: document.querySelectorAll("[data-light-trail-hero] img").length,
        legacyFaceEffects: document.querySelectorAll(".refracted-layer, .lens-orbit").length,
      };
    });

    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
    expect(metrics.brokenImages).toEqual([]);
    expect(metrics.primaryCta).not.toBeNull();
    expect(metrics.primaryCta!.width).toBeGreaterThanOrEqual(44);
    expect(metrics.primaryCta!.height).toBeGreaterThanOrEqual(44);
    expect(metrics.primaryCta!.top).toBeGreaterThanOrEqual(0);
    expect(metrics.primaryCta!.bottom).toBeLessThanOrEqual(viewport.height);
    expect(metrics.hero?.fit).toBe("contain");
    expect(metrics.intro?.fit).toBe("contain");
    expect(Math.abs(metrics.hero!.naturalRatio - metrics.hero!.frameRatio)).toBeLessThan(0.01);
    expect(Math.abs(metrics.intro!.naturalRatio - metrics.intro!.frameRatio)).toBeLessThan(0.01);
    expect(metrics.duplicatedHeroImages).toBe(1);
    expect(metrics.legacyFaceEffects).toBe(0);
    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
    expect(notFoundResponses).toEqual([]);

    await page.addScriptTag({ content: axe.source });
    const accessibility = await page.evaluate(() =>
      (window as unknown as Window & {
        axe: { run: () => Promise<{ violations: Array<{ impact: string | null }> }> };
      }).axe.run(),
    );
    expect(accessibility.violations.filter((violation) => violation.impact === "critical")).toEqual([]);
    expect(accessibility.violations.filter((violation) => violation.impact === "serious")).toEqual([]);

    await page.addStyleTag({ content: "main > section { content-visibility: visible !important; }" });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `.qa/audit-2026-07-16/after/home-${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    });
  });
}

test("reduced motion desativa loops do novo efeito", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const loops = await page.locator('.hero-light-trails, .hero-light-signal, [data-reveal="light-concentrate"] > i').evaluateAll((elements) =>
    elements.map((element) => ({
      duration: Number.parseFloat(getComputedStyle(element).animationDuration),
      iterations: getComputedStyle(element).animationIterationCount,
    })),
  );

  expect(loops.every((loop) => loop.duration <= 0.01 && loop.iterations === "1")).toBeTruthy();
  await context.close();
});
