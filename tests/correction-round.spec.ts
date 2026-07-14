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

async function galleryState(page: Page) {
  const gallery = page.locator('[data-series="04"]');
  return {
    item: await gallery.getAttribute("data-active-item"),
    running: await gallery.getAttribute("data-gallery-running"),
    paused: await gallery.getAttribute("data-gallery-paused"),
  };
}

test("o H1 preserva palavras, espaços, linhas e uma frase acessível", async ({
  page,
}) => {
  for (const viewport of [viewports[0], viewports[4], viewports[7]]) {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const title = page.locator("h1#hero-title");
    await expect(title).toHaveAttribute("aria-label", "O florescer de um novo olhar.");
    const lines = title.locator(".hero-title-line");
    await expect(lines).toHaveCount(2);
    expect((await lines.nth(0).textContent())?.replace(/\s+/g, " ").trim()).toBe(
      "O florescer",
    );
    expect((await lines.nth(1).textContent())?.replace(/\s+/g, " ").trim()).toBe(
      "de um novo olhar.",
    );
    await expect(title.locator(".hero-word")).toHaveCount(6);
    await expect(title.locator(".hero-char")).toHaveCount(24);
    await page.waitForTimeout(1_050);

    const geometry = await lines.evaluateAll((elements) =>
      elements.map((line) => {
        const words = Array.from(line.querySelectorAll<HTMLElement>(".hero-word"));
        const rects = words.map((word) => word.getBoundingClientRect());
        return {
          display: getComputedStyle(line).display,
          gaps: rects.slice(1).map((rect, index) => rect.left - rects[index].right),
          singleBaseline: rects.every((rect) => Math.abs(rect.top - rects[0].top) < 1),
          contained: rects.every((rect) => rect.right <= innerWidth + 0.5),
        };
      }),
    );
    expect(geometry.every((line) => line.display === "flex")).toBeTruthy();
    expect(geometry.every((line) => line.gaps.every((gap) => gap > 2))).toBeTruthy();
    expect(geometry.every((line) => line.singleBaseline && line.contained)).toBeTruthy();
  }
});

test("o H1 continua correto sem JavaScript e simplifica em reduced motion", async ({
  browser,
}) => {
  const noScript = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const noScriptPage = await noScript.newPage();
  await noScriptPage.goto("/");
  await expect(noScriptPage.locator("h1#hero-title")).toHaveAttribute(
    "aria-label",
    "O florescer de um novo olhar.",
  );
  await expect(noScriptPage.locator(".hero-title-line").nth(0)).toHaveText("O florescer");
  await expect(noScriptPage.locator(".hero-title-line").nth(1)).toHaveText(
    "de um novo olhar.",
  );
  await noScript.close();

  const reduced = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 390, height: 844 },
  });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto("/");
  const animations = await reducedPage
    .locator(".hero-char")
    .evaluateAll((characters) =>
      characters.map((character) => Number.parseFloat(getComputedStyle(character).animationDuration)),
    );
  expect(animations.every((duration) => duration <= 0.001)).toBeTruthy();
  await reduced.close();
});

test("a galeria inicia na viewport, pausa na interação e retoma", async ({ page }) => {
  test.setTimeout(38_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/instagram", { waitUntil: "domcontentloaded" });
  const gallery = page.locator('[data-series="04"]');
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery).toHaveAttribute("data-gallery-running", "true");

  const initial = (await galleryState(page)).item;
  await expect
    .poll(async () => (await galleryState(page)).item, { timeout: 10_000 })
    .not.toBe(initial);

  await gallery.getByRole("button", { name: "Próxima imagem" }).click();
  await expect(gallery).toHaveAttribute("data-gallery-paused", "true");
  await page.waitForTimeout(900);
  const afterInteraction = (await galleryState(page)).item;
  await page.waitForTimeout(5_000);
  expect((await galleryState(page)).item).toBe(afterInteraction);
  await expect
    .poll(async () => (await galleryState(page)).paused, { timeout: 3_000 })
    .toBe("false");
  await expect
    .poll(async () => (await galleryState(page)).item, { timeout: 10_000 })
    .not.toBe(afterInteraction);

  await page.locator("[data-instagram-video]").scrollIntoViewIfNeeded();
  await expect(gallery).toHaveAttribute("data-gallery-running", "false");
});

test("a galeria fecha o ciclo sem salto visual e pausa com a aba oculta", async ({
  page,
}) => {
  test.setTimeout(26_000);
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto("/instagram", { waitUntil: "domcontentloaded" });
  const gallery = page.locator('[data-series="04"]');
  await gallery.scrollIntoViewIfNeeded();
  const viewport = gallery.locator('[role="region"]');
  await viewport.evaluate((element) => {
    const slides = element.querySelectorAll<HTMLElement>("[data-gallery-slide]");
    element.scrollTo({ left: (slides[6]?.offsetLeft ?? 12) - 12, behavior: "auto" });
  });
  await expect(gallery).toHaveAttribute("data-gallery-running", "true");
  await expect(gallery).toHaveAttribute("data-active-item", "01");
  await expect
    .poll(
      () => viewport.evaluate((element) => element.scrollLeft),
      { timeout: 2_500 },
    )
    .toBeLessThan(20);

  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(gallery).toHaveAttribute("data-gallery-running", "false");
});

test("a galeria fica estática em reduced motion", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("/instagram", { waitUntil: "domcontentloaded" });
  const gallery = page.locator('[data-series="04"]');
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery).toHaveAttribute("data-gallery-reduced", "true");
  await expect(gallery).toHaveAttribute("data-gallery-running", "false");
  const item = await gallery.getAttribute("data-active-item");
  await page.waitForTimeout(6_000);
  expect(await gallery.getAttribute("data-active-item")).toBe(item);
  await context.close();
});

test("o vídeo editorial usa poster, lifecycle e configuração leve", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/instagram", { waitUntil: "domcontentloaded" });
  const frame = page.locator("[data-instagram-video]");
  const video = frame.locator("video");
  await expect(video).toHaveAttribute("src", "/video/selection.mp4");
  await expect(video).toHaveAttribute("poster", "/video/selection-poster.jpg");
  await expect(video).toHaveAttribute("preload", "metadata");
  await expect(video).toHaveJSProperty("muted", true);
  await expect(video).toHaveJSProperty("loop", true);
  await expect(video).toHaveJSProperty("playsInline", true);
  await expect(video).not.toHaveAttribute("controls", "");
  expect(await video.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(180);

  expect(await video.evaluate((element) => (element as HTMLVideoElement).paused)).toBeTruthy();
  await frame.scrollIntoViewIfNeeded();
  await expect
    .poll(() => video.evaluate((element) => !(element as HTMLVideoElement).paused))
    .toBeTruthy();
  await page.locator("h1").scrollIntoViewIfNeeded();
  await expect
    .poll(() => video.evaluate((element) => (element as HTMLVideoElement).paused))
    .toBeTruthy();
});

test("reduced motion e saveData mantêm o vídeo no poster", async ({ browser }) => {
  const reduced = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto("/instagram");
  const reducedFrame = reducedPage.locator("[data-instagram-video] > div");
  await reducedFrame.scrollIntoViewIfNeeded();
  await expect(reducedFrame).toHaveAttribute("data-video-reduced", "true");
  await expect(reducedFrame.locator("video")).toHaveAttribute("preload", "none");
  expect(
    await reducedFrame
      .locator("video")
      .evaluate((element) => (element as HTMLVideoElement).paused),
  ).toBeTruthy();
  await reduced.close();

  const requests: string[] = [];
  const saveData = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await saveData.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true },
    });
  });
  const saveDataPage = await saveData.newPage();
  saveDataPage.on("request", (request) => {
    if (request.url().includes("selection.mp4")) requests.push(request.url());
  });
  await saveDataPage.goto("/instagram");
  const saveFrame = saveDataPage.locator("[data-instagram-video] > div");
  await saveFrame.scrollIntoViewIfNeeded();
  await expect(saveFrame).toHaveAttribute("data-video-save-data", "true");
  await saveDataPage.waitForTimeout(900);
  expect(requests).toEqual([]);
  expect(
    await saveFrame
      .locator("video")
      .evaluate((element) => (element as HTMLVideoElement).paused),
  ).toBeTruthy();
  await saveData.close();
});

test("solar e receituário possuem mensagens contextuais distintas", async ({ page }) => {
  await page.goto("/instagram", { waitUntil: "domcontentloaded" });
  const prescription = page.getByRole("link", { name: "Quero óculos de grau" });
  const solar = page.getByRole("link", { name: "Quero óculos solar" });
  await expect(prescription).toBeVisible();
  await expect(solar).toBeVisible();
  const prescriptionText = new URL((await prescription.getAttribute("href")) ?? "").searchParams.get(
    "text",
  );
  const solarText = new URL((await solar.getAttribute("href")) ?? "").searchParams.get("text");
  expect(prescriptionText).toBe(
    "Olá! Vim pelo Instagram da Ótica Hikari e quero atendimento para escolher meus óculos de grau.",
  );
  expect(solarText).toBe(
    "Olá! Vim pelo Instagram da Ótica Hikari e quero atendimento para escolher meus óculos solar.",
  );
  expect(prescriptionText).not.toBe(solarText);
});

test("os oito viewports preservam conversão, mídia e ausência de overflow", async ({
  page,
}) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/instagram", { waitUntil: "domcontentloaded" });
    const metrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      videos: Array.from(document.querySelectorAll("video")).every((video) => {
        const rect = video.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }),
    }));
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
    expect(metrics.videos).toBeTruthy();
    const whatsapp = page.getByRole("link", { name: "Falar no WhatsApp" });
    const box = await whatsapp.boundingBox();
    expect(box?.y).toBeLessThan(viewport.height);
    await expect(page.getByRole("link", { name: "Traçar rota" })).toBeVisible();
  }
});
