import type { AdminAction } from "@/types";

let adminPass = "";

export function setAdminPass(pass: string) {
  adminPass = pass;
}

export async function callAdminApi<T = unknown>(
  action: AdminAction,
  payload: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-pass": adminPass },
    body: JSON.stringify({ action, payload }),
  });
  if (res.status === 401) throw new Error("No autorizado");
  return res.json();
}

/**
 * Intenta la acción vía el proxy seguro /api/admin; si falla (offline, función no
 * disponible, etc.) cae a una escritura directa contra Firebase (menos segura,
 * mismo comportamiento que el sitio original).
 */
export async function withAdminFallback(
  action: AdminAction,
  payload: Record<string, unknown>,
  fallback: () => Promise<void> | void,
): Promise<void> {
  try {
    await callAdminApi(action, payload);
  } catch {
    await fallback();
  }
}
