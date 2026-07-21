"use client";

import { useEffect, useState } from "react";
import { getSlots, todayStr } from "@/lib/dates";
import { getDayBooked } from "@/lib/booking";

interface AdminAddAppointmentModalProps {
  open: boolean;
  initialDate: string | null;
  onClose: () => void;
  onContinue: (dateStr: string, timeStr: string) => void;
}

export function AdminAddAppointmentModal({ open, initialDate, onClose, onContinue }: AdminAddAppointmentModalProps) {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [horas, setHoras] = useState<{ time: string; taken: boolean }[]>([]);

  useEffect(() => {
    if (open) {
      const ds = initialDate || todayStr();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reinicia el formulario al abrir el modal
      setFecha(ds);
      loadHoras(ds);
    }
  }, [open, initialDate]);

  async function loadHoras(ds: string) {
    setHora("");
    const booked = await getDayBooked(ds);
    setHoras(getSlots(ds).map((t) => ({ time: t, taken: Boolean(booked[t.replace(":", "-")]) })));
  }

  function handleContinuar() {
    if (!fecha) {
      alert("Elige una fecha");
      return;
    }
    if (!hora) {
      alert("Elige una hora");
      return;
    }
    onContinue(fecha, hora);
  }

  if (!open) return null;

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 360 }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
        <h2 className="modal-title" style={{ fontSize: "1.1rem", marginBottom: "1.2rem" }}>
          Nueva cita manual
        </h2>
        <div className="fg" style={{ marginBottom: "1rem" }}>
          <label htmlFor="aaFecha">Fecha *</label>
          <input
            type="date"
            id="aaFecha"
            value={fecha}
            onChange={(e) => {
              setFecha(e.target.value);
              loadHoras(e.target.value);
            }}
            style={{ background: "#1a1e2e", border: "1px solid #2a2f45", borderRadius: 8, padding: "0.55rem 0.8rem", color: "#e8e4dc", fontFamily: "var(--font-raleway), sans-serif", fontSize: "0.9rem", width: "100%", boxSizing: "border-box", colorScheme: "dark" }}
          />
        </div>
        <div className="fg" style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="aaHora">Hora *</label>
          <select
            id="aaHora"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            style={{ background: "#1a1e2e", border: "1px solid #2a2f45", borderRadius: 8, padding: "0.55rem 0.8rem", color: "#e8e4dc", fontFamily: "var(--font-raleway), sans-serif", fontSize: "0.9rem", width: "100%", appearance: "none", cursor: "pointer" }}
          >
            <option value="">— Elige una hora —</option>
            {horas.map((h) => (
              <option key={h.time} value={h.time} style={h.taken ? { color: "#e07070" } : undefined}>
                {h.time}
                {h.taken ? " (ocupada)" : ""}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleContinuar}
          style={{ width: "100%", padding: "0.75rem", background: "var(--gold)", color: "#2B0F22", border: "none", borderRadius: 8, fontFamily: "var(--font-raleway), sans-serif", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", letterSpacing: "0.05em" }}
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}
