"use client";

import type { ReactNode, ElementType, CSSProperties, MouseEventHandler } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface RevealProps {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  staggerDelayMs?: number;
  onClick?: MouseEventHandler;
  children: ReactNode;
}

/** Envoltorio cliente para las animaciones .reveal/.reveal-left/.reveal-right/.stagger del sitio original. */
export function Reveal({
  as: Tag = "div",
  className,
  style,
  staggerDelayMs = 0,
  onClick,
  children,
}: RevealProps) {
  const ref = useScrollReveal<HTMLElement>(staggerDelayMs);
  return (
    <Tag ref={ref} className={className} style={style} onClick={onClick}>
      {children}
    </Tag>
  );
}
