"use client";

import { useState } from "react";
import Image from "next/image";
import { useProductosOverrides } from "@/hooks/useProductosOverrides";
import { useCart } from "@/context/CartContext";
import { Reveal } from "@/components/ui/Reveal";

const FILTROS = [
  { label: "Fortificante", cat: "Fortificante" },
  { label: "Hidrante", cat: "Hidrante" },
  { label: "Antiencrespado", cat: "Antiencrespado" },
  { label: "Color Radiante", cat: "Color Radiante" },
  { label: "Aceites & Sellador", cat: "Aceites" },
  { label: "Goa Organics", cat: "Goa Organics" },
];

export function Shop() {
  const { productos } = useProductosOverrides();
  const { addItem } = useCart();
  const [activeCat, setActiveCat] = useState("Fortificante");

  const lista = productos.filter((p) => p.cat === activeCat);

  return (
    <section id="tienda">
      <div className="container">
        <Reveal className="reveal" style={{ marginBottom: "2.8rem", textAlign: "center" }}>
          <span className="label">Nuestros productos</span>
          <h2 className="section-title" style={{ marginTop: "0.5rem" }}>
            Llévate el salón a casa
          </h2>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              marginTop: "0.8rem",
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.75,
            }}
          >
            Productos profesionales de las marcas que usamos a diario, disponibles para que los
            disfrutes en casa.
          </p>
        </Reveal>

        <Reveal className="shop-filters reveal">
          {FILTROS.map((f) => (
            <button
              key={f.cat}
              className={`filter-btn${activeCat === f.cat ? " active" : ""}`}
              onClick={() => setActiveCat(f.cat)}
            >
              {f.label}
            </button>
          ))}
        </Reveal>

        <div className="shop-grid" id="shopGrid">
          {lista.map((p) => (
            <div key={p.id} className={`prod-card reveal visible${p.agotado ? " agotado" : ""}`} data-cat={p.cat}>
              <div className="prod-img">
                {p.img ? (
                  <Image
                    src={p.img}
                    alt={p.nombre}
                    fill
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="prod-img-ph">
                    <svg viewBox="0 0 24 24">
                      <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                      <path d="M16 3H8L6 7h12l-2-4z" />
                    </svg>
                    <span>Foto próximamente</span>
                  </div>
                )}
                {p.descuento > 0 ? (
                  <span className="prod-badge-desc">-{p.descuento}%</span>
                ) : p.badge ? (
                  <span className="prod-badge">{p.badge}</span>
                ) : null}
              </div>
              <div className="prod-info">
                <span className="prod-cat">{p.cat}</span>
                <div className="prod-name">{p.nombre}</div>
                <div className="prod-desc">{p.desc}</div>
                <div className="prod-footer">
                  <div className="prod-price">
                    {p.descuento > 0 && (
                      <span className="prod-price-old">€{p.precio.toFixed(2).replace(".", ",")}</span>
                    )}
                    <sup>€</sup>
                    {p.precioFinal.toFixed(2).replace(".", ",")}
                  </div>
                  {!p.agotado ? (
                    <button className="btn-add" onClick={() => addItem(p)} title="Añadir al carrito">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  ) : (
                    <span style={{ fontSize: "0.7rem", color: "#e07070", fontWeight: 600 }}>Agotado</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
