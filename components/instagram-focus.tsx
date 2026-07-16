"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type TouchEvent,
} from "react";
import type { GalleryItem } from "@/lib/galleries";
import { ArrowIcon } from "@/components/icons";
import styles from "./instagram-focus.module.css";

type InstagramFocusProps = {
  items: GalleryItem[];
};

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

const RESUME_DELAY = 6_500;
const CONTINUOUS_SPEED = 36;
const MIN_VISIBLE_RATIO = 0.62;

export function InstagramFocus({ items }: InstagramFocusProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: number; x: number; scrollLeft: number } | null>(null);
  const touchDragRef = useRef<{ x: number; scrollLeft: number } | null>(null);
  const scrollEndRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [saveData, setSaveData] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);

  const scrollTo = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const viewport = viewportRef.current;
      if (!viewport || items.length === 0) return;
      const slides = viewport.querySelectorAll<HTMLElement>("[data-gallery-slide]");
      const normalized = ((index % items.length) + items.length) % items.length;
      const target = slides[index === items.length ? items.length : normalized];
      if (!target) return;
      viewport.scrollTo({ left: target.offsetLeft, behavior });
      setActiveIndex(normalized);
    },
    [items.length],
  );

  const scheduleResume = useCallback(() => {
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => setInteractionPaused(false), RESUME_DELAY);
  }, []);

  const pauseForInteraction = useCallback(() => {
    setInteractionPaused(true);
    scheduleResume();
  }, [scheduleResume]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreferences = () => {
      setReducedMotion(motionQuery.matches);
      setSaveData(Boolean((navigator as NavigatorWithConnection).connection?.saveData));
    };
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= MIN_VISIBLE_RATIO),
      { threshold: [0, 0.35, MIN_VISIBLE_RATIO, 0.85] },
    );
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");

    updatePreferences();
    onVisibility();
    observer.observe(root);
    motionQuery.addEventListener("change", updatePreferences);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      motionQuery.removeEventListener("change", updatePreferences);
      document.removeEventListener("visibilitychange", onVisibility);
      if (resumeRef.current) clearTimeout(resumeRef.current);
      if (scrollEndRef.current) clearTimeout(scrollEndRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const running =
    visible && pageVisible && !reducedMotion && !saveData && !interactionPaused && items.length > 1;

  useEffect(() => {
    if (!running) return;
    let previousTime = performance.now();
    let position = viewportRef.current?.scrollLeft ?? 0;

    const advance = (time: number) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const slides = viewport.querySelectorAll<HTMLElement>("[data-gallery-slide]");
      const first = slides[0];
      const clone = slides[items.length];
      if (!first || !clone) return;

      const elapsed = Math.min(time - previousTime, 64);
      if (Math.abs(viewport.scrollLeft - position) > 2) position = viewport.scrollLeft;
      position += (CONTINUOUS_SPEED * elapsed) / 1_000;
      const loopPoint = Math.min(
        clone.offsetLeft,
        viewport.scrollWidth - viewport.clientWidth,
      );
      if (position >= loopPoint) {
        position = first.offsetLeft + (position - loopPoint);
      }
      viewport.scrollLeft = position;
      previousTime = time;
      animationFrameRef.current = requestAnimationFrame(advance);
    };

    animationFrameRef.current = requestAnimationFrame(advance);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    };
  }, [items.length, running]);

  function handleScroll() {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const slides = Array.from(
      viewport.querySelectorAll<HTMLElement>("[data-gallery-slide]"),
    );
    if (slides.length === 0) return;
    const closest = slides.reduce(
      (best, slide, index) => {
        const distance = Math.abs(slide.offsetLeft - viewport.scrollLeft);
        return distance < best.distance ? { index, distance } : best;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    );
    setActiveIndex(closest.index === items.length ? 0 : closest.index);

    if (!running) {
      if (scrollEndRef.current) clearTimeout(scrollEndRef.current);
      scrollEndRef.current = setTimeout(() => {
        if (closest.index === items.length) {
          viewport.scrollTo({ left: slides[0]?.offsetLeft ?? 0, behavior: "auto" });
          setActiveIndex(0);
        }
      }, 180);
    }
  }

  function beginTouch(event: TouchEvent<HTMLDivElement>) {
    pauseForInteraction();
    const touch = event.touches[0];
    if (!touch) return;
    touchDragRef.current = {
      x: touch.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
    };
  }

  function moveTouch(event: TouchEvent<HTMLDivElement>) {
    const drag = touchDragRef.current;
    const touch = event.touches[0];
    if (!drag || !touch) return;
    event.currentTarget.scrollLeft = drag.scrollLeft - (touch.clientX - drag.x);
    window.requestAnimationFrame(handleScroll);
  }

  function endTouch() {
    touchDragRef.current = null;
    scheduleResume();
  }

  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      pauseForInteraction();
      scrollTo(activeIndex === items.length - 1 ? items.length : activeIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      pauseForInteraction();
      scrollTo(activeIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      pauseForInteraction();
      scrollTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      pauseForInteraction();
      scrollTo(items.length - 1);
    }
  }

  function beginDrag(event: PointerEvent<HTMLDivElement>) {
    pauseForInteraction();
    if (event.pointerType === "touch") return;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    event.preventDefault();
    event.currentTarget.scrollLeft = drag.scrollLeft - (event.clientX - drag.x);
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.id === event.pointerId) dragRef.current = null;
    scheduleResume();
  }

  if (items.length === 0) return null;

  return (
    <div
      ref={rootRef}
      className={styles.wrap}
      data-series="04"
      data-gallery-running={running ? "true" : "false"}
      data-gallery-visible={visible ? "true" : "false"}
      data-gallery-reduced={reducedMotion ? "true" : "false"}
      data-gallery-paused={interactionPaused ? "true" : "false"}
      data-gallery-mode="continuous"
      data-active-item={items[activeIndex]?.id}
    >
      <div
        ref={viewportRef}
        className={styles.viewport}
        tabIndex={0}
        role="region"
        aria-roledescription="galeria"
        aria-label="Seleção editorial de óculos solares. Deslize, arraste ou use as setas."
        onKeyDown={handleKey}
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onTouchStart={beginTouch}
        onTouchMove={moveTouch}
        onTouchEnd={endTouch}
        onTouchCancel={endTouch}
        onScroll={handleScroll}
        onWheel={pauseForInteraction}
      >
        <div className={styles.track}>
          {[...items, items[0]].map((item, index) => {
            const clone = index === items.length;
            return (
              <figure
                className={styles.slide}
                data-gallery-slide
                data-series-item={clone ? undefined : item.id}
                data-active={!clone && index === activeIndex ? "true" : "false"}
                aria-hidden={clone ? "true" : undefined}
                key={clone ? `${item.id}-loop` : item.id}
              >
                <Image
                  src={item.src}
                  alt={clone ? "" : item.alt}
                  fill
                  preload={index === 0}
                  loading={index === 0 ? undefined : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  sizes="(max-width: 540px) 76vw, (max-width: 900px) 52vw, 360px"
                  className={styles.image}
                  draggable={false}
                />
              </figure>
            );
          })}
          <span className={styles.endSpace} aria-hidden="true" />
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.arrows}>
          <button
            type="button"
            onClick={() => {
              pauseForInteraction();
              scrollTo(activeIndex - 1);
            }}
            aria-label="Imagem anterior"
          >
            <ArrowIcon />
          </button>
          <button
            type="button"
            onClick={() => {
              pauseForInteraction();
              scrollTo(activeIndex === items.length - 1 ? items.length : activeIndex + 1);
            }}
            aria-label="Próxima imagem"
          >
            <ArrowIcon />
          </button>
        </div>

        <div className={styles.progress} aria-label="Escolher imagem">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              data-active={index === activeIndex}
              onClick={() => {
                pauseForInteraction();
                scrollTo(index);
              }}
              aria-label={`Mostrar ${item.alt}`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <span />
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {items[activeIndex]?.alt}
      </p>
    </div>
  );
}
