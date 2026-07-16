"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { loadCart, saveCart, cartTotal, cartUnits } from "@/lib/cart";
import type { CartItem, ProductoConOverride } from "@/types";

interface CartContextValue {
  items: CartItem[];
  total: number;
  units: number;
  addItem: (producto: ProductoConOverride) => void;
  removeItem: (id: string) => void;
  changeQty: (id: string, delta: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lee localStorage, solo existe en cliente (evita desajuste de hidratación)
    setItems(loadCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveCart(items);
  }, [items, ready]);

  const addItem = useCallback((producto: ProductoConOverride) => {
    if (producto.agotado) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === producto.id);
      if (existing) {
        return prev.map((i) => (i.id === producto.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precioFinal,
          qty: 1,
          img: producto.img,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const changeQty = useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return (
    <CartContext.Provider
      value={{
        items,
        total: cartTotal(items),
        units: cartUnits(items),
        addItem,
        removeItem,
        changeQty,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
