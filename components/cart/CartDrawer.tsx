"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartDrawer({ open, onClose, onCheckout }: CartDrawerProps) {
  const { items, total, removeItem, changeQty } = useCart();

  return (
    <>
      <div className={`cart-overlay${open ? " open" : ""}`} id="cartOverlay" onClick={onClose} />
      <div className={`cart-drawer${open ? " open" : ""}`} id="cartDrawer">
        <div className="cart-head">
          <span className="cart-head-title">Tu cesta</span>
          <button className="cart-x" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="cart-items" id="cartItems">
          {items.length === 0 ? (
            <div className="cart-empty">
              <svg viewBox="0 0 24 24">
                <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                <path d="M16 3H8L6 7h12l-2-4z" />
              </svg>
              <span>Tu cesta está vacía</span>
            </div>
          ) : (
            items.map((i) => (
              <div className="cart-item" key={i.id}>
                <div className="cart-item-img">
                  {i.img ? (
                    <Image src={i.img} alt={i.nombre} width={54} height={54} style={{ objectFit: "cover" }} />
                  ) : (
                    <svg viewBox="0 0 24 24">
                      <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                      <path d="M16 3H8L6 7h12l-2-4z" />
                    </svg>
                  )}
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{i.nombre}</div>
                  <div className="cart-item-price">{i.precio.toFixed(2).replace(".", ",")} €</div>
                  <div className="cart-qty">
                    <button className="qty-btn" onClick={() => changeQty(i.id, -1)}>
                      −
                    </button>
                    <span className="qty-num">{i.qty}</span>
                    <button className="qty-btn" onClick={() => changeQty(i.id, 1)}>
                      +
                    </button>
                  </div>
                </div>
                <button className="cart-item-del" onClick={() => removeItem(i.id)} title="Eliminar">
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="cart-foot" id="cartFoot">
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-price" id="cartTotal">
                {total.toFixed(2).replace(".", ",")} €
              </span>
            </div>
            <button className="btn-checkout" onClick={onCheckout}>
              Finalizar pedido →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
