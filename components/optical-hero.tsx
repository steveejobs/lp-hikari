"use client";

import Image from "next/image";
import { useEffect, useRef, type PointerEvent } from "react";

type OpticalHeroProps = {
  image: string;
};

export function OpticalHero({ image }: OpticalHeroProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  function moveLens(event: PointerEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const stage = stageRef.current;
    if (!stage) return;
    const { left, top, width, height } = stage.getBoundingClientRect();
    const x = Math.min(88, Math.max(12, ((event.clientX - left) / width) * 100));
    const y = Math.min(86, Math.max(14, ((event.clientY - top) / height) * 100));
    const shiftX = ((x - 50) / 50) * -7;
    const shiftY = ((y - 50) / 50) * -5;

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      stage.style.setProperty("--lens-x", `${x}%`);
      stage.style.setProperty("--lens-y", `${y}%`);
      stage.style.setProperty("--refract-x", `${shiftX}px`);
      stage.style.setProperty("--refract-y", `${shiftY}px`);
      stage.dataset.tracking = "true";
    });
  }

  function resetLens() {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--lens-x", "65%");
    stage.style.setProperty("--lens-y", "40%");
    stage.style.setProperty("--refract-x", "-2px");
    stage.style.setProperty("--refract-y", "1px");
    delete stage.dataset.tracking;
  }

  return (
    <figure className="optical-figure">
      <div
        ref={stageRef}
        className="optical-stage"
        onPointerMove={moveLens}
        onPointerLeave={resetLens}
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

          <span className="lens-ring" aria-hidden="true" />
          <span className="lens-caustic" aria-hidden="true" />
          <span className="frame-index" aria-hidden="true">光 / 01</span>
        </div>

        <div className="optical-axis" aria-hidden="true">
          <span>Luz</span>
          <i />
          <span>Foco</span>
          <i />
          <span>Olhar</span>
        </div>
      </div>
      <figcaption>Uma passagem de luz muda o ponto de vista.</figcaption>
    </figure>
  );
}
