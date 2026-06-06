"use client";

import { useEffect } from "react";

export function CursorGlow() {
  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(".glow-card");
      if (!target) return;

      const rect = target.getBoundingClientRect();
      target.style.setProperty("--cursor-x", `${event.clientX - rect.left}px`);
      target.style.setProperty("--cursor-y", `${event.clientY - rect.top}px`);
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return null;
}
