"use client";

import { useEffect, useRef } from "react";

const EYE_COUNT = 180;

export function EyeField() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    let centers: Array<{ x: number; y: number; element: HTMLElement }> = [];
    let frame = 0;

    const measure = () => {
      centers = Array.from(field.children).map((node) => {
        const element = node as HTMLElement;
        const box = element.getBoundingClientRect();
        return {
          x: box.left + box.width / 2,
          y: box.top + box.height / 2,
          element,
        };
      });
    };

    const wake = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const radius = Math.max(105, Math.min(window.innerWidth * 0.105, 190));
        const limit = radius * radius;
        centers.forEach(({ x, y, element }) => {
          const dx = x - event.clientX;
          const dy = y - event.clientY;
          element.classList.toggle("eye-awake", dx * dx + dy * dy < limit);
        });
      });
    };

    const sleep = () => centers.forEach(({ element }) => element.classList.remove("eye-awake"));
    measure();
    field.addEventListener("pointermove", wake, { passive: true });
    field.addEventListener("pointerleave", sleep);
    window.addEventListener("resize", measure);
    // re-measure once images settle (contain sizing can shift centers slightly)
    const t = window.setTimeout(measure, 500);
    return () => {
      window.clearTimeout(t);
      cancelAnimationFrame(frame);
      field.removeEventListener("pointermove", wake);
      field.removeEventListener("pointerleave", sleep);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      ref={fieldRef}
      className="absolute inset-0 z-[1] grid [grid-auto-rows:84px] [grid-template-columns:repeat(auto-fill,minmax(84px,1fr))] content-center justify-center gap-2 overflow-hidden sm:[grid-auto-rows:104px] sm:[grid-template-columns:repeat(auto-fill,minmax(104px,1fr))] sm:gap-3"
    >
      {Array.from({ length: EYE_COUNT }, (_, index) => (
        <div key={index} className="eye-cell relative min-h-0 min-w-0 overflow-hidden">
          <img
            className="eye-closed"
            src="/animation-7.png"
            alt=""
            width={256}
            height={256}
            draggable={false}
            loading={index > 24 ? "lazy" : undefined}
          />
          <img
            className="eye-open"
            src="/animation-1.png"
            alt=""
            width={256}
            height={256}
            draggable={false}
            loading={index > 24 ? "lazy" : undefined}
          />
        </div>
      ))}
    </div>
  );
}
