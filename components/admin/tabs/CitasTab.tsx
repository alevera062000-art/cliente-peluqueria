"use client";

import { useEffect, useState } from "react";
import { MESES, DIAS_LARGO } from "@/lib/dates";
import { getCitasAdmin, cancelApptAdmin, getWeekMonday } from "@/lib/citasAdmin";
import { useCitasRealtime } from "@/hooks/useCitasRealtime";
import { AdminAddAppointmentModal } from "@/components/admin/AdminAddAppointmentModal";
import { BookingConfirmModal } from "@/components/booking/BookingConfirmModal";
import type { Cita } from "@/types";

export function CitasTab() {
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekMonday(new Date()));
  const [citas, setCitas] = useState<Record<string, Record<string, Cita>>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [pendingSlot, setPendingSlot] = useState<{ date: string; time: string } | null>(null);
  const citasVersion = useCitasRealtime();

  useEffect(() => {
    getCitasAdmin().then(setCitas);
  }, [citasVersion]);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const fmt = (d: Date) => `${d.getDate()} ${MESES[d.getMonth()].slice(0, 3).toUpperCase()}`;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString().split("T")[0];

  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    weekDays.push(d);
  }

  async function handleCancel(dateStr: string, timeKey: string, cancelToken: string | undefined) {
    if (!confirm("¿Cancelar esta cita?")) return;
    setBusy(dateStr + timeKey);
    await cancelApptAdmin(dateStr, timeKey, cancelToken);
    setCitas(await getCitasAdmin());
    setBusy(null);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.8rem", gap: "0.5rem" }}>
        <button
          onClick={() => setWeekStart((w) => { const n = new Date(w); n.setDate(n.getDate() - 7); return n; })}
          style={{ background: "var(--dark-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "0.4rem 0.8rem", cursor: "pointer", fontSize: "0.85rem" }}
        >
          ← Anterior
        </button>
        <span style={{ fontSize: "0.78rem", color: "var(--gold)", fontFamily: "var(--font-raleway), sans-serif", fontWeight: 600, letterSpacing: "0.04em", textAlign: "center" }}>
          {fmt(weekStart)} – {fmt(weekEnd)} {weekEnd.getFullYear()}
        </span>
        <button
          onClick={() => setWeekStart((w) => { const n = new Date(w); n.setDate(n.getDate() + 7); return n; })}
          style={{ background: "var(--dark-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "0.4rem 0.8rem", cursor: "pointer", fontSize: "0.85rem" }}
        >
          Siguiente →
        </button>
      </div>

      <div>
        {weekDays.map((d) => {
          const ds = d.toISOString().split("T")[0];
          const dayCitas = citas[ds];
          const isToday = ds === todayIso;
          const isPast = d < today;
          const dayLabel = `${isToday ? "★ HOY — " : ""}${DIAS_LARGO[d.getDay()].toUpperCase()}, ${d.getDate()} ${MESES[d.getMonth()].toUpperCase()}`;
          return (
            <div className="admin-day-group" key={ds} style={{ opacity: isPast ? 0.5 : 1 }}>
              <div className="admin-day-title" style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{dayLabel}</span>
                <span style={{ fontSize: "0.7rem", fontWeight: 400, color: "var(--text-muted)" }}>
                  {dayCitas ? `${Object.keys(dayCitas).length} cita(s)` : "libre"}
                </span>
              </div>
              {dayCitas &&
                Object.keys(dayCitas).sort().map((timeKey) => {
                  const c = dayCitas[timeKey];
                  return (
                    <div className="admin-appt" key={timeKey}>
                      <div className="appt-time">{timeKey.replace("-", ":")}</div>
                      <div className="appt-info">
                        <div className="appt-name">{c.nombre}</div>
                        <div className="appt-detail">
                          {c.servicio} · {c.telefono}
                        </div>
                      </div>
                      <button
                        className="appt-cancel"
                        disabled={busy === ds + timeKey}
                        onClick={() => handleCancel(ds, timeKey, c.cancelToken)}
                      >
                        {busy === ds + timeKey ? "..." : "Cancelar"}
                      </button>
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>

      <button className="admin-add-btn" onClick={() => setAddModalOpen(true)}>
        + Añadir cita manualmente
      </button>

      <AdminAddAppointmentModal
        open={addModalOpen}
        initialDate={todayIso}
        onClose={() => setAddModalOpen(false)}
        onContinue={(date, time) => {
          setAddModalOpen(false);
          setPendingSlot({ date, time });
        }}
      />
      <BookingConfirmModal
        pending={pendingSlot}
        onClose={() => setPendingSlot(null)}
        onBooked={() => getCitasAdmin().then(setCitas)}
      />
    </div>
  );
}
