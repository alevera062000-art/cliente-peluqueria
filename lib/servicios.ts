import { ref, get, update, remove } from "firebase/database";
import { db } from "@/lib/firebase";
import { withAdminFallback } from "@/lib/adminApi";
import { LS_KEYS } from "@/lib/constants";
import { SERVICIOS } from "@/lib/data/servicios";
import type { Servicio, ServicioConOverride, ServicioOverride } from "@/types";

type ServiciosOverrides = Record<string, ServicioOverride>;

export async function loadServiciosOverrides(): Promise<ServiciosOverrides> {
  let overrides: ServiciosOverrides = {};
  if (typeof window !== "undefined") {
    try {
      overrides = JSON.parse(localStorage.getItem(LS_KEYS.servicios) || "{}");
    } catch {
      overrides = {};
    }
  }
  if (db) {
    try {
      const snap = await get(ref(db, "servicios"));
      if (snap.val()) {
        overrides = snap.val();
        if (typeof window !== "undefined") {
          localStorage.setItem(LS_KEYS.servicios, JSON.stringify(overrides));
        }
      }
    } catch {
      // se queda con el cache local
    }
  }
  return overrides;
}

export function getAllServicios(overrides: ServiciosOverrides): ServicioConOverride[] {
  const base: ServicioConOverride[] = SERVICIOS.map((s) => ({
    ...s,
    precio: overrides[s.id]?.precio ?? s.precio,
    activo: overrides[s.id]?.activo !== false,
  }));
  const custom: ServicioConOverride[] = Object.entries(overrides)
    .filter(([, v]) => v && v.custom)
    .map(([id, v]) => ({
      id,
      nombre: v.nombre || "",
      desc: v.desc || "",
      precio: v.precio || 0,
      icon: v.icon || "estrella",
      activo: v.activo !== false,
      custom: true,
    } satisfies Servicio & { activo: boolean; custom: boolean }));
  return [...base, ...custom];
}

export function getMergedServicios(overrides: ServiciosOverrides): ServicioConOverride[] {
  return getAllServicios(overrides).filter((s) => s.activo);
}

export async function saveServicioOverride(id: string, data: Record<string, unknown>): Promise<void> {
  const overrides = await loadServiciosOverrides();
  const next = { ...overrides, [id]: { ...overrides[id], ...data } };
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_KEYS.servicios, JSON.stringify(next));
  }
  await withAdminFallback("UPDATE_SERVICIO", { id, data }, async () => {
    if (db) await update(ref(db, "servicios/" + id), data);
  });
}

export async function deleteServicioOverride(id: string): Promise<void> {
  await withAdminFallback("DELETE_SERVICIO", { id }, async () => {
    if (db) await remove(ref(db, "servicios/" + id));
  });
}
