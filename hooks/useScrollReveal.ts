"use client";

import { useCallback, useRef } from "react";

/**
 * Adjunta un IntersectionObserver a un elemento para replicar las animaciones
 * .reveal/.reveal-left/.reveal-right/.stagger del sitio original: al entrar en
 * viewport se añade la clase "visible" (definida en globals.css), una sola vez.
 */
export function useScrollReveal<T extends HTMLElement>(staggerDelayMs = 0) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (el: T | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (staggerDelayMs > 0) {
                setTimeout(() => entry.target.classList.add("visible"), staggerDelayMs);
              } else {
                entry.target.classList.add("visible");
              }
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
      );
      observer.observe(el);
      observerRef.current = observer;
    },
    [staggerDelayMs],
  );

  return ref;
}
