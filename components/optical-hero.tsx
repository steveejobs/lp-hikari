"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  type PointerEvent,
} from "react";

type OpticalHeroProps = {
  image: string;
};

type Point = {
  x: number;
  y: number;
};

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

const path: Point[] = [
  { x: 40, y: 38 },
  { x: 48, y: 47 },
  { x: 66, y: 48 },
  { x: 68, y: 30 },
  { x: 54, y: 25 },
  { x: 36, y: 32 },
];

const desktopDuration = 15_600;
const mobileDuration = 17_400;
const introDelay = 1_100;
const staticPoint = path[0];

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function catmullRom(
  previous: number,
  start: number,
  end: number,
  next: number,
  progress: number,
) {
  const progressSquared = progress * progress;
  const progressCubed = progressSquared * progress;

  return (
    0.5 *
    (2 * start +
      (-previous + end) * progress +
      (2 * previous - 5 * start + 4 * end - next) * progressSquared +
      (-previous + 3 * start - 3 * end + next) * progressCubed)
  );
}

function pointOnClosedPath(progress: number): Point {
  const scaled = progress * path.length;
  const index = Math.floor(scaled) % path.length;
  const localProgress = scaled - Math.floor(scaled);
  const previous = path[(index - 1 + path.length) % path.length];
  const start = path[index];
  const end = path[(index + 1) % path.length];
  const next = path[(index + 2) % path.length];

  return {
    x: catmullRom(previous.x, start.x, end.x, next.x, localProgress),
    y: catmullRom(previous.y, start.y, end.y, next.y, localProgress),
  };
}

export function OpticalHero({ image }: OpticalHeroProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const visibleRef = useRef(false);
  const pageVisibleRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const elapsedRef = useRef(0);
  const previousFrameRef = useRef<number | null>(null);
  const cycleRef = useRef(-1);
  const pointerRef = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
  });
  const finePointerRef = useRef(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const mobileViewport = window.matchMedia("(max-width: 767px)");
    const finePointer = window.matchMedia("(pointer: fine)");
    const saveData = Boolean(
      (navigator as NavigatorWithConnection).connection?.saveData,
    );
    let duration = mobileViewport.matches ? mobileDuration : desktopDuration;

    stage.dataset.opticalQuality = saveData ? "lite" : "full";

    const setPosition = (point: Point, phase = 0) => {
      const pointer = pointerRef.current;
      pointer.currentX += (pointer.targetX - pointer.currentX) * 0.045;
      pointer.currentY += (pointer.targetY - pointer.currentY) * 0.045;

      const x = clamp(point.x + pointer.currentX, 30, 72);
      const y = clamp(point.y + pointer.currentY, 23, 52);
      const refractX = Math.sin(phase * Math.PI * 2) * 1.8 - pointer.currentX * 0.35;
      const refractY = Math.cos(phase * Math.PI * 2) * 1.25 - pointer.currentY * 0.28;

      stage.style.setProperty("--lens-x", `${x.toFixed(3)}%`);
      stage.style.setProperty("--lens-y", `${y.toFixed(3)}%`);
      stage.style.setProperty("--refract-x", `${refractX.toFixed(3)}px`);
      stage.style.setProperty("--refract-y", `${refractY.toFixed(3)}px`);
      stage.style.setProperty("--portrait-x", `${(pointer.currentX * -0.45).toFixed(3)}px`);
      stage.style.setProperty("--portrait-y", `${(pointer.currentY * -0.38).toFixed(3)}px`);
    };

    const stop = () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      previousFrameRef.current = null;
      stage.dataset.lensRunning = "false";
    };

    const tick = (now: number) => {
      if (previousFrameRef.current === null) previousFrameRef.current = now;
      const delta = Math.min(64, now - previousFrameRef.current);
      previousFrameRef.current = now;
      elapsedRef.current += delta;

      const activeElapsed = Math.max(0, elapsedRef.current - introDelay);
      const progress = (activeElapsed % duration) / duration;
      const cycle = Math.floor(activeElapsed / duration);

      if (elapsedRef.current < introDelay) setPosition(staticPoint);
      else setPosition(pointOnClosedPath(progress), progress);

      if (cycle !== cycleRef.current) {
        cycleRef.current = cycle;
        stage.dataset.lensCycle = String(cycle);
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    const syncPlayback = () => {
      const shouldRun =
        visibleRef.current &&
        pageVisibleRef.current &&
        !reducedMotionRef.current;

      if (shouldRun && frameRef.current === null) {
        stage.dataset.lensRunning = "true";
        frameRef.current = requestAnimationFrame(tick);
      } else if (!shouldRun) {
        stop();
      }
    };

    const updatePreferences = () => {
      reducedMotionRef.current = reducedMotion.matches;
      finePointerRef.current = finePointer.matches;
      stage.dataset.lensMotion = reducedMotion.matches ? "static" : "organic";

      if (reducedMotion.matches) {
        pointerRef.current = {
          targetX: 0,
          targetY: 0,
          currentX: 0,
          currentY: 0,
        };
        setPosition(staticPoint);
      }

      syncPlayback();
    };

    const updateDuration = () => {
      duration = mobileViewport.matches ? mobileDuration : desktopDuration;
      stage.dataset.lensDuration = String(duration);
    };

    const updatePageVisibility = () => {
      pageVisibleRef.current = document.visibilityState === "visible";
      syncPlayback();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        stage.dataset.lensInViewport = entry.isIntersecting ? "true" : "false";
        syncPlayback();
      },
      {
        rootMargin: "8% 0px",
        threshold: 0.08,
      },
    );

    setPosition(staticPoint);
    updateDuration();
    updatePreferences();
    updatePageVisibility();
    observer.observe(stage);
    reducedMotion.addEventListener("change", updatePreferences);
    mobileViewport.addEventListener("change", updateDuration);
    finePointer.addEventListener("change", updatePreferences);
    document.addEventListener("visibilitychange", updatePageVisibility);
    window.addEventListener("pagehide", stop);
    document.addEventListener("freeze", stop);

    return () => {
      stop();
      observer.disconnect();
      reducedMotion.removeEventListener("change", updatePreferences);
      mobileViewport.removeEventListener("change", updateDuration);
      finePointer.removeEventListener("change", updatePreferences);
      document.removeEventListener("visibilitychange", updatePageVisibility);
      window.removeEventListener("pagehide", stop);
      document.removeEventListener("freeze", stop);
    };
  }, []);

  function influencePath(event: PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== "mouse" ||
      !finePointerRef.current ||
      reducedMotionRef.current
    ) {
      return;
    }

    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const normalizedX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const normalizedY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    pointerRef.current.targetX = clamp(normalizedX * 2.4, -2.4, 2.4);
    pointerRef.current.targetY = clamp(normalizedY * 1.7, -1.7, 1.7);
  }

  function releasePath() {
    pointerRef.current.targetX = 0;
    pointerRef.current.targetY = 0;
  }

  return (
    <figure className="optical-figure">
      <div
        ref={stageRef}
        className="optical-stage"
        data-optical-hero
        data-lens-duration={desktopDuration}
        onPointerMove={influencePath}
        onPointerLeave={releasePath}
      >
        <div className="optical-frame">
          <Image
            src={image}
            alt="Mulher usando óculos solares na Ótica Hikari"
            fill
            preload
            fetchPriority="high"
            sizes="(max-width: 767px) 82vw, (max-width: 1100px) 46vw, 520px"
            className="hero-portrait"
          />

          <div className="refracted-layer" aria-hidden="true">
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 767px) 82vw, (max-width: 1100px) 46vw, 520px"
              className="hero-portrait refracted-portrait"
            />
          </div>

          <span className="lens-orbit" aria-hidden="true">
            <span className="lens-ring" />
            <span className="lens-caustic" />
            <span className="lens-focus-dot" />
          </span>
        </div>
      </div>
      <figcaption>Uma passagem de luz muda o ponto de vista.</figcaption>
    </figure>
  );
}
