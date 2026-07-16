"use client";

import { useState } from "react";
import { MESES, DIAS_LARGO } from "@/lib/dates";
import { lookupToken, removeCita } from "@/lib/booking";
import type { CancelToken } from "@/types";

interface CancelLookupModalProps {
  open: boolean;
  onClose: () => void;
  onCancelled: () => void;
}

type Phase = "search" | "found" | "done";

export function CancelLookupModal({ open, onClose, onCancelled }: CancelLookupModalProps) {
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<Phase>("search");
  const [error, setError] = useState("");
  const [found, setFound] = useState<(CancelToken & { token: string }) | null>(null);

  function handleClose() {
    onClose();
    setTimeout(() => {
      setCode("");
      setPhase("search");
      setError("");
      setFound(null);
    }, 300);
  }

  async function handleLookup() {
    setError("");
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 8) {
      setError("El código debe tener 8 caracteres.");
      return;
    }
    const info = await lookupToken(trimmed);
    if (!info) {
      setError("Código no encontrado. Comprueba que está escrito correctamente.");
      return;
    }
    setFound({ ...info, token: trimmed });
    setPhase("found");
  }

  async function handleConfirmCancel() {
    if (!found) return;
    await removeCita(found.date, found.slot, found.token);
    setPhase("done");
    onCancelled();
    setTimeout(handleClose, 3000);
  }

  if (!open) return null;

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-box">
        <button className="modal-close-btn" onClick={handleClose}>
          ✕
        </button>

        {phase === "search" && (
          <div>
            <h2 className="modal-title">Cancelar cita</h2>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.4rem", lineHeight: 1.65 }}>
              Introduce el código de 8 caracteres que recibiste al reservar.
            </p>
            <div className="fg">
              <label htmlFor="cancelCodeInput">Código de cancelación</label>
              <input
                id="cancelCodeInput"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                placeholder="Ej: HX4K2M89"
                maxLength={8}
                style={{ textTransform: "uppercase", letterSpacing: "0.18em", fontSize: "1.1rem", textAlign: "center" }}
              />
            </div>
            {error && <p className="cancel-err show">{error}</p>}
            <button className="form-btn" onClick={handleLookup}>
              Buscar mi cita
            </button>
          </div>
        )}

        {phase === "found" && found && (
          <div>
            <h2 className="modal-title">Tu cita</h2>
            <div className="cancel-token-box" style={{ margin: "1rem 0 1.4rem", textAlign: "left" }}>
              <div style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--text)" }}>
                <strong style={{ color: "var(--gold)" }}>
                  {(() => {
                    const d = new Date(found.date + "T12:00:00");
                    return `${DIAS_LARGO[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()].toLowerCase()} · ${found.slot.replace("-", ":")}`;
                  })()}
                </strong>
                <br />
                {found.nombre} · {found.servicio || ""}
              </div>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.2rem" }}>
              ¿Seguro que quieres cancelar? El hueco quedará libre para otros clientes.
            </p>
            <div style={{ display: "flex", gap: "0.7rem" }}>
              <button className="form-btn btn-danger" onClick={handleConfirmCancel}>
                Sí, cancelar
              </button>
              <button className="form-btn btn-muted" onClick={handleClose}>
                Mantener cita
              </button>
            </div>
          </div>
        )}

        {phase === "done" && (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.6rem" }}>✓</div>
            <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              Cita cancelada
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>El horario ha quedado libre.</p>
          </div>
        )}
      </div>
    </div>
  );
}
