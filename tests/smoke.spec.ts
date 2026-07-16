import { expect, test, type Browser } from "@playwright/test";

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

async function openIsolated(browser: Browser, route: string, viewport: { width: number; height: number }) {
  const context = await browser.newContext({ viewport, colorScheme: "dark" });
  const page = await context.newPage();
  const errors: string[] = [];
  const failures: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("requestfailed", (request) => {
    const message = request.failure()?.errorText ?? "unknown";
    if (!message.includes("ERR_ABORTED")) failures.push(`${message} ${request.url()}`);
  });
  const response = await page.goto(route, { waitUntil: "domcontentloaded" });
  return { context, page, errors, failures, response };
}

for (const route of ["/", "/instagram"]) {
  for (const viewport of viewports) {
    test(`${route} respeita o contrato em ${viewport.width}x${viewport.height}`, async ({ browser }) => {
      const { context, page, errors, failures, response } = await openIsolated(browser, route, viewport);
      expect(response?.ok()).toBeTruthy();
      await expect(page.locator("h1")).toHaveCount(1);

      const metrics = await page.evaluate(() => {
        const media = [...document.querySelectorAll("img, video")];
        const smallTargets = [...document.querySelectorAll<HTMLElement>("a, button, summary")]
          .filter((element) => !element.classList.contains("skip-link"))
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none" && (rect.width < 44 || rect.height < 44);
          })
          .map((element) => ({ text: element.textContent?.trim().slice(0, 80), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height }));
        return {
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
          zeroMedia: media.filter((element) => {
            const rect = element.getBoundingClientRect();
            return rect.width === 0 || rect.height === 0;
          }).length,
          brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).length,
          smallTargets,
        };
      });

      expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth);
      expect(metrics.zeroMedia).toBe(0);
      expect(metrics.brokenImages).toBe(0);
      expect(metrics.smallTargets).toEqual([]);

      if (route === "/instagram") {
        const box = await page.locator('a[href*="api.whatsapp.com"]').first().boundingBox();
        expect(box).not.toBeNull();
        expect((box?.y ?? viewport.height) + (box?.height ?? 0)).toBeLessThan(viewport.height);
      }

      expect(errors).toEqual([]);
      expect(failures).toEqual([]);
      await context.close();
    });
  }
}

test("metadata, dados locais e links são factuais", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-brand-icon]")).toHaveCount(4);
  await expect(page.locator("body")).not.toContainText("\u5149");
  await expect(page).toHaveTitle(/Ótica Hikari.*Araguaína/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Óculos solares e receituários/);
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(new URL(canonical ?? "http://invalid").pathname).toBe("/");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Ótica Hikari/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
  await expect(page.locator('link[rel="icon"]')).toHaveCount(1);

  const structured = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? "{}");
  expect(structured["@type"]).toBe("LocalBusiness");
  expect(structured.name).toBe("Ótica Hikari");
  expect(structured.address.streetAddress).toContain("19 de Novembro");
  expect(structured.telephone).toBe("+5563984565924");

  const whatsappHref = await page.getByRole("link", { name: /Pedir atendimento/ }).first().getAttribute("href");
  expect(new URL(whatsappHref ?? "http://invalid").searchParams.get("text")).toContain("Vim pelo site da Ótica Hikari");
  expect(whatsappHref).toContain("utm_source=website");
  const mapHref = await page.getByRole("link", { name: /Traçar rota/ }).first().getAttribute("href");
  expect(mapHref).toContain("google.com/maps/place");

  await page.goto("/instagram", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-brand-icon]")).toHaveCount(2);
  await expect(page.locator("body")).not.toContainText("\u5149");
  const instagramWhatsApp = await page.getByRole("link", { name: /Falar no WhatsApp/ }).first().getAttribute("href");
  expect(new URL(instagramWhatsApp ?? "http://invalid").searchParams.get("text")).toContain("Vim pelo Instagram da Ótica Hikari");
  expect(instagramWhatsApp).toContain("utm_source=instagram");
  const instagramCanonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(new URL(instagramCanonical ?? "http://invalid").pathname).toBe("/instagram");
});

test("as séries permanecem separadas e ordenadas", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-series="01"] [data-series-item]')).toHaveCount(10);
  expect(await page.locator('[data-series="01"] [data-series-item]').evaluateAll((items) => items.map((item) => item.getAttribute("data-series-item")))).toEqual(["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"]);
  expect(await page.locator('[data-series="02"][data-series-item]').evaluateAll((items) => items.map((item) => item.getAttribute("data-series-item")))).toEqual(["01", "02"]);
  expect(await page.locator('[data-series="03"] [data-series-item]').evaluateAll((items) => items.map((item) => item.getAttribute("data-series-item")))).toEqual(["01", "02", "03", "04"]);
  expect(await page.locator('[data-series="04"][data-series-item]').evaluateAll((items) => items.map((item) => item.getAttribute("data-series-item")))).toEqual(["01", "02", "03", "04", "05", "06"]);
  await expect(page.getByText(/Ray-Ban|Versace|Tom Ford|Swarovski/i)).toHaveCount(0);
});

test("galerias respondem a teclado e interação", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const carousel = page.locator('[data-series="01"]');
  await carousel.scrollIntoViewIfNeeded();
  const track = carousel.locator('[aria-label*="Use as setas"]');
  await track.focus();
  await page.keyboard.press("ArrowRight");
  await expect(carousel.locator('[aria-live="polite"]')).toHaveText(/Imagem 2 de 10/);

  await track.evaluate((element) => element.scrollTo({ left: 0, behavior: "auto" }));
  await page.waitForTimeout(350);
  const trackBox = await track.boundingBox();
  expect(trackBox).not.toBeNull();
  const dragY = (trackBox?.y ?? 0) + Math.min(180, (trackBox?.height ?? 0) * 0.45);
  const dragStart = (trackBox?.x ?? 0) + (trackBox?.width ?? 0) * 0.78;
  const dragEnd = (trackBox?.x ?? 0) + (trackBox?.width ?? 0) * 0.22;
  await page.mouse.move(dragStart, dragY);
  await page.mouse.down();
  await page.mouse.move(dragEnd, dragY, { steps: 8 });
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(80);
  await page.mouse.up();

  const focusGallery = page.locator('[data-series="03"]');
  await focusGallery.scrollIntoViewIfNeeded();
  await focusGallery.locator('[tabindex="0"]').focus();
  await page.keyboard.press("End");
  await expect(focusGallery.locator('[aria-live="polite"]')).toContainText("Perfil com óculos solares de haste clara");

  await page.goto("/instagram", { waitUntil: "domcontentloaded" });
  const instagramFocus = page.locator('[data-series="04"]');
  await instagramFocus.locator('[role="region"]').focus();
  await page.keyboard.press("ArrowRight");
  await expect(instagramFocus.locator('[data-series-item="02"]')).toHaveAttribute("data-active", "true");
});

test("autoplay pausa durante a interação e retoma depois", async ({ page }) => {
  test.setTimeout(55_000);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const carousel = page.locator('[data-series="01"]');
  const status = carousel.locator('[aria-live="polite"]');
  const track = carousel.locator('[aria-label*="Use as setas"]');
  const readStatus = async () => (await status.textContent())?.replace(/\s+/g, " ").trim();

  await carousel.scrollIntoViewIfNeeded();
  const initial = await readStatus();
  await expect.poll(readStatus, { timeout: 7_500 }).not.toBe(initial);

  await track.focus();
  const beforeInteraction = await readStatus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(readStatus).not.toBe(beforeInteraction);
  const afterInteraction = await readStatus();
  await page.waitForTimeout(6_000);
  expect(await readStatus()).toBe(afterInteraction);
  await expect.poll(readStatus, { timeout: 9_500 }).not.toBe(afterInteraction);
});

test("gestos touch mudam o foco sem depender de hover", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto("/instagram", { waitUntil: "domcontentloaded" });
  const stage = page.locator('[data-series="04"] [role="region"]');
  await expect(page.locator("html")).toHaveAttribute(
    "data-motion-mode",
    "css",
  );
  await expect(stage).toBeVisible();
  const box = await stage.boundingBox();
  expect(box).not.toBeNull();

  const client = await context.newCDPSession(page);
  const y = (box?.y ?? 0) + (box?.height ?? 0) * 0.5;
  const startX = (box?.x ?? 0) + (box?.width ?? 0) * 0.78;
  const endX = (box?.x ?? 0) + (box?.width ?? 0) * 0.24;
  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: startX, y }],
  });
  await client.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: endX, y }],
  });
  await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(page.locator('[data-series="04"] [data-series-item="02"]')).toHaveAttribute("data-active", "true");
  await context.close();
});

test("resize entre desktop, mobile e tablet preserva o layout", async ({ page }) => {
  for (const route of ["/", "/instagram"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 360, height: 800 },
      { width: 768, height: 1024 },
    ]) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(120);
      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        zeroMedia: [...document.querySelectorAll("img, video")].filter((media) => {
          const rect = media.getBoundingClientRect();
          return rect.width === 0 || rect.height === 0;
        }).length,
      }));
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
      expect(metrics.zeroMedia).toBe(0);
    }
  }
});

test("conexão lenta mantém conteúdo e espaço do hero", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route("**/_next/image**", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 650));
    await route.continue();
  });
  const page = await context.newPage();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByRole("link", { name: /Pedir atendimento/ }).first()).toBeVisible();
  const frame = page.locator(".optical-frame");
  await expect(frame).toBeVisible();
  const box = await frame.boundingBox();
  expect(box?.width).toBeGreaterThan(250);
  expect(box?.height).toBeGreaterThan(300);
  await context.close();
});

test("reduced motion preserva conteúdo e mantém vídeos em poster", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByRole("link", { name: /Pedir atendimento/ }).first()).toBeVisible();
  await page.locator("video").first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  expect(await page.locator("video").evaluateAll((videos) => videos.every((video) => (video as HTMLVideoElement).paused))).toBeTruthy();
  await expect(page.getByText("Versão estática para reduzir movimento")).toHaveCount(2);
  await context.close();
});

test("saveData impede autoplay e download antecipado do vídeo", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "connection", { configurable: true, value: { saveData: true } });
  });
  const page = await context.newPage();
  const videoRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith(".mp4")) videoRequests.push(request.url());
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-light-trail-hero] img")).toHaveCSS("object-fit", "contain");
  await page.locator("video").first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  expect(await page.locator("video").first().evaluate((video) => (video as HTMLVideoElement).paused)).toBeTruthy();
  expect(videoRequests).toEqual([]);
  await context.close();
});

test("um vídeo por vez e pausa ao perder visibilidade da aba", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const videos = page.locator("video");
  expect(await videos.evaluateAll((items) => items.every((item) => {
    const video = item as HTMLVideoElement;
    return video.muted && video.playsInline && video.loop && video.preload === "none" && Boolean(video.poster);
  }))).toBeTruthy();
  await videos.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1600);
  expect(await videos.first().evaluate((video) => !(video as HTMLVideoElement).paused)).toBeTruthy();

  await page.locator("h1").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  expect(await videos.first().evaluate((video) => (video as HTMLVideoElement).paused)).toBeTruthy();

  await videos.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1600);
  expect(await videos.first().evaluate((video) => !(video as HTMLVideoElement).paused)).toBeTruthy();

  await page.getByRole("button", { name: /Reproduzir Fragmento/ }).click();
  await page.waitForTimeout(500);
  expect(await videos.first().evaluate((video) => (video as HTMLVideoElement).paused)).toBeTruthy();
  expect(await videos.nth(1).evaluate((video) => !(video as HTMLVideoElement).paused)).toBeTruthy();

  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(400);
  expect(await videos.nth(1).evaluate((video) => (video as HTMLVideoElement).paused)).toBeTruthy();
});

test("conteúdo essencial existe sem JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText(/O florescer/);
  await expect(page.getByText(/Rua 19 de Novembro/).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Pedir atendimento", exact: true })).toBeVisible();
  await page.goto("/instagram");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByRole("link", { name: /Falar no WhatsApp/ })).toBeVisible();
  await context.close();
});

test("falha de imagem não desmonta o hero", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route("**/_next/image**", (route) => route.abort());
  const page = await context.newPage();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const frame = page.locator(".optical-frame");
  await expect(frame).toBeVisible();
  const box = await frame.boundingBox();
  expect(box?.width).toBeGreaterThan(250);
  expect(box?.height).toBeGreaterThan(300);
  await expect(page.getByRole("link", { name: /Pedir atendimento/ }).first()).toBeVisible();
  await context.close();
});
