import { callAdminApi } from "@/lib/adminApi";
import { getAllCitas, removeCita } from "@/lib/booking";
import type { Cita } from "@/types";

export async function getCitasAdmin(): Promise<Record<string, Record<string, Cita>>> {
  try {
    return await callAdminApi<Record<string, Record<string, Cita>>>("GET_CITAS");
  } catch {
    return getAllCitas();
  }
}

export async function cancelApptAdmin(
  dateStr: string,
  timeKey: string,
  cancelToken?: string,
): Promise<void> {
  try {
    await callAdminApi("CANCEL_APPT", { dateStr, timeKey, cancelToken });
  } catch {
    await removeCita(dateStr, timeKey, cancelToken);
  }
}

export function getWeekMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diff);
  return d;
}
