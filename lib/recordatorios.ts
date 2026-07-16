import { ref, get, push, update, remove } from "firebase/database";
import { db } from "@/lib/firebase";
import { callAdminApi, withAdminFallback } from "@/lib/adminApi";
import type { Recordatorio } from "@/types";

export async function getRecordatorios(): Promise<Record<string, Recordatorio> | null> {
  let data: Record<string, Recordatorio> | null = null;
  try {
    data = await callAdminApi<Record<string, Recordatorio> | null>("GET_RECORDATORIOS");
  } catch {
    data = null;
  }
  if (data === null && db) {
    const snap = await get(ref(db, "recordatorios"));
    data = snap.val();
  }
  if (!data) return data;

  // Eliminar automáticamente los que ya pasaron
  const today = new Date().toISOString().split("T")[0];
  for (const [id, r] of Object.entries(data)) {
    if (r.fecha < today) {
      await deleteRecordatorio(id);
      delete data[id];
    }
  }
  return data;
}

export async function saveRecordatorio(
  id: string | null,
  data: Omit<Recordatorio, "id">,
): Promise<void> {
  await withAdminFallback("SAVE_RECORDATORIO", { id, data }, async () => {
    if (!db) return;
    if (id) await update(ref(db, "recordatorios/" + id), data);
    else await push(ref(db, "recordatorios"), data);
  });
}

export async function getRecordatorio(id: string): Promise<Recordatorio | null> {
  if (!db) return null;
  const snap = await get(ref(db, "recordatorios/" + id));
  return snap.val();
}

export async function deleteRecordatorio(id: string): Promise<void> {
  await withAdminFallback("DELETE_RECORDATORIO", { id }, async () => {
    if (db) await remove(ref(db, "recordatorios/" + id));
  });
}
