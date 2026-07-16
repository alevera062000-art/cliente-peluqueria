import { SALON } from "@/lib/constants";

export const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const DIAS_CORTO = ["L", "M", "X", "J", "V", "S", "D"];

export const DIAS_LARGO = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

export function fmtDate(d: Date): string {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

export function todayStr(): string {
  return fmtDate(new Date());
}

export function getSlots(dateStr: string): string[] {
  const d = new Date(dateStr + "T12:00:00");
  const dow = d.getDay();
  const fin = dow === 6 ? SALON.horaSabFin : SALON.horaFin;
  const slots: string[] = [];
  for (let h = SALON.horaInicio; h < fin; h++) {
    slots.push(String(h).padStart(2, "0") + ":00");
    if (SALON.duracion <= 30 && h < fin - 1) {
      slots.push(String(h).padStart(2, "0") + ":30");
    }
  }
  return slots;
}

export function formatLongDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return `${DIAS_LARGO[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()].toLowerCase()}`;
}
