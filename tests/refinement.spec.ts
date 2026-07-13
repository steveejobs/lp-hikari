import { expect, test, type Locator, type Page } from "@playwright/test";

type LensPoint = {
  x: number;
  y: number;
};

async function readLens(stage: Locator): Promise<LensPoint> {
  return stage.evaluate((element) => ({
    x: Number.parseFloat(
      (element as HTMLElement).style.getPropertyValue("--lens-x"),
    ),
    y: Number.parseFloat(
      (element as HTMLElement).style.getPropertyValue("--lens-y"),
    ),
  }));
}

function pointDistance(first: LensPoint, second: LensPoint) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

async function waitForMapFrame(page: Page) {
  await expect
    .poll(
      () =>
        page
          .frames()
          .some(
            (frame) =>
              frame !== page.mainFrame() &&
              /google\.[^/]+\/maps|google\.com\/maps/.test(frame.url()),
          ),
      { timeout: 25_000 },
    )
    .toBeTruthy();

  return page
    .frames()
    .find(
      (frame) =>
        frame !== page.mainFrame() &&
        /google\.[^/]+\/maps|google\.com\/maps/.test(frame.url()),
    );
}

test("a entrada da home é curta, variada e não bloqueia os CTAs", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const primaryCta = page
    .getByRole("link", { name: "Pedir atendimento", exact: true })
    .first();
  await expect(primaryCta).toBeVisible();
  await expect(primaryCta).toBeEnabled();

  const ctaState = await primaryCta.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      width: rect.width,
      height: rect.height,
      pointerEvents: style.pointerEvents,
    };
  });
  expect(ctaState.width).toBeGreaterThan(44);
  expect(ctaState.height).toBeGreaterThanOrEqual(44);
  expect(ctaState.pointerEvents).not.toBe("none");

  await expect(page.locator("h1")).toHaveAttribute(
    "aria-label",
    "O florescer de um novo olhar.",
  );
  await expect(page.locator(".hero-char")).toHaveCount(24);

  const entranceTiming = await page.evaluate(() => {
    const scope = document.querySelector(".home-hero");
    if (!scope) return [];
    return scope
      .getAnimations({ subtree: true })
      .map((animation) => animation.effect?.getComputedTiming().endTime ?? 0)
      .filter((endTime): endTime is number => typeof endTime === "number");
  });
  expect(entranceTiming.length).toBeGreaterThan(4);
  expect(Math.max(...entranceTiming)).toBeLessThanOrEqual(1_800);

  const revealFamilies = await page
    .locator("[data-reveal]")
    .evaluateAll((elements) =>
      Array.from(new Set(elements.map((element) => element.getAttribute("data-reveal")))),
    );
  expect(revealFamilies.length).toBeGreaterThanOrEqual(6);
});

test("a lente completa a trajetória pelo rosto e reinicia sem salto", async ({
  page,
}) => {
  test.setTimeout(32_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const stage = page.locator("[data-optical-hero]");
  await expect(stage).toHaveAttribute("data-lens-motion", "organic");
  await expect(stage).toHaveAttribute("data-lens-running", "true");

  const duration = Number(await stage.getAttribute("data-lens-duration"));
  expect(duration).toBe(15_600);
  await page.waitForTimeout(1_250);

  const samples: LensPoint[] = [await readLens(stage)];
  for (let index = 0; index < 6; index += 1) {
    await page.waitForTimeout(duration / 6);
    samples.push(await readLens(stage));
  }

  const xValues = samples.map((point) => point.x);
  const yValues = samples.map((point) => point.y);
  expect(Math.max(...xValues) - Math.min(...xValues)).toBeGreaterThan(24);
  expect(Math.max(...yValues) - Math.min(...yValues)).toBeGreaterThan(17);

  expect(
    samples.some((point) => point.x < 44 && point.y >= 30 && point.y <= 42),
  ).toBeTruthy();
  expect(
    samples.some((point) => point.x >= 45 && point.x <= 57 && point.y > 43),
  ).toBeTruthy();
  expect(
    samples.some((point) => point.x > 62 || point.y < 28),
  ).toBeTruthy();

  expect(pointDistance(samples[0], samples.at(-1) ?? samples[0])).toBeLessThan(
    5,
  );
  await expect
    .poll(
      async () => Number(await stage.getAttribute("data-lens-cycle")),
      { timeout: 4_000 },
    )
    .toBeGreaterThanOrEqual(1);
});

test("a lente pausa fora da viewport, na aba oculta e em reduced motion", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
  });
  const page = await context.newPage();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const stage = page.locator("[data-optical-hero]");
  await page.waitForTimeout(1_300);

  await page.locator("#localizacao").scrollIntoViewIfNeeded();
  await expect(stage).toHaveAttribute("data-lens-running", "false");
  const offscreenStart = await readLens(stage);
  await page.waitForTimeout(500);
  const offscreenEnd = await readLens(stage);
  expect(pointDistance(offscreenStart, offscreenEnd)).toBeLessThan(0.1);

  await stage.scrollIntoViewIfNeeded();
  await expect(stage).toHaveAttribute("data-lens-running", "true");
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(stage).toHaveAttribute("data-lens-running", "false");
  const hiddenStart = await readLens(stage);
  await page.waitForTimeout(500);
  const hiddenEnd = await readLens(stage);
  expect(pointDistance(hiddenStart, hiddenEnd)).toBeLessThan(0.1);
  await context.close();

  const touchContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const touchPage = await touchContext.newPage();
  await touchPage.goto("/", { waitUntil: "domcontentloaded" });
  const touchStage = touchPage.locator("[data-optical-hero]");
  await touchStage.scrollIntoViewIfNeeded();
  await expect(touchStage).toHaveAttribute("data-lens-motion", "organic");
  await expect(touchStage).toHaveAttribute("data-lens-duration", "17400");
  await expect(touchStage).toHaveAttribute("data-lens-running", "true");
  await touchPage.waitForTimeout(1_250);
  const touchStart = await readLens(touchStage);
  await touchPage.waitForTimeout(700);
  const touchEnd = await readLens(touchStage);
  expect(pointDistance(touchStart, touchEnd)).toBeGreaterThan(0.25);
  await touchContext.close();

  const reducedContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto("/", { waitUntil: "domcontentloaded" });
  const reducedStage = reducedPage.locator("[data-optical-hero]");
  await expect(reducedStage).toHaveAttribute("data-lens-motion", "static");
  const reducedStart = await readLens(reducedStage);
  await reducedPage.waitForTimeout(650);
  const reducedEnd = await readLens(reducedStage);
  expect(pointDistance(reducedStart, reducedEnd)).toBeLessThan(0.1);
  await reducedContext.close();
});

test("metadados de produção e números decorativos não aparecem", async ({
  page,
}) => {
  const forbidden =
    /LAB \/|Ensaio \d|Registro \d|Fragmento \/|Foco \d|VISITA \/|\d{2} \/ \d{2}/i;

  for (const route of ["/", "/instagram"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const publicText = await page.locator("body").innerText();
    expect(publicText).not.toMatch(forbidden);
    await expect(
      page.locator("figcaption").filter({ hasText: /^\s*\d+\s*$/ }),
    ).toHaveCount(0);
  }
});

test("o mapa real usa as coordenadas confirmadas e /instagram segue leve", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const iframe = page.locator("iframe[data-map-iframe]");
  await expect(iframe).toHaveCount(1);
  await expect(iframe).toHaveAttribute(
    "title",
    "Mapa da Ótica Hikari em Araguaína",
  );
  await expect(iframe).toHaveAttribute("loading", "lazy");
  await expect(iframe).toHaveAttribute(
    "src",
    /q=-7\.1922897,-48\.2094709&z=16&output=embed/,
  );
  await expect(
    page.getByRole("link", { name: /Abrir no Google Maps/ }),
  ).toHaveAttribute("href", /google\.com\/maps\/place/);
  await expect(
    page.getByRole("link", { name: /Traçar rota/ }).first(),
  ).toHaveAttribute("href", /google\.com\/maps\/place/);

  await page.goto("/instagram", { waitUntil: "domcontentloaded" });
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: /Traçar rota/ }).first(),
  ).toBeVisible();
});

test("o mapa carregado expõe zoom e aceita gesto de pan", async ({ page }) => {
  test.setTimeout(40_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const iframe = page.locator("iframe[data-map-iframe]");
  await iframe.scrollIntoViewIfNeeded();
  await expect(iframe).toBeVisible();

  const mapFrame = await waitForMapFrame(page);
  if (!mapFrame) {
    throw new Error("O frame do Google Maps não foi criado.");
  }
  await mapFrame.waitForLoadState("domcontentloaded");
  await expect
    .poll(
      () =>
        mapFrame.evaluate(
          () =>
            Array.from(document.images).filter(
              (image) => image.complete && image.naturalWidth > 0,
            ).length,
        ),
      { timeout: 20_000 },
    )
    .toBeGreaterThan(0);
  await page.screenshot({
    path: ".qa/refinement-2026-07-13/after/location-1440x900.png",
  });
  await mapFrame.locator("body").screenshot({
    path: ".qa/refinement-2026-07-13/after/map-interactive-1440.png",
  });

  let zoomLabel = "";
  await expect
    .poll(
      async () => {
        zoomLabel =
          (await mapFrame.evaluate(() => {
          const controls = Array.from(
            document.querySelectorAll<HTMLElement>(
              "button[aria-label], [role='button'][aria-label]",
            ),
          );
          const control = controls.find((element) =>
            /zoom|aumentar|ampliar/i.test(
              element.getAttribute("aria-label") ?? "",
            ),
          );
          control?.click();
          return control?.getAttribute("aria-label") ?? "";
          })) ?? "";
        return zoomLabel;
      },
      { timeout: 20_000 },
    )
    .not.toBe("");
  expect(zoomLabel).toMatch(/zoom|aumentar|ampliar/i);

  const box = await iframe.boundingBox();
  expect(box).not.toBeNull();
  const startX = (box?.x ?? 0) + (box?.width ?? 0) * 0.62;
  const startY = (box?.y ?? 0) + (box?.height ?? 0) * 0.52;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX - 70, startY + 35, { steps: 8 });
  await page.mouse.up();
});
