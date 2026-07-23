"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { crearPedido } from "@/lib/pedidos";
import { SALON } from "@/lib/constants";
import type { CartItem, Pedido } from "@/types";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = "form" | "confirm";

export function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const { items, total, clear } = useCart();
  const [step, setStep] = useState<Step>("form");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [gdpr, setGdpr] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [summary, setSummary] = useState<{ items: CartItem[]; total: number }>({ items: [], total: 0 });

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep("form");
      setNombre("");
      setTelefono("");
      setEmail("");
      setGdpr(false);
      setError("");
    }, 300);
  }

  async function handleConfirmar() {
    setError("");
    if (!nombre.trim() || !telefono.trim()) {
      setError("Por favor completa tu nombre y teléfono.");
      return;
    }
    if (!gdpr) {
      setError("Debes aceptar la política de privacidad para continuar.");
      return;
    }

    setSaving(true);
    const codigo = "BN-" + Date.now().toString(36).toUpperCase().slice(-6);
    const contacto = [telefono, email].filter(Boolean).join(" · ");
    const pedido: Pedido = {
      codigo,
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      email: email.trim(),
      contacto,
      metodo: "tienda",
      items: items.map((i) => ({ id: i.id, nombre: i.nombre, precio: i.precio, qty: i.qty })),
      total: parseFloat(total.toFixed(2)),
      ts: Date.now(),
      estado: "pendiente",
    };

    await crearPedido(pedido);
    if (email.trim()) {
      fetch("/api/email/order-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: pedido.nombre,
          email: email.trim(),
          codigo: pedido.codigo,
          items: pedido.items,
          total: pedido.total,
        }),
      }).catch(() => {});
    }

    setSummary({ items, total });
    setOrderCode(codigo);
    setStep("confirm");
    setSaving(false);
    clear();
  }

  return (
    <div className={`checkout-overlay${open ? " open" : ""}`} id="checkoutOverlay">
      <div className="checkout-modal">
        <div className="checkout-title">Completa tu pedido</div>

        {step === "form" && (
          <div className="checkout-step active" id="coStep1">
            <label className="co-label" htmlFor="coNombre">Nombre completo</label>
            <input id="coNombre" className="co-input" autoComplete="name" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" />
            <label className="co-label" htmlFor="coTelefono">Teléfono</label>
            <input id="coTelefono" className="co-input" type="tel" inputMode="tel" autoComplete="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="627 000 000" />
            <label className="co-label" htmlFor="coEmail">
              Email{" "}
              <span style={{ fontSize: "0.8em", color: "var(--text-muted)", textTransform: "none", letterSpacing: 0 }}>
                (para recibir tu factura)
              </span>
            </label>
            <input id="coEmail" className="co-input" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />

            <div className="pay-info-box show" id="pi-tienda">
              <span className="pi-label">Recogida y pago en tienda</span>
              <div className="pi-val" style={{ fontSize: "0.85rem" }}>
                {SALON.direccion}
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: "0.3rem" }}>
                Confirma tu pedido y paga cuando vengas a recogerlo. Te avisamos cuando esté listo.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", margin: "0.8rem 0 0.5rem", padding: "0 0.2rem" }}>
              <input
                type="checkbox"
                id="coGdpr"
                checked={gdpr}
                onChange={(e) => setGdpr(e.target.checked)}
                style={{ marginTop: 3, accentColor: "var(--gold)", flexShrink: 0 }}
              />
              <label htmlFor="coGdpr" style={{ fontSize: "0.72rem", color: "var(--text-muted)", cursor: "pointer" }}>
                He leído y acepto la política de privacidad. Mis datos se usarán para gestionar mi pedido.
              </label>
            </div>

            {error && (
              <p style={{ color: "#e07070", fontSize: "0.78rem", marginBottom: "0.5rem" }}>{error}</p>
            )}

            <div className="checkout-actions">
              <button className="btn-co-back" onClick={handleClose}>
                Cancelar
              </button>
              <button className="btn-co-next" onClick={handleConfirmar} disabled={saving}>
                {saving ? "Guardando..." : "Confirmar pedido →"}
              </button>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="checkout-step active" id="coStep3">
            <div className="co-confirm-box">
              <div className="co-confirm-icon">✅</div>
              <div className="co-confirm-title">¡Pedido reservado!</div>
              <p className="co-confirm-sub">
                Te avisamos cuando tu pedido esté listo para recoger en el salón. Pago en el momento de
                la recogida.
              </p>
              <div className="co-order-num">Número de pedido</div>
              <div className="co-order-code">{orderCode}</div>
              <div className="co-summary">
                {summary.items.map((i) => (
                  <div className="co-summary-row" key={i.id}>
                    <span>
                      {i.nombre} ×{i.qty}
                    </span>
                    <span>{(i.precio * i.qty).toFixed(2).replace(".", ",")} €</span>
                  </div>
                ))}
                <div className="co-summary-row total">
                  <span>Total</span>
                  <span>{summary.total.toFixed(2).replace(".", ",")} €</span>
                </div>
              </div>
              <button className="btn-co-next" style={{ width: "100%" }} onClick={handleClose}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
