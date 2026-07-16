"use client";

import { useEffect, useState } from "react";
import { LS_KEYS } from "@/lib/constants";

export function CookieBanner({ onOpenPrivacy }: { onOpenPrivacy: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lee localStorage, solo existe en cliente
    if (!localStorage.getItem(LS_KEYS.cookies)) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(LS_KEYS.cookies, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      id="cookieBanner"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "var(--dark-card)",
        borderTop: "1px solid var(--border)",
        padding: "1rem 1.5rem",
        zIndex: 8000,
        display: "flex",
        flexWrap: "wrap",
        gap: "0.8rem",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-muted)", flex: 1, minWidth: 200 }}>
        Usamos almacenamiento local (Firebase, localStorage) para el funcionamiento de la web. No
        usamos cookies de publicidad.
      </p>
      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
        <button
          onClick={onOpenPrivacy}
          style={{ background: "none", border: "1px solid var(--border)", borderRadius: 50, padding: "0.4rem 1rem", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.72rem", fontFamily: "var(--font-raleway), sans-serif" }}
        >
          Más info
        </button>
        <button
          onClick={accept}
          style={{ background: "var(--gold)", border: "none", borderRadius: 50, padding: "0.4rem 1.2rem", color: "var(--dark)", cursor: "pointer", fontSize: "0.72rem", fontFamily: "var(--font-raleway), sans-serif", fontWeight: 700 }}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
