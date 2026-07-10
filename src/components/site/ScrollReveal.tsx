import { useEffect } from "react";

/**
 * Adds an `is-visible` class to any element with `data-reveal` when it
 * scrolls into view. Pairs with the CSS in styles.css for a subtle
 * fade + lift effect. Works on mobile without animation-timeline support.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const reveal = (el: Element) => el.classList.add("is-visible");

    const nodes = () => Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));

    if (prefersReduced || !("IntersectionObserver" in window)) {
      nodes().forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const observeAll = () => nodes().forEach((n) => io.observe(n));
    observeAll();

    // Re-scan when the DOM updates (route changes, list renders).
    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
