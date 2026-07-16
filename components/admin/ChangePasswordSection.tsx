"use client";

import { useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";

export function ChangePasswordSection() {
  const { getStoredPass, changePass } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  function handleSave() {
    if (actual !== getStoredPass()) {
      setMsg({ text: "❌ La contraseña actual no es correcta.", ok: false });
      return;
    }
    if (nueva.length < 4) {
      setMsg({ text: "❌ La nueva contraseña debe tener al menos 4 caracteres.", ok: false });
      return;
    }
    if (nueva !== confirmar) {
      setMsg({ text: "❌ Las contraseñas no coinciden.", ok: false });
      return;
    }
    changePass(nueva);
    setMsg({ text: "✅ Contraseña cambiada correctamente.", ok: true });
    setActual("");
    setNueva("");
    setConfirmar("");
    setTimeout(() => {
      setMsg(null);
      setOpen(false);
    }, 2500);
  }

  return (
    <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--border)", paddingTop: "1.2rem" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--font-raleway), sans-serif", padding: 0 }}
      >
        🔑 Cambiar contraseña
      </button>
      {open && (
        <div style={{ marginTop: "1rem" }}>
          <label className="co-label">Contraseña actual</label>
          <input type="password" className="admin-pass-input" placeholder="Contraseña actual" value={actual} onChange={(e) => setActual(e.target.value)} style={{ marginBottom: "0.6rem" }} />
          <label className="co-label">Nueva contraseña</label>
          <input type="password" className="admin-pass-input" placeholder="Nueva contraseña" value={nueva} onChange={(e) => setNueva(e.target.value)} style={{ marginBottom: "0.6rem" }} />
          <label className="co-label">Confirmar nueva contraseña</label>
          <input type="password" className="admin-pass-input" placeholder="Repite la nueva contraseña" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} style={{ marginBottom: "0.9rem" }} />
          {msg && (
            <span style={{ display: "block", fontSize: "0.75rem", marginBottom: "0.7rem", color: msg.ok ? "#4ade80" : "#e07070" }}>{msg.text}</span>
          )}
          <button className="btn-co-next" onClick={handleSave} style={{ width: "100%" }}>
            Guardar contraseña
          </button>
        </div>
      )}
    </div>
  );
}
