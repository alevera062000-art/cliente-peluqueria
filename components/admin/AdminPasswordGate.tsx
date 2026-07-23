"use client";

import { useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { LS_KEYS, SALON } from "@/lib/constants";

export function AdminPasswordGate() {
  const { unlock } = useAdminAuth();
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryPhone, setRecoveryPhone] = useState("");
  const [recoveryMsg, setRecoveryMsg] = useState<{ text: string; ok: boolean } | null>(null);

  function handleEnter() {
    if (!unlock(pass)) {
      setError(true);
      setPass("");
      setTimeout(() => setError(false), 2500);
    }
  }

  function handleRecover() {
    const val = recoveryPhone.replace(/\s/g, "");
    if (val === "643503618") {
      localStorage.removeItem(LS_KEYS.adminPass);
      setRecoveryMsg({ text: `✅ Acceso recuperado. Usa la contraseña original: ${SALON.adminPass}`, ok: true });
      setRecoveryPhone("");
    } else {
      setRecoveryMsg({ text: "❌ Teléfono incorrecto.", ok: false });
    }
  }

  return (
    <div className="admin-pass-screen" id="adminPassScreen">
      <p>Introduce la contraseña de administrador</p>
      <input
        type="password"
        className="admin-pass-input"
        placeholder="Contraseña"
        aria-label="Contraseña de administrador"
        autoComplete="current-password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleEnter()}
      />
      <button className="btn-primary" onClick={handleEnter}>
        Entrar
      </button>
      <span className={`admin-pass-err${error ? " show" : ""}`}>Contraseña incorrecta</span>
      <button
        onClick={() => setRecoveryOpen((o) => !o)}
        style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.72rem", cursor: "pointer", fontFamily: "var(--font-raleway), sans-serif", marginTop: "0.8rem", textDecoration: "underline" }}
      >
        ¿Olvidaste la contraseña?
      </button>
      {recoveryOpen && (
        <div style={{ marginTop: "0.8rem", width: "100%" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
            Introduce el teléfono del negocio para recuperar el acceso:
          </p>
          <input
            type="tel"
            inputMode="tel"
            className="admin-pass-input"
            placeholder="Teléfono del negocio"
            aria-label="Teléfono del negocio para recuperar el acceso"
            value={recoveryPhone}
            onChange={(e) => setRecoveryPhone(e.target.value)}
            style={{ marginBottom: "0.5rem" }}
          />
          <button className="btn-primary" onClick={handleRecover} style={{ width: "100%", fontSize: "0.72rem" }}>
            Recuperar acceso
          </button>
          {recoveryMsg && (
            <span style={{ display: "block", fontSize: "0.73rem", marginTop: "0.5rem", color: recoveryMsg.ok ? "#4ade80" : "#e07070" }}>
              {recoveryMsg.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
