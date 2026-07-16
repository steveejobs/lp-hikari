(() => {
  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const root = document.documentElement;
  const reveals = [...document.querySelectorAll("[data-reveal]")];
  const videos = [...document.querySelectorAll("video[data-ambient-video]")];
  const carouselCleanups = [];
  let revealObserver;
  let videoObserver;
  let videosReady = false;

  const prepareStaggers = () => {
    document.querySelectorAll("[data-motion-stagger]").forEach((group) => {
      [...group.children].forEach((item, index) => {
        item.style.setProperty("--motion-index", String(index));
      });
    });
  };

  const syncReveals = () => {
    revealObserver?.disconnect();
    if (reduceQuery.matches || !("IntersectionObserver" in window)) {
      root.dataset.motionReady = "lite";
      reveals.forEach((element) => { element.dataset.revealState = "visible"; });
      return;
    }

    root.dataset.motionReady = "full";
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target;
        if (entry.isIntersecting) {
          element.dataset.revealState = "visible";
          return;
        }
        if (!element.dataset.revealState) {
          element.dataset.revealState = "pending";
          return;
        }
        if (element.dataset.revealState === "visible") {
          element.dataset.revealState = entry.boundingClientRect.bottom < 0
            ? "exiting-up"
            : "exiting-down";
        }
      });
    }, { threshold: [0, 0.12, 0.55], rootMargin: "-4% 0px -8%" });
    reveals.forEach((element) => revealObserver.observe(element));
  };

  const syncVideos = () => {
    const shouldPlay = !reduceQuery.matches && document.visibilityState === "visible";
    videos.forEach((video) => {
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      const frame = video.closest("[data-video-playing]");
      const markPlaying = () => { if (frame) frame.dataset.videoPlaying = "true"; };
      const markPaused = () => { if (frame) frame.dataset.videoPlaying = "false"; };
      if (!video.dataset.playbackBound) {
        video.addEventListener("play", markPlaying);
        video.addEventListener("pause", markPaused);
        video.dataset.playbackBound = "true";
      }
      if (shouldPlay && videosReady) video.play().catch(() => undefined);
      else video.pause();
    });
  };

  const activateVideos = () => {
    if (reduceQuery.matches || videosReady) return;
    videosReady = true;
    videoObserver?.disconnect();
    videos.forEach((video) => {
      const source = video.dataset.videoSrc;
      if (source && !video.getAttribute("src")) video.src = source;
    });
    syncVideos();
  };

  const observeVideos = () => {
    videoObserver?.disconnect();
    if (videosReady || reduceQuery.matches || videos.length === 0) return;
    if (!("IntersectionObserver" in window)) {
      activateVideos();
      return;
    }
    videoObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) activateVideos();
    }, { rootMargin: "35% 0px", threshold: 0.01 });
    videos.forEach((video) => videoObserver.observe(video));
  };

  const initializeCarousel = (carousel) => {
    const track = carousel.querySelector("[data-carousel-track]");
    if (!track) return () => undefined;
    const slides = [...track.querySelectorAll("[data-carousel-slide]")];
    if (slides.length < 2) return () => undefined;

    let index = 0;
    let visible = false;
    let pausedUntil = 0;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      carousel.dataset.carouselRunning = visible && !reduceQuery.matches ? "true" : "false";
    }, { threshold: 0.24 });
    observer.observe(carousel);

    const pause = () => { pausedUntil = performance.now() + 5200; };
    const advance = () => {
      if (!visible || reduceQuery.matches || document.visibilityState !== "visible" || performance.now() < pausedUntil) return;
      index = (index + 1) % slides.length;
      track.scrollTo({ left: slides[index].offsetLeft, behavior: "smooth" });
    };
    const timer = window.setInterval(advance, 2800);
    track.addEventListener("pointerdown", pause, { passive: true });
    track.addEventListener("focusin", pause);

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      track.removeEventListener("pointerdown", pause);
      track.removeEventListener("focusin", pause);
    };
  };

  const initializePointerSurface = (surface) => {
    surface.dataset.pointerReady = "true";
    let frame = 0;
    const update = (event) => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = surface.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        surface.style.setProperty("--pointer-x", `${(x * 100).toFixed(2)}%`);
        surface.style.setProperty("--pointer-y", `${(y * 100).toFixed(2)}%`);
        surface.style.setProperty("--tilt-x", `${((0.5 - y) * 3.2).toFixed(2)}deg`);
        surface.style.setProperty("--tilt-y", `${((x - 0.5) * 4.2).toFixed(2)}deg`);
      });
    };
    const reset = () => {
      surface.style.removeProperty("--tilt-x");
      surface.style.removeProperty("--tilt-y");
    };
    surface.addEventListener("pointermove", update, { passive: true });
    surface.addEventListener("pointerleave", reset);
  };

  prepareStaggers();
  syncReveals();
  syncVideos();
  observeVideos();
  document.querySelectorAll("[data-auto-carousel]").forEach((carousel) => {
    carouselCleanups.push(initializeCarousel(carousel));
  });
  document.querySelectorAll("[data-pointer-glow]").forEach(initializePointerSurface);

  reduceQuery.addEventListener("change", () => {
    syncReveals();
    syncVideos();
    if (!reduceQuery.matches && !videosReady) observeVideos();
  });
  document.addEventListener("visibilitychange", syncVideos);
  window.addEventListener("pagehide", () => {
    videoObserver?.disconnect();
    carouselCleanups.forEach((cleanup) => cleanup());
  }, { once: true });
})();
