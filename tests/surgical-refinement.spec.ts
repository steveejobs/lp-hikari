import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 412, height: 915 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
];

async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1_050);
}

test("o H1 reserva a largura final completa sem recorte", async ({ page }) => {
  for (const viewport of [viewports[0], viewports[4], viewports[6], viewports[7]]) {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await settle(page);

    const title = page.locator("#hero-title");
    await expect(title).toHaveAttribute("aria-label", "O florescer de um novo olhar.");
    const geometry = await title.locator(".hero-title-line").evaluateAll((lines) =>
      lines.map((line) => {
        const rect = line.getBoundingClientRect();
        const words = Array.from(line.querySelectorAll<HTMLElement>(".hero-word"));
        const lastWord = words.at(-1)?.getBoundingClientRect();
        return {
          text: line.textContent?.replace(/\s+/g, " ").trim(),
          overflowX: getComputedStyle(line).overflowX,
          lineRight: rect.right,
          wordRight: lastWord?.right ?? 0,
          width: rect.width,
          scrollWidth: line.scrollWidth,
        };
      }),
    );

    expect(geometry.map((line) => line.text)).toEqual([
      "O florescer",
      "de um novo olhar.",
    ]);
    expect(geometry.every((line) => line.overflowX === "visible")).toBeTruthy();
    expect(geometry.every((line) => line.wordRight <= line.lineRight + 1)).toBeTruthy();
    expect(geometry.every((line) => line.width + 1 >= line.scrollWidth)).toBeTruthy();
  }
});

test("o H1 preserva animação e estado reduzido legível", async ({ browser }) => {
  const regular = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await regular.newPage();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
  const animationNames = await page
    .locator(".hero-char")
    .evaluateAll((characters) => characters.map((character) => getComputedStyle(character).animationName));
  expect(animationNames.every((name) => name === "hero-character-in")).toBeTruthy();
  await expect(page.locator(".hero-word")).toHaveCount(6);
  await regular.close();

  const reduced = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto("/", { waitUntil: "domcontentloaded" });
  await expect(reducedPage.locator("#hero-title")).toBeVisible();
  const durations = await reducedPage
    .locator(".hero-char")
    .evaluateAll((characters) =>
      characters.map((character) => Number.parseFloat(getComputedStyle(character).animationDuration)),
    );
  expect(durations.every((duration) => duration <= 0.001)).toBeTruthy();
  await reduced.close();
});

test("a segunda seção revela produto, anéis e foco sem esconder conteúdo", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const section = page.locator("#ensaios");
  await section.scrollIntoViewIfNeeded();
  await expect(section.locator('[data-reveal="brand-statement"]')).toHaveAttribute(
    "data-reveal-state",
    "visible",
  );
  const lens = section.locator('[data-reveal="light-concentrate"]');
  await expect(lens).toHaveAttribute("data-reveal-state", "visible");
  const productImage = lens.locator('img[src*="series-04"]');
  await expect(productImage).toHaveJSProperty("complete", true);
  expect(
    await productImage.evaluate((image) => (image as HTMLImageElement).naturalWidth),
  ).toBeGreaterThan(0);
  const box = await lens.boundingBox();
  expect(box?.width).toBeGreaterThan(280);
  expect(box?.height).toBeGreaterThan(230);
  await expect(section.getByRole("heading", { name: "Hikari é luz. O resto é foco." })).toBeVisible();
});

test("a galeria social é full bleed e avança continuamente no mobile", async ({ page }) => {
  test.setTimeout(24_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/instagram", { waitUntil: "domcontentloaded" });
  const gallery = page.locator('[data-series="04"]');
  const viewport = gallery.locator('[role="region"]');
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery).toHaveAttribute("data-gallery-mode", "continuous");
  await expect(gallery).toHaveAttribute("data-gallery-running", "true");
  await settle(page);

  const bounds = await viewport.boundingBox();
  expect(Math.abs(bounds?.x ?? 99)).toBeLessThanOrEqual(1);
  expect(Math.abs((bounds?.width ?? 0) - 390)).toBeLessThanOrEqual(1);

  const start = await viewport.evaluate((element) => element.scrollLeft);
  await page.waitForTimeout(1_000);
  const moving = await viewport.evaluate((element) => element.scrollLeft);
  expect(moving - start).toBeGreaterThan(14);

  const box = await viewport.boundingBox();
  await page.mouse.move((box?.x ?? 0) + 180, (box?.y ?? 0) + 180);
  await page.mouse.down();
  await expect(gallery).toHaveAttribute("data-gallery-paused", "true");
  const paused = await viewport.evaluate((element) => element.scrollLeft);
  await page.waitForTimeout(700);
  expect(
    Math.abs((await viewport.evaluate((element) => element.scrollLeft)) - paused),
  ).toBeLessThan(2);
  await page.mouse.up();
  await expect
    .poll(() => gallery.getAttribute("data-gallery-paused"), { timeout: 8_000 })
    .toBe("false");
  await expect(gallery).toHaveAttribute("data-gallery-running", "true");

  await page.locator("[data-instagram-video]").scrollIntoViewIfNeeded();
  await expect(gallery).toHaveAttribute("data-gallery-running", "false");
});

test("full bleed permanece contido nos cinco viewports mobile", async ({ page }) => {
  for (const viewportSize of viewports.slice(0, 5)) {
    await page.setViewportSize(viewportSize);
    await page.goto("/instagram", { waitUntil: "domcontentloaded" });
    await settle(page);
    const galleryViewport = page.locator('[data-series="04"] [role="region"]');
    const bounds = await galleryViewport.boundingBox();
    expect(Math.abs(bounds?.x ?? 99)).toBeLessThanOrEqual(1);
    expect(Math.abs((bounds?.width ?? 0) - viewportSize.width)).toBeLessThanOrEqual(1);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  }
});

test("solar e grau aparecem com WhatsApp factual", async ({ page }) => {
  await page.goto("/instagram", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", { name: "Óculos solares e de grau, com a mesma presença." }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Óculos de grau", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Óculos solares", exact: true })).toBeVisible();

  const grade = new URL(
    (await page.getByRole("link", { name: "Quero óculos de grau" }).getAttribute("href")) ?? "",
  ).searchParams.get("text");
  const solar = new URL(
    (await page.getByRole("link", { name: "Quero óculos solar" }).getAttribute("href")) ?? "",
  ).searchParams.get("text");
  expect(grade).toBe(
    "Olá! Vim pelo Instagram da Ótica Hikari e quero atendimento para escolher meus óculos de grau.",
  );
  expect(solar).toBe(
    "Olá! Vim pelo Instagram da Ótica Hikari e quero atendimento para escolher meus óculos solar.",
  );
});

async function prepareEvidence(page: Page, route: string) {
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await page.evaluate(async () => {
    const pause = (duration: number) =>
      new Promise((resolve) => window.setTimeout(resolve, duration));
    for (const reveal of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
      reveal.scrollIntoView({ block: "center", behavior: "auto" });
      await pause(130);
      reveal.dataset.revealState = "visible";
    }
    document.documentElement.dataset.motionMode = "lite";
    window.scrollTo({ top: 0, behavior: "auto" });
  });
  await page.locator("img").evaluateAll(async (images) => {
    await Promise.all(
      images.map(
        (image) =>
          new Promise<void>((resolve) => {
            const element = image as HTMLImageElement;
            if (element.complete) return resolve();
            element.addEventListener("load", () => resolve(), { once: true });
            element.addEventListener("error", () => resolve(), { once: true });
            window.setTimeout(resolve, 3_000);
          }),
      ),
    );
  });
  await settle(page);
}

for (const route of ["/", "/instagram"]) {
  const routeName = route === "/" ? "home" : "instagram";
  test(`gera matriz visual cirúrgica de ${routeName}`, async ({ page }) => {
    for (const viewportSize of viewports) {
      await page.setViewportSize(viewportSize);
      await prepareEvidence(page, route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        ),
      ).toBeLessThanOrEqual(0);
      await page.screenshot({
        path: `.qa/surgical-2026-07-13/after/${routeName}-${viewportSize.width}x${viewportSize.height}.png`,
        fullPage: true,
      });
    }
  });
}

test("grava o fluxo contínuo full bleed", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    recordVideo: {
      dir: ".qa/surgical-2026-07-13/tmp-video",
      size: { width: 390, height: 844 },
    },
  });
  const page = await context.newPage();
  await page.goto("/instagram", { waitUntil: "domcontentloaded" });
  const gallery = page.locator('[data-series="04"]');
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery).toHaveAttribute("data-gallery-running", "true");
  await page.waitForTimeout(4_200);
  const video = page.video();
  await page.close();
  await video?.saveAs(".qa/surgical-2026-07-13/after/gallery-continuous-390x844.webm");
  await context.close();
});
