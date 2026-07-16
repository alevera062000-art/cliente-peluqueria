"use client";

import { useCallback, useEffect, useState } from "react";
import { loadProductosOverrides, getMergedProductos } from "@/lib/cart";
import type { ProductoConOverride } from "@/types";

export function useProductosOverrides() {
  const [productos, setProductos] = useState<ProductoConOverride[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const overrides = await loadProductosOverrides();
    setProductos(getMergedProductos(overrides));
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de productos desde Firebase
    reload();
  }, [reload]);

  return { productos, loading, reload };
}
