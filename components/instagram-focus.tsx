"use client";

import Image from "next/image";
import {
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

export function InstagramFocus({ items }: InstagramFocusProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerRef = useRef<{ id: number; x: number } | null>(null);
  const touchRef = useRef<number | null>(null);
  const active = items[activeIndex];

  function choose(index: number) {
    setActiveIndex((index + items.length) % items.length);
  }

  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      choose(activeIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      choose(activeIndex - 1);
    }
  }

  function begin(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    pointerRef.current = { id: event.pointerId, x: event.clientX };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== event.pointerId) return;
    const delta = event.clientX - pointer.x;
    if (Math.abs(delta) < 34) return;
    pointerRef.current = null;
    choose(activeIndex + (delta < 0 ? 1 : -1));
  }

  function finish(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== event.pointerId) return;
    const delta = event.clientX - pointer.x;
    pointerRef.current = null;
    if (Math.abs(delta) >= 34) choose(activeIndex + (delta < 0 ? 1 : -1));
  }

  function beginTouch(event: TouchEvent<HTMLDivElement>) {
    touchRef.current = event.touches[0]?.clientX ?? null;
  }

  function moveTouch(event: TouchEvent<HTMLDivElement>) {
    const start = touchRef.current;
    const current = event.touches[0]?.clientX;
    if (start === null || current === undefined) return;
    const delta = current - start;
    if (Math.abs(delta) < 34) return;
    touchRef.current = null;
    choose(activeIndex + (delta < 0 ? 1 : -1));
  }

  function finishTouch(event: TouchEvent<HTMLDivElement>) {
    const start = touchRef.current;
    const current = event.changedTouches[0]?.clientX;
    touchRef.current = null;
    if (start === null || current === undefined) return;
    const delta = current - start;
    if (Math.abs(delta) >= 34) choose(activeIndex + (delta < 0 ? 1 : -1));
  }

  return (
    <div className={styles.wrap} data-series="04">
      <div
        className={styles.stage}
        tabIndex={0}
        role="region"
        aria-label="Seleção visual. Deslize ou use as setas para mudar o foco."
        onKeyDown={handleKey}
        onPointerDown={begin}
        onPointerMove={move}
        onPointerUp={finish}
        onPointerCancel={() => {
          pointerRef.current = null;
        }}
        onTouchStart={beginTouch}
        onTouchMove={moveTouch}
        onTouchEnd={finishTouch}
        onTouchCancel={() => {
          touchRef.current = null;
        }}
      >
        <Image
          key={`base-${active.id}`}
          src={active.src}
          alt={active.alt}
          fill
          preload={activeIndex === 0}
          fetchPriority={activeIndex === 0 ? "high" : "auto"}
          sizes="(max-width: 540px) 88vw, 420px"
          className={styles.image}
        />
        <div className={styles.refracted} aria-hidden="true">
          <Image
            key={`refracted-${active.id}`}
            src={active.src}
            alt=""
            fill
            sizes="(max-width: 540px) 88vw, 420px"
            className={styles.refractedImage}
          />
        </div>
        <span className={styles.lensEdge} aria-hidden="true" />
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Exibindo {active.alt}
        </p>

        <div className={styles.arrows}>
          <button type="button" onClick={() => choose(activeIndex - 1)} aria-label="Imagem anterior">
            <ArrowIcon />
          </button>
          <button type="button" onClick={() => choose(activeIndex + 1)} aria-label="Próxima imagem">
            <ArrowIcon />
          </button>
        </div>
      </div>

      <div className={styles.selector} aria-label="Escolher imagem">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            data-active={index === activeIndex}
            data-series-item={item.id}
            onClick={() => choose(index)}
            aria-label={`Mostrar ${item.alt}`}
            aria-current={index === activeIndex ? "true" : undefined}
          >
            <span className={styles.selectorThumb}>
              <Image
                src={item.src}
                alt=""
                fill
                sizes="(max-width: 540px) 28vw, 130px"
              />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
