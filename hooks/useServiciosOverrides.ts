"use client";

import { useCallback, useEffect, useState } from "react";
import { loadServiciosOverrides, getAllServicios, getMergedServicios } from "@/lib/servicios";
import type { ServicioConOverride } from "@/types";

export function useServiciosOverrides(includeHidden = false) {
  const [servicios, setServicios] = useState<ServicioConOverride[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const overrides = await loadServiciosOverrides();
    setServicios(includeHidden ? getAllServicios(overrides) : getMergedServicios(overrides));
    setLoading(false);
  }, [includeHidden]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de servicios desde Firebase
    reload();
  }, [reload]);

  return { servicios, loading, reload };
}
