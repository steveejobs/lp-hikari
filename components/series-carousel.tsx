"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type UIEvent,
} from "react";
import type { GalleryItem } from "@/lib/galleries";
import { ArrowIcon } from "@/components/icons";
import styles from "./series-carousel.module.css";

type SeriesCarouselProps = {
  items: GalleryItem[];
  label: string;
  autoplayInterval?: number;
};

type DragState = {
  active: boolean;
  pointerId: number;
  startX: number;
  startScroll: number;
};

export function SeriesCarousel({ items, label, autoplayInterval = 5200 }: SeriesCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const dragRef = useRef<DragState>({ active: false, pointerId: -1, startX: 0, startScroll: 0 });
  const scrollFrameRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const directionRef = useRef<1 | -1>(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pausedByUser, setPausedByUser] = useState(false);

  const goTo = useCallback(
    (nextIndex: number, behavior?: ScrollBehavior) => {
      const track = trackRef.current;
      const slide = slideRefs.current[nextIndex];
      if (!track || !slide) return;
      const resolvedBehavior = behavior ?? (reducedMotion ? "auto" : "smooth");
      track.scrollTo({ left: slide.offsetLeft, behavior: resolvedBehavior });
      setCurrentIndex(nextIndex);
    },
    [reducedMotion],
  );

  const pauseForInteraction = useCallback(() => {
    setPausedByUser(true);
    if (resumeTimerRef.current !== null) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => setPausedByUser(false), 7600);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    const updateVisibility = () => setPageVisible(document.visibilityState === "visible");
    updateMotion();
    updateVisibility();
    motionQuery.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      motionQuery.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !pageVisible || reducedMotion || pausedByUser || items.length < 2) return;
    const timer = window.setTimeout(() => {
      let next = currentIndex + directionRef.current;
      if (next >= items.length) {
        directionRef.current = -1;
        next = Math.max(0, items.length - 2);
      } else if (next < 0) {
        directionRef.current = 1;
        next = Math.min(items.length - 1, 1);
      }
      goTo(next);
    }, autoplayInterval);
    return () => window.clearTimeout(timer);
  }, [autoplayInterval, currentIndex, goTo, isVisible, items.length, pageVisible, pausedByUser, reducedMotion]);

  useEffect(() => {
    return () => {
      if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
      if (resumeTimerRef.current !== null) window.clearTimeout(resumeTimerRef.current);
    };
  }, []);

  function updateIndexFromScroll(event: UIEvent<HTMLDivElement>) {
    const track = event.currentTarget;
    if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
    scrollFrameRef.current = requestAnimationFrame(() => {
      const nearest = slideRefs.current.reduce(
        (best, slide, index) => {
          if (!slide) return best;
          const distance = Math.abs(slide.offsetLeft - track.scrollLeft);
          return distance < best.distance ? { index, distance } : best;
        },
        { index: 0, distance: Number.POSITIVE_INFINITY },
      );
      setCurrentIndex(nearest.index);
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    let next = currentIndex;
    if (event.key === "ArrowRight") next = Math.min(items.length - 1, currentIndex + 1);
    else if (event.key === "ArrowLeft") next = Math.max(0, currentIndex - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    pauseForInteraction();
    goTo(next);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    pauseForInteraction();
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: track.scrollLeft,
    };
    track.setPointerCapture(event.pointerId);
    track.dataset.dragging = "true";
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId || !track) return;
    event.preventDefault();
    track.scrollLeft = drag.startScroll - (event.clientX - drag.startX);
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId || !track) return;
    dragRef.current.active = false;
    delete track.dataset.dragging;
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
  }

  return (
    <div ref={rootRef} className={styles.carousel} role="region" aria-roledescription="carrossel" aria-label={label} data-series="01">
      <div
        id="series-one-track"
        ref={trackRef}
        className={styles.track}
        tabIndex={0}
        onScroll={updateIndexFromScroll}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        aria-label={`${label}. Use as setas do teclado ou deslize para navegar.`}
      >
        {items.map((item, index) => (
          <article
            key={item.id}
            ref={(node) => {
              slideRefs.current[index] = node;
            }}
            className={styles.slide}
            data-series-item={item.id}
            aria-label={`${index + 1} de ${items.length}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              draggable={false}
              sizes="(max-width: 600px) 78vw, (max-width: 1000px) 52vw, 420px"
              className={styles.image}
            />
            <span className={styles.index} aria-hidden="true">{item.id}</span>
          </article>
        ))}
      </div>

      <div className={styles.controls}>
        <p className={styles.status} aria-live="polite" aria-atomic="true">
          <span>{String(currentIndex + 1).padStart(2, "0")}</span>
          <i aria-hidden="true" />
          {String(items.length).padStart(2, "0")}
        </p>
        <div className={styles.dots} aria-label="Escolher imagem">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={styles.dot}
              data-active={index === currentIndex}
              onClick={() => {
                pauseForInteraction();
                goTo(index);
              }}
              aria-label={`Ir para a imagem ${index + 1}`}
              aria-current={index === currentIndex ? "true" : undefined}
              aria-controls="series-one-track"
            />
          ))}
        </div>
        <div className={styles.arrows}>
          <button
            type="button"
            onClick={() => {
              pauseForInteraction();
              goTo(Math.max(0, currentIndex - 1));
            }}
            disabled={currentIndex === 0}
            aria-label="Imagem anterior"
            aria-controls="series-one-track"
          >
            <ArrowIcon />
          </button>
          <button
            type="button"
            onClick={() => {
              pauseForInteraction();
              goTo(Math.min(items.length - 1, currentIndex + 1));
            }}
            disabled={currentIndex === items.length - 1}
            aria-label="Próxima imagem"
            aria-controls="series-one-track"
          >
            <ArrowIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
