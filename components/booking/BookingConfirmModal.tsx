"use client";

import { useState } from "react";
import { MESES, DIAS_LARGO } from "@/lib/dates";
import { setCita } from "@/lib/booking";

const SERVICIOS_OPCIONES = [
  "Corte, peinado y coloración",
  "Tratamientos capilares",
  "Diseño y definición de cejas",
  "Laminado y tinte de cejas",
  "Extensiones de pestañas",
  "Otro servicio",
];

interface PendingSlot {
  date: string;
  time: string;
}

interface BookingConfirmModalProps {
  pending: PendingSlot | null;
  onClose: () => void;
  onBooked: () => void;
}

export function BookingConfirmModal({ pending, onClose, onBooked }: BookingConfirmModalProps) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [servicio, setServicio] = useState("");
  const [gdpr, setGdpr] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<{ label: string; token: string } | null>(null);

  function reset() {
    setNombre("");
    setTelefono("");
    setEmail("");
    setServicio("");
    setGdpr(false);
    setSuccess(null);
  }

  function handleClose() {
    onClose();
    setTimeout(reset, 300);
  }

  if (!pending && !success) return null;

  const label = pending
    ? (() => {
        const d = new Date(pending.date + "T12:00:00");
        return `${DIAS_LARGO[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()].toLowerCase()} · ${pending.time}`;
      })()
    : "";

  async function handleConfirmar() {
    if (!pending) return;
    if (!nombre.trim() || !telefono.trim()) return;
    if (!gdpr) {
      alert("Debes aceptar la política de privacidad para continuar.");
      return;
    }
    setSaving(true);
    try {
      const token = await setCita(pending.date, pending.time, {
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        email: email.trim(),
        servicio: servicio || "Sin especificar",
        ts: Date.now(),
      });
      setSuccess({ label, token });
      onBooked();
    } catch {
      alert("Error al guardar la cita. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-box">
        <button className="modal-close-btn" onClick={handleClose} aria-label="Cerrar">
          ✕
        </button>
        {!success ? (
          <div>
            <h2 className="modal-title">Confirmar cita</h2>
            <p className="modal-when">{label}</p>
            <div className="fg">
              <label htmlFor="bNombre">Nombre *</label>
              <input id="bNombre" autoComplete="name" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre completo" required />
            </div>
            <div className="fg">
              <label htmlFor="bTel">Teléfono *</label>
              <input id="bTel" type="tel" inputMode="tel" autoComplete="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Tu número de teléfono" required />
            </div>
            <div className="fg">
              <label htmlFor="bEmail">
                Email <span style={{ fontWeight: 400, opacity: 0.6 }}>(para recordatorio 24h antes)</span>
              </label>
              <input id="bEmail" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />
            </div>
            <div className="fg">
              <label htmlFor="bServ">Servicio</label>
              <select id="bServ" value={servicio} onChange={(e) => setServicio(e.target.value)}>
                <option value="">Selecciona un servicio</option>
                {SERVICIOS_OPCIONES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="fg" style={{ flexDirection: "row", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <input type="checkbox" id="bGdpr" checked={gdpr} onChange={(e) => setGdpr(e.target.checked)} style={{ marginTop: 3, accentColor: "var(--gold)", flexShrink: 0 }} />
              <label htmlFor="bGdpr" style={{ fontSize: "0.72rem", color: "var(--text-muted)", cursor: "pointer" }}>
                He leído y acepto la política de privacidad. Mis datos se usarán exclusivamente para gestionar mi cita.
              </label>
            </div>
            <button className="form-btn" onClick={handleConfirmar} disabled={saving}>
              {saving ? "Guardando..." : "Confirmar reserva"}
            </button>
          </div>
        ) : (
          <div className="modal-success">
            <div className="check">✅</div>
            <h3>¡Cita confirmada!</h3>
            <p>Nos vemos el {success.label}. Te esperamos en C. Puerta Canseco, 14.</p>
            <div className="cancel-token-box">
              <div className="cancel-hint">Tu código para cancelar si lo necesitas:</div>
              <div className="cancel-code">{success.token}</div>
              <div className="cancel-hint">Guárdalo en tu móvil</div>
            </div>
            <button className="form-btn" style={{ marginTop: "0.5rem" }} onClick={handleClose}>
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
