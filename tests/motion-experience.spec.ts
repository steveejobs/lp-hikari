import { expect, test } from "@playwright/test";

test("vídeos da home rodam juntos, mudos e sem controles", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const videos = page.locator("video[data-ambient-video]");
  await expect(videos).toHaveCount(2);
  await videos.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1_800);

  const state = await videos.evaluateAll((items) => items.map((item) => {
    const video = item as HTMLVideoElement;
    return {
      autoplay: video.autoplay,
      controls: video.controls,
      loop: video.loop,
      muted: video.muted,
      paused: video.paused,
      playsInline: video.playsInline,
    };
  }));

  expect(state.every((video) => video.autoplay && !video.controls && video.loop && video.muted && !video.paused && video.playsInline)).toBeTruthy();
});

test("reduced motion pausa vídeos e mantém todo o conteúdo visível", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(600);

  expect(await page.locator("video[data-ambient-video]").evaluateAll((videos) =>
    videos.every((video) => (video as HTMLVideoElement).paused),
  )).toBeTruthy();
  await expect(page.locator("html")).toHaveAttribute("data-motion-ready", "lite");
  await context.close();
});

test("carrosséis avançam automaticamente e pausam após interação", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const carousel = page.locator('[data-series="01"][data-auto-carousel]');
  const track = carousel.locator("[data-carousel-track]");
  await carousel.scrollIntoViewIfNeeded();
  await expect(carousel).toHaveAttribute("data-carousel-running", "true");
  const initial = await track.evaluate((element) => element.scrollLeft);
  await expect.poll(() => track.evaluate((element) => element.scrollLeft), { timeout: 4_500 }).toBeGreaterThan(initial + 80);

  await track.dispatchEvent("pointerdown", { pointerType: "touch", pointerId: 1 });
  const pausedAt = await track.evaluate((element) => element.scrollLeft);
  await page.waitForTimeout(3_100);
  expect(Math.abs((await track.evaluate((element) => element.scrollLeft)) - pausedAt)).toBeLessThan(8);
});

test("seções recebem entrada, saída e interação de mouse", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const section = page.locator("#ensaios");
  await section.scrollIntoViewIfNeeded();
  await expect(section.locator('[data-reveal="brand-statement"]')).toHaveAttribute("data-reveal-state", "visible");
  await page.locator("#localizacao").scrollIntoViewIfNeeded();
  await expect(section.locator('[data-reveal="brand-statement"]')).toHaveAttribute("data-reveal-state", "exiting-up");

  const card = page.locator("[data-pointer-glow]").first();
  await card.scrollIntoViewIfNeeded();
  const box = await card.boundingBox();
  expect(box).not.toBeNull();
  await expect(card).toHaveAttribute("data-pointer-ready", "true");
  await card.dispatchEvent("pointermove", {
    clientX: (box?.x ?? 0) + (box?.width ?? 0) * 0.8,
    clientY: (box?.y ?? 0) + (box?.height ?? 0) * 0.25,
    pointerType: "mouse",
  });
  await expect.poll(() => card.evaluate((element) => getComputedStyle(element).getPropertyValue("--pointer-x").trim())).not.toBe("50%");
});

test("instagram não sobrepõe títulos, legendas ou cards às imagens", async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/instagram", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#instagram-title")).toBeVisible();

    const heroLines = await page.locator("#instagram-title").evaluate((heading) => {
      const first = heading.childNodes[0];
      const range = document.createRange();
      range.selectNode(first);
      const firstRect = range.getBoundingClientRect();
      const secondRect = heading.querySelector("em")!.getBoundingClientRect();
      return { firstBottom: firstRect.bottom, secondTop: secondRect.top };
    });
    expect(heroLines.secondTop).toBeGreaterThanOrEqual(heroLines.firstBottom - 1);

    const preview = await page.locator('[aria-label="Seleção visual da Ótica Hikari"]').evaluate((card) => {
      const grid = card.firstElementChild!.getBoundingClientRect();
      const caption = card.lastElementChild!.getBoundingClientRect();
      return { gridBottom: grid.bottom, captionTop: caption.top };
    });
    expect(preview.captionTop).toBeGreaterThanOrEqual(preview.gridBottom);

    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
  }
});
