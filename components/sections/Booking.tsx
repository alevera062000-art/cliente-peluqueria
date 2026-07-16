"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { BookingConfirmModal } from "@/components/booking/BookingConfirmModal";
import { CancelLookupModal } from "@/components/booking/CancelLookupModal";
import { isDemoMode } from "@/lib/firebase";

export function Booking() {
  const [pendingSlot, setPendingSlot] = useState<{ date: string; time: string } | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <section id="reservas">
      <div className="container">
        <Reveal style={{ marginBottom: "2.5rem" }}>
          <span className="label">Agenda online</span>
          <h2 className="section-title">Reserva tu cita</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: 300, marginTop: "0.5rem" }}>
            Elige el día y la hora disponible. La cita queda confirmada al instante.
          </p>
        </Reveal>

        {isDemoMode && (
          <div className="demo-banner">
            ⚙️{" "}
            <span>
              Modo demostración — las citas se guardan solo en este dispositivo. Configura las
              variables de entorno de Firebase para activar la sincronización entre dispositivos.
            </span>
          </div>
        )}

        <BookingCalendar
          refreshSignal={refreshKey}
          onSelectSlot={(date, time) => setPendingSlot({ date, time })}
        />

        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
          ¿Necesitas cancelar?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCancelOpen(true);
            }}
            style={{ color: "var(--gold)", textDecoration: "none", marginLeft: "0.3rem", fontWeight: 600 }}
          >
            Introduce tu código aquí →
          </a>
        </p>
      </div>

      <BookingConfirmModal
        pending={pendingSlot}
        onClose={() => setPendingSlot(null)}
        onBooked={() => setRefreshKey((k) => k + 1)}
      />
      <CancelLookupModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onCancelled={() => setRefreshKey((k) => k + 1)}
      />
    </section>
  );
}
