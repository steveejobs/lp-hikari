"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { GalleryItem } from "@/lib/galleries";
import { ArrowIcon } from "@/components/icons";
import styles from "./focus-gallery.module.css";

type FocusGalleryProps = {
  items: GalleryItem[];
  label: string;
};

export function FocusGallery({ items, label }: FocusGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const gestureRef = useRef<{ pointerId: number; x: number } | null>(null);
  const active = items[activeIndex];

  function choose(index: number) {
    setActiveIndex(Math.max(0, Math.min(items.length - 1, index)));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      choose(activeIndex + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      choose(activeIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      choose(0);
    } else if (event.key === "End") {
      event.preventDefault();
      choose(items.length - 1);
    }
  }

  function beginGesture(event: PointerEvent<HTMLDivElement>) {
    gestureRef.current = { pointerId: event.pointerId, x: event.clientX };
  }

  function endGesture(event: PointerEvent<HTMLDivElement>) {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const distance = event.clientX - gesture.x;
    gestureRef.current = null;
    if (Math.abs(distance) < 38) return;
    choose(activeIndex + (distance < 0 ? 1 : -1));
  }

  return (
    <div className={styles.gallery} role="region" aria-label={label} data-series="03">
      <div
        className={styles.stage}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={beginGesture}
        onPointerUp={endGesture}
        onPointerCancel={() => {
          gestureRef.current = null;
        }}
        aria-label={`${label}. Use as setas ou deslize para mudar a imagem.`}
      >
        <Image
          key={active.id}
          src={active.src}
          alt={active.alt}
          fill
          sizes="(max-width: 720px) 88vw, (max-width: 1100px) 52vw, 520px"
          className={styles.activeImage}
        />
        <span className={styles.refraction} aria-hidden="true" />
        <p className={styles.counter} aria-live="polite">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span> / {String(items.length).padStart(2, "0")}
        </p>
        <div className={styles.stageArrows}>
          <button type="button" onClick={() => choose(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Imagem anterior">
            <ArrowIcon />
          </button>
          <button type="button" onClick={() => choose(activeIndex + 1)} disabled={activeIndex === items.length - 1} aria-label="Próxima imagem">
            <ArrowIcon />
          </button>
        </div>
      </div>

      <div className={styles.choices} role="group" aria-label="Escolher enquadramento">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={styles.choice}
            data-active={index === activeIndex}
            data-series-item={item.id}
            onClick={() => choose(index)}
            aria-label={`${item.id} — mostrar imagem ${index + 1}`}
            aria-pressed={index === activeIndex}
          >
            <span className={styles.thumb}>
              <Image
                src={item.src}
                alt=""
                fill
                sizes="(max-width: 720px) 20vw, 110px"
              />
            </span>
            <span>{item.id}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
