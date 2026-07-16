"use client";

import { useEffect, useState } from "react";
import { subscribeCitas } from "@/lib/booking";

/**
 * Se suscribe a /citas solo mientras el componente que la usa está montado
 * (p.ej. la pestaña Citas del admin abierta) — a diferencia del listener
 * global siempre activo del sitio original, esto evita trabajo innecesario
 * cuando el panel de admin está cerrado, sin cambiar el comportamiento visible.
 */
export function useCitasRealtime() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const unsub = subscribeCitas(() => setVersion((v) => v + 1));
    return () => unsub?.();
  }, []);

  return version;
}
