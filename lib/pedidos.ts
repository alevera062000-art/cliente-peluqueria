import { ref, set } from "firebase/database";
import { db } from "@/lib/firebase";
import { callAdminApi, withAdminFallback } from "@/lib/adminApi";
import type { EstadoPedido, Pedido } from "@/types";

export async function crearPedido(pedido: Pedido): Promise<void> {
  if (db) {
    try {
      await set(ref(db, "pedidos/" + pedido.codigo), pedido);
    } catch {
      // el pedido queda registrado localmente vía el resumen de confirmación igualmente
    }
  }
}

export async function getPedidos(): Promise<Record<string, Pedido> | null> {
  try {
    const data = await callAdminApi<Record<string, Pedido> | null>("GET_PEDIDOS");
    if (data !== null) return data;
  } catch {
    // sigue al fallback
  }
  if (db) {
    const { get } = await import("firebase/database");
    const snap = await get(ref(db, "pedidos"));
    return snap.val();
  }
  return null;
}

export async function actualizarEstadoPedido(codigo: string, estado: EstadoPedido): Promise<void> {
  await withAdminFallback("UPDATE_PEDIDO_ESTADO", { codigo, estado }, async () => {
    if (db) await set(ref(db, `pedidos/${codigo}/estado`), estado);
  });
}
