import { ref, get, update, remove } from "firebase/database";
import { db } from "@/lib/firebase";
import { withAdminFallback } from "@/lib/adminApi";
import { LS_KEYS } from "@/lib/constants";
import { PRODUCTOS } from "@/lib/data/productos";
import type { CartItem, Producto, ProductoConOverride, ProductoOverride } from "@/types";

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.carrito) || "[]");
  } catch {
    return [];
  }
}

export function saveCart(carrito: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEYS.carrito, JSON.stringify(carrito));
}

export function cartTotal(carrito: CartItem[]): number {
  return carrito.reduce((s, i) => s + i.precio * i.qty, 0);
}

export function cartUnits(carrito: CartItem[]): number {
  return carrito.reduce((s, i) => s + i.qty, 0);
}

// ── Overrides de stock/descuento de productos (Firebase, fetch-once + cache) ──

type ProductosOverrides = Record<string, ProductoOverride & { custom?: boolean } & Partial<Producto>>;

export async function loadProductosOverrides(): Promise<ProductosOverrides> {
  let overrides: ProductosOverrides = {};
  if (typeof window !== "undefined") {
    try {
      overrides = JSON.parse(localStorage.getItem(LS_KEYS.productos) || "{}");
    } catch {
      overrides = {};
    }
  }
  if (db) {
    try {
      const snap = await get(ref(db, "productos"));
      if (snap.val()) {
        overrides = snap.val();
        if (typeof window !== "undefined") {
          localStorage.setItem(LS_KEYS.productos, JSON.stringify(overrides));
        }
      }
    } catch {
      // se queda con el cache local
    }
  }
  return overrides;
}

export function getMergedProductos(overrides: ProductosOverrides): ProductoConOverride[] {
  const base: ProductoConOverride[] = PRODUCTOS.map((p) => ({
    ...p,
    agotado: overrides[p.id]?.stock === false,
    descuento: overrides[p.id]?.descuento || 0,
    precioFinal: parseFloat((p.precio * (1 - (overrides[p.id]?.descuento || 0) / 100)).toFixed(2)),
  }));
  const custom = Object.entries(overrides)
    .filter(([, v]) => v && v.custom)
    .map(([id, v]) => ({
      id,
      nombre: v.nombre || "",
      desc: v.desc || "",
      precio: v.precio || 0,
      cat: v.cat || "",
      img: v.img || "",
      badge: v.badge || "",
      agotado: v.stock === false,
      descuento: v.descuento || 0,
      precioFinal: parseFloat(((v.precio || 0) * (1 - (v.descuento || 0) / 100)).toFixed(2)),
    }));
  return [...base, ...custom];
}

export async function saveProductoOverride(id: string, data: Record<string, unknown>): Promise<void> {
  const overrides = await loadProductosOverrides();
  const next = { ...overrides, [id]: { ...overrides[id], ...data } };
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_KEYS.productos, JSON.stringify(next));
  }
  await withAdminFallback("UPDATE_PRODUCTO", { id, data }, async () => {
    if (db) await update(ref(db, "productos/" + id), data);
  });
}

export async function deleteProductoOverride(id: string): Promise<void> {
  await withAdminFallback("DELETE_PRODUCTO", { id }, async () => {
    if (db) await remove(ref(db, "productos/" + id));
  });
}
