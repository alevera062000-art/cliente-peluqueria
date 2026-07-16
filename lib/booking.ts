import { ref, get, set, remove, onValue, type Unsubscribe } from "firebase/database";
import { db } from "@/lib/firebase";
import { LS_KEYS } from "@/lib/constants";
import type { CancelToken, Cita } from "@/types";

interface LocalCache {
  booked: Record<string, Record<string, boolean>>;
  citas: Record<string, Record<string, Cita>>;
  tokens: Record<string, CancelToken>;
}

function lsGet(): LocalCache {
  if (typeof window === "undefined") return { booked: {}, citas: {}, tokens: {} };
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEYS.citas) || "{}");
    if (!raw.booked && !raw.citas) return { booked: raw, citas: raw, tokens: {} };
    return { booked: {}, citas: {}, tokens: {}, ...raw };
  } catch {
    return { booked: {}, citas: {}, tokens: {} };
  }
}

function lsSave(data: LocalCache) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEYS.citas, JSON.stringify(data));
}

export function generateToken(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function getDayBooked(dateStr: string): Promise<Record<string, boolean>> {
  if (db) {
    const snap = await get(ref(db, "booked/" + dateStr));
    return snap.val() || {};
  }
  return lsGet().booked[dateStr] || {};
}

export async function getAllBooked(): Promise<Record<string, Record<string, boolean>>> {
  if (db) {
    const snap = await get(ref(db, "booked"));
    return snap.val() || {};
  }
  return lsGet().booked;
}

export async function getAllCitas(): Promise<Record<string, Record<string, Cita>>> {
  if (db) {
    try {
      const snap = await get(ref(db, "citas"));
      return snap.val() || {};
    } catch {
      return lsGet().citas || {};
    }
  }
  return lsGet().citas || {};
}

export async function lookupToken(token: string): Promise<CancelToken | null> {
  if (db) {
    const snap = await get(ref(db, "tokens/" + token));
    return snap.val();
  }
  return lsGet().tokens[token] || null;
}

export async function setCita(
  dateStr: string,
  timeStr: string,
  data: Omit<Cita, "cancelToken" | "date" | "time">,
): Promise<string> {
  const key = timeStr.replace(":", "-");
  const token = generateToken();
  const citaData: Cita = { ...data, date: dateStr, time: timeStr, cancelToken: token };
  const tokenData: CancelToken = {
    date: dateStr,
    slot: key,
    nombre: data.nombre,
    servicio: data.servicio || "Sin especificar",
  };

  if (db) {
    await set(ref(db, `booked/${dateStr}/${key}`), true);
    await set(ref(db, `citas/${dateStr}/${key}`), citaData);
    await set(ref(db, `tokens/${token}`), tokenData);
  }

  const all = lsGet();
  if (!all.booked[dateStr]) all.booked[dateStr] = {};
  if (!all.citas[dateStr]) all.citas[dateStr] = {};
  if (!all.tokens) all.tokens = {};
  all.booked[dateStr][key] = true;
  all.citas[dateStr][key] = citaData;
  all.tokens[token] = tokenData;
  lsSave(all);

  return token;
}

export async function removeCita(dateStr: string, timeKey: string, cancelToken?: string): Promise<void> {
  if (db) {
    try {
      await remove(ref(db, `booked/${dateStr}/${timeKey}`));
      await remove(ref(db, `citas/${dateStr}/${timeKey}`));
      if (cancelToken) await remove(ref(db, `tokens/${cancelToken}`));
    } catch {
      // aunque falle Firebase, siempre actualiza localStorage
    }
  }
  const all = lsGet();
  if (all.booked[dateStr]) delete all.booked[dateStr][timeKey];
  if (all.citas[dateStr]) delete all.citas[dateStr][timeKey];
  if (cancelToken && all.tokens) delete all.tokens[cancelToken];
  lsSave(all);
}

export function subscribeBooked(
  cb: (data: Record<string, Record<string, boolean>>) => void,
): Unsubscribe | undefined {
  if (!db) return undefined;
  return onValue(ref(db, "booked"), (snap) => cb(snap.val() || {}));
}

export function subscribeCitas(
  cb: (data: Record<string, Record<string, Cita>>) => void,
): Unsubscribe | undefined {
  if (!db) return undefined;
  return onValue(ref(db, "citas"), (snap) => cb(snap.val() || {}));
}
