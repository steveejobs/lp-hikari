import { chromium } from "@playwright/test";
import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.PREVIEW_URL ?? "http://127.0.0.1:3100";
const evidenceDir = path.resolve(
  ".qa",
  "refinement-2026-07-13",
  "after",
);
const rawVideoDir = path.join(evidenceDir, ".lens-video");
const videoTarget = path.join(evidenceDir, "lens-cycle-1440x900.webm");
const trajectoryTarget = path.join(evidenceDir, "lens-trajectory.json");

await mkdir(rawVideoDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  colorScheme: "dark",
  recordVideo: {
    dir: rawVideoDir,
    size: { width: 1440, height: 900 },
  },
});
const page = await context.newPage();
const video = page.video();

await page.goto(baseURL, { waitUntil: "domcontentloaded" });
const stage = page.locator("[data-optical-hero]");
await stage.waitFor({ state: "visible" });
await page.waitForTimeout(1_250);

const duration = Number(await stage.getAttribute("data-lens-duration"));
const sampleInterval = 240;
const samples = [];
const sampleStart = Date.now();
let cycleCompletedAt = null;

while (
  Date.now() - sampleStart <= duration + 6_000 &&
  (cycleCompletedAt === null || Date.now() - cycleCompletedAt < 720)
) {
  const sample = await stage.evaluate((element, elapsed) => ({
      elapsed,
      x: Number.parseFloat(
        element.style.getPropertyValue("--lens-x"),
      ),
      y: Number.parseFloat(
        element.style.getPropertyValue("--lens-y"),
      ),
      cycle: Number(element.getAttribute("data-lens-cycle") ?? 0),
      running: element.getAttribute("data-lens-running") === "true",
    }), Date.now() - sampleStart);
  samples.push(sample);
  if (sample.cycle >= 1 && cycleCompletedAt === null) {
    cycleCompletedAt = Date.now();
  }
  await page.waitForTimeout(sampleInterval);
}

const xValues = samples.map((sample) => sample.x);
const yValues = samples.map((sample) => sample.y);
const distance = (first, second) =>
  Math.hypot(first.x - second.x, first.y - second.y);
const restartSample = samples.find((sample) => sample.cycle >= 1);
const metrics = {
  route: "/",
  viewport: { width: 1440, height: 900 },
  duration,
  sampleInterval,
  sampleCount: samples.length,
  xRange: Math.max(...xValues) - Math.min(...xValues),
  yRange: Math.max(...yValues) - Math.min(...yValues),
  loopDistance: restartSample ? distance(samples[0], restartSample) : null,
  completedCycles: Math.max(...samples.map((sample) => sample.cycle)),
  interestPoints: {
    glasses: samples.some(
      ({ x, y }) => x < 44 && y >= 30 && y <= 42,
    ),
    cheek: samples.some(
      ({ x, y }) => x >= 45 && x <= 57 && y > 43,
    ),
    hair: samples.some(({ x, y }) => x > 62 || y < 28),
  },
  alwaysRunning: samples.every((sample) => sample.running),
  samples,
};

await writeFile(trajectoryTarget, `${JSON.stringify(metrics, null, 2)}\n`, "utf8");
await page.close();
await context.close();

if (!video) {
  throw new Error("O Playwright não criou o vídeo da trajetória.");
}

const rawVideo = await video.path();
await rm(videoTarget, { force: true });
await rename(rawVideo, videoTarget);
await rm(rawVideoDir, { recursive: true, force: true });
await browser.close();

if (
  metrics.xRange <= 24 ||
  metrics.yRange <= 17 ||
  metrics.completedCycles < 1 ||
  metrics.loopDistance === null ||
  metrics.loopDistance >= 5 ||
  !Object.values(metrics.interestPoints).every(Boolean) ||
  !metrics.alwaysRunning
) {
  throw new Error("A gravação não comprovou toda a trajetória esperada.");
}

console.log(
  JSON.stringify(
    {
      video: path.relative(process.cwd(), videoTarget),
      trajectory: path.relative(process.cwd(), trajectoryTarget),
      duration: metrics.duration,
      xRange: metrics.xRange,
      yRange: metrics.yRange,
      completedCycles: metrics.completedCycles,
      interestPoints: metrics.interestPoints,
    },
    null,
    2,
  ),
);
