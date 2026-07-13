"use client";

import { useLayoutEffect } from "react";

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

const revealSelector = "[data-reveal]";

export function MotionController() {
  useLayoutEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(revealSelector),
    );
    if (elements.length === 0) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const saveData = Boolean(
      (navigator as NavigatorWithConnection).connection?.saveData,
    );

    const revealEverything = () => {
      elements.forEach((element) => {
        element.dataset.revealState = "visible";
      });
    };

    if (reducedMotion.matches || saveData || !("IntersectionObserver" in window)) {
      document.documentElement.dataset.motionMode = "lite";
      revealEverything();
      return;
    }

    document.documentElement.dataset.motionMode = "full";

    let observer: IntersectionObserver | null = null;

    try {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const element = entry.target as HTMLElement;
            element.dataset.revealState = "visible";
            observer?.unobserve(element);
          });
        },
        {
          rootMargin: "0px 0px -9% 0px",
          threshold: 0.01,
        },
      );

      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const alreadyVisible =
          rect.bottom > 0 && rect.top < window.innerHeight * 0.9;

        if (alreadyVisible) {
          element.dataset.revealState = "visible";
          return;
        }

        element.dataset.revealState = "pending";
        observer?.observe(element);
      });
    } catch {
      revealEverything();
    }

    const handlePreferenceChange = () => {
      if (!reducedMotion.matches) return;
      document.documentElement.dataset.motionMode = "lite";
      revealEverything();
      observer?.disconnect();
    };

    reducedMotion.addEventListener("change", handlePreferenceChange);

    return () => {
      reducedMotion.removeEventListener("change", handlePreferenceChange);
      observer?.disconnect();
      delete document.documentElement.dataset.motionMode;
    };
  }, []);

  return null;
}
