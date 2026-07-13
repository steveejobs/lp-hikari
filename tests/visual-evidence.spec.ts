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
  { width: 1920, height: 900 },
];

async function prepareFullPage(page: Page, route: string) {
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute(
    "data-motion-mode",
    /full|lite/,
  );

  await page.evaluate(async () => {
    const pause = (duration: number) =>
      new Promise((resolve) => window.setTimeout(resolve, duration));
    document.documentElement.style.scrollBehavior = "auto";
    const reveals = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    for (const reveal of reveals) {
      reveal.scrollIntoView({ block: "center", behavior: "auto" });
      await pause(130);
    }

    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "auto",
    });
    await pause(320);
  });

  await page
    .locator("img")
    .evaluateAll(async (images) => {
      await Promise.all(
        images.map(
          (image) =>
            new Promise<void>((resolve) => {
              const element = image as HTMLImageElement;
              if (element.complete) {
                resolve();
                return;
              }
              const finish = () => resolve();
              element.addEventListener("load", finish, { once: true });
              element.addEventListener("error", finish, { once: true });
              window.setTimeout(finish, 4_000);
            }),
        ),
      );
    })
    .catch(() => undefined);

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
  await page.waitForTimeout(route === "/" ? 1_550 : 1_050);
}

for (const route of ["/", "/instagram"]) {
  const routeName = route === "/" ? "home" : "instagram";

  for (const viewport of evidenceViewports) {
    test(`evidência ${routeName} em ${viewport.width}x${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await prepareFullPage(page, route);

      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        headings: document.querySelectorAll("h1").length,
        pendingReveals: Array.from(
          document.querySelectorAll<HTMLElement>(
            '[data-reveal-state="pending"]',
          ),
        ).map((element) => ({
          family: element.dataset.reveal,
          className: element.className,
          top: Math.round(element.getBoundingClientRect().top),
          height: Math.round(element.getBoundingClientRect().height),
        })),
      }));

      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
      expect(metrics.headings).toBe(1);
      expect(metrics.pendingReveals).toEqual([]);

      await page.screenshot({
        path: `.qa/refinement-2026-07-13/after/${routeName}-${viewport.width}x${viewport.height}.png`,
        fullPage: true,
      });
    });
  }
}
