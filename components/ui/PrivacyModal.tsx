"use client";

interface PrivacyModalProps {
  open: boolean;
  onClose: () => void;
}

export function PrivacyModal({ open, onClose }: PrivacyModalProps) {
  return (
    <div
      id="privacyModal"
      style={{
        display: open ? "block" : "none",
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 9999,
        overflowY: "auto",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          maxWidth: 560,
          margin: "auto",
          background: "var(--dark-card)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "2rem",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.2rem", cursor: "pointer", minWidth: 44, minHeight: 44 }}
        >
          ✕
        </button>
        <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.5rem", color: "var(--gold)", marginBottom: "1.2rem" }}>
          Política de Privacidad
        </h2>
        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
          <p>
            <strong style={{ color: "var(--text)" }}>Responsable del tratamiento</strong>
            <br />
            BN Estilistas · C. Puerta Canseco, 14, 38003 Santa Cruz de Tenerife · 643 50 36 18
          </p>
          <p>
            <strong style={{ color: "var(--text)" }}>Datos que recogemos</strong>
            <br />
            Nombre, teléfono y email facilitados voluntariamente al reservar una cita o realizar un
            pedido.
          </p>
          <p>
            <strong style={{ color: "var(--text)" }}>Finalidad</strong>
            <br />
            Gestionar citas y pedidos, enviar confirmaciones y recordatorios. No cedemos tus datos a
            terceros ni los usamos con fines comerciales.
          </p>
          <p>
            <strong style={{ color: "var(--text)" }}>Base legal</strong>
            <br />
            Tu consentimiento explícito (art. 6.1.a RGPD) otorgado al marcar la casilla de aceptación.
          </p>
          <p>
            <strong style={{ color: "var(--text)" }}>Plazo de conservación</strong>
            <br />
            Tus datos se conservan el tiempo necesario para la prestación del servicio y se eliminan a
            petición tuya.
          </p>
          <p>
            <strong style={{ color: "var(--text)" }}>Tus derechos</strong>
            <br />
            Puedes ejercer los derechos de acceso, rectificación, supresión (&quot;derecho al
            olvido&quot;), limitación y portabilidad contactando con nosotros en el 643 50 36 18 o en
            persona en el salón.
          </p>
          <p>
            <strong style={{ color: "var(--text)" }}>Almacenamiento técnico</strong>
            <br />
            Usamos Firebase (Google) para guardar las reservas y pedidos, y localStorage del navegador
            para preferencias de sesión. Consulta la{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" style={{ color: "var(--gold)" }}>
              política de privacidad de Google
            </a>
            .
          </p>
          <p style={{ marginTop: "1rem", fontSize: "0.75rem" }}>
            Última actualización: junio 2026 · Conforme al RGPD (UE) 2016/679 y la LOPDGDD (LO 3/2018)
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            marginTop: "1.5rem",
            width: "100%",
            padding: "0.75rem",
            background: "var(--gold)",
            border: "none",
            borderRadius: 50,
            fontFamily: "var(--font-raleway), sans-serif",
            fontWeight: 700,
            fontSize: "0.78rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--dark)",
            cursor: "pointer",
          }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
