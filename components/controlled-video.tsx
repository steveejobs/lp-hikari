"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "@/components/icons";
import styles from "./controlled-video.module.css";

type ControlledVideoProps = {
  src: string;
  poster: string;
  label: string;
  autoplay?: boolean;
  className?: string;
};

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

const PLAY_EVENT = "hikari:video-play";

export function ControlledVideo({ src, poster, label, autoplay = true, className }: ControlledVideoProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(false);
  const pageVisibleRef = useRef(true);
  const userPausedRef = useRef(!autoplay);
  const reducedRef = useRef(false);
  const saveDataRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.paused) return;
    video.pause();
  }, []);

  const play = useCallback(async () => {
    const video = videoRef.current;
    if (!video || reducedRef.current || document.visibilityState !== "visible") return;
    window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: id }));
    try {
      await video.play();
    } catch {
      setPlaying(false);
    }
  }, [id]);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreferences = () => {
      reducedRef.current = motionQuery.matches;
      saveDataRef.current = Boolean((navigator as NavigatorWithConnection).connection?.saveData);
      setReducedMotion(motionQuery.matches);
      if (motionQuery.matches) pause();
    };
    const updatePlayback = () => {
      const eligible =
        autoplay &&
        visibleRef.current &&
        pageVisibleRef.current &&
        !userPausedRef.current &&
        !reducedRef.current &&
        !saveDataRef.current;
      if (eligible) void play();
      else pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        updatePlayback();
      },
      { threshold: 0.55 },
    );
    const onVisibility = () => {
      pageVisibleRef.current = document.visibilityState === "visible";
      updatePlayback();
    };
    const onPageHide = () => pause();
    const onPeerPlay = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (detail !== id) pause();
    };

    updatePreferences();
    observer.observe(root);
    motionQuery.addEventListener("change", updatePreferences);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("freeze", onPageHide);
    window.addEventListener(PLAY_EVENT, onPeerPlay);

    return () => {
      observer.disconnect();
      motionQuery.removeEventListener("change", updatePreferences);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("freeze", onPageHide);
      window.removeEventListener(PLAY_EVENT, onPeerPlay);
      video.pause();
    };
  }, [autoplay, id, pause, play]);

  function togglePlayback() {
    if (reducedMotion) return;
    if (playing) {
      userPausedRef.current = true;
      pause();
    } else {
      userPausedRef.current = false;
      void play();
    }
  }

  return (
    <div ref={rootRef} className={`${styles.frame}${className ? ` ${className}` : ""}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        loop
        preload="none"
        disablePictureInPicture
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <span className={styles.shade} aria-hidden="true" />
      {reducedMotion ? (
        <span className={styles.reducedLabel}>Imagem estática</span>
      ) : (
        <button type="button" className={styles.control} onClick={togglePlayback} aria-label={playing ? `Pausar ${label}` : `Reproduzir ${label}`}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      )}
    </div>
  );
}
