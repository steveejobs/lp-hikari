import { expect, test, type Page } from "@playwright/test";

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

test("os traços de luz se movem fora do retrato sem duplicar ou recortar a imagem", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const stage = page.locator("[data-light-trail-hero]");
  await expect(stage).toBeVisible();
  await expect(stage.locator(".hero-light-path")).toHaveCount(3);
  await expect(stage.locator("img")).toHaveCount(1);
  await expect(page.locator(".refracted-layer, .lens-orbit")).toHaveCount(0);

  const imageState = await stage.locator("img").evaluate((image) => ({
    fit: getComputedStyle(image).objectFit,
    naturalRatio: (image as HTMLImageElement).naturalWidth / (image as HTMLImageElement).naturalHeight,
    frameRatio: image.parentElement!.clientWidth / image.parentElement!.clientHeight,
  }));
  expect(imageState.fit).toBe("contain");
  expect(Math.abs(imageState.naturalRatio - imageState.frameRatio)).toBeLessThan(0.01);

  const trails = stage.locator(".hero-light-trails");
  const startTransform = await trails.evaluate((element) => getComputedStyle(element).transform);
  await page.waitForTimeout(400);
  const endTransform = await trails.evaluate((element) => getComputedStyle(element).transform);
  expect(endTransform).not.toBe(startTransform);
});

test("movimento reduzido mantém retratos completos e traços estáticos", async ({ browser }) => {
  const reducedContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto("/", { waitUntil: "domcontentloaded" });
  const reducedStage = reducedPage.locator("[data-light-trail-hero]");
  const path = reducedStage.locator(".hero-light-path-primary");
  const duration = await path.evaluate((element) => getComputedStyle(element).animationDuration);
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.01);
  await expect(reducedStage.locator("img")).toHaveCSS("object-fit", "contain");
  await expect(reducedPage.locator('[data-reveal="light-concentrate"] img')).toHaveCSS("object-fit", "contain");
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
