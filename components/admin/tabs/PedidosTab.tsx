"use client";

import { useEffect, useState } from "react";
import { getPedidos, actualizarEstadoPedido } from "@/lib/pedidos";
import type { EstadoPedido, Pedido } from "@/types";

const ESTADOS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  nuevo: { label: "Nuevo", color: "#7C8348", bg: "rgba(124,131,72,0.12)" },
  pendiente: { label: "Nuevo", color: "#7C8348", bg: "rgba(124,131,72,0.12)" },
  preparando: { label: "Preparando", color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  listo: { label: "Listo para recoger", color: "#fb923c", bg: "rgba(251,146,60,0.12)" },
  completado: { label: "Completado", color: "#4ade80", bg: "rgba(74,222,128,0.12)" },
  cancelado: { label: "Cancelado", color: "#e07070", bg: "rgba(224,112,112,0.12)" },
};

const METODO_LABEL: Record<string, string> = {
  tarjeta: "💳 Tarjeta",
  bizum: "📱 Bizum",
  transferencia: "🏦 Transferencia",
  tienda: "🏪 Recogida en tienda",
};

const FILTROS = [
  { k: "todos", label: "Todos" },
  { k: "nuevo", label: "Nuevos" },
  { k: "preparando", label: "Preparando" },
  { k: "listo", label: "Listos" },
  { k: "completado", label: "Completados" },
  { k: "cancelado", label: "Cancelados" },
];

export function PedidosTab() {
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null);
  const [filtro, setFiltro] = useState("todos");
  const [busy, setBusy] = useState<string | null>(null);

  async function reload() {
    const data = await getPedidos();
    setPedidos(data ? Object.values(data).sort((a, b) => b.ts - a.ts) : []);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos del admin
    reload();
  }, []);

  async function marcar(codigo: string, estado: EstadoPedido) {
    if (estado === "cancelado" && !confirm("¿Cancelar este pedido?")) return;
    setBusy(codigo);
    await actualizarEstadoPedido(codigo, estado);
    await reload();
    setBusy(null);
  }

  if (pedidos === null) return <div className="admin-empty">Cargando...</div>;
  if (pedidos.length === 0) return <div className="admin-empty">No hay pedidos todavía</div>;

  const cnt: Record<string, number> = { todos: pedidos.length, nuevo: 0, preparando: 0, listo: 0, completado: 0, cancelado: 0 };
  pedidos.forEach((p) => {
    const e = p.estado === "pendiente" ? "nuevo" : p.estado;
    if (cnt[e] !== undefined) cnt[e]++;
  });

  const visibles =
    filtro === "todos" ? pedidos : pedidos.filter((p) => (p.estado === "pendiente" ? "nuevo" : p.estado) === filtro);

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1rem" }}>
        {FILTROS.map((f) => (
          <button
            key={f.k}
            className={`filter-btn${filtro === f.k ? " active" : ""}`}
            style={{ fontSize: "0.63rem", padding: "0.25rem 0.6rem" }}
            onClick={() => setFiltro(f.k)}
          >
            {f.label}
            {cnt[f.k] > 0 && (
              <span style={{ background: "rgba(124,131,72,0.25)", borderRadius: 20, padding: "0 5px", fontSize: "0.6rem", marginLeft: 4 }}>
                {cnt[f.k]}
              </span>
            )}
          </button>
        ))}
      </div>

      {visibles.length === 0 ? (
        <div className="admin-empty">No hay pedidos en esta categoría</div>
      ) : (
        visibles.map((p) => {
          const estado = p.estado === "pendiente" ? "nuevo" : p.estado;
          const est = ESTADOS_CFG[estado] || ESTADOS_CFG.nuevo;
          const f = new Date(p.ts);
          const fechaStr = `${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear()} ${f.getHours().toString().padStart(2, "0")}:${f.getMinutes().toString().padStart(2, "0")}`;
          return (
            <div
              key={p.codigo}
              className="admin-appt"
              style={{ flexDirection: "column", alignItems: "flex-start", gap: 0, padding: "1rem", marginBottom: "0.7rem", borderLeft: `3px solid ${est.color}` }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", marginBottom: 5 }}>
                <span style={{ fontSize: "0.63rem", fontFamily: "monospace", color: "var(--gold)", letterSpacing: "0.08em" }}>{p.codigo}</span>
                <span style={{ fontSize: "0.63rem", padding: "2px 8px", borderRadius: 20, background: est.bg, color: est.color, fontWeight: 700 }}>{est.label}</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{p.nombre}</div>
              <div style={{ fontSize: "0.73rem", color: "var(--text-muted)", marginBottom: 7 }}>
                {p.contacto} · {fechaStr}
              </div>
              <div style={{ width: "100%", borderTop: "1px solid var(--border)", paddingTop: 7, marginBottom: 5 }}>
                {p.items.map((i) => (
                  <div key={i.id} style={{ fontSize: "0.72rem", color: "var(--text-muted)", padding: "1px 0" }}>
                    {i.nombre} ×{i.qty} — {(i.precio * i.qty).toFixed(2)} €
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                <span style={{ fontSize: "0.77rem", color: "var(--text-muted)" }}>{METODO_LABEL[p.metodo] || p.metodo}</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--gold)" }}>{p.total?.toFixed(2).replace(".", ",")} €</span>
              </div>
              {!["completado", "cancelado"].includes(estado) && (
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.3rem" }}>
                  {estado === "nuevo" && (
                    <button className="ped-btn blue" disabled={busy === p.codigo} onClick={() => marcar(p.codigo, "preparando")}>
                      📦 Preparar pedido
                    </button>
                  )}
                  {estado === "preparando" && (
                    <button className="ped-btn orange" disabled={busy === p.codigo} onClick={() => marcar(p.codigo, "listo")}>
                      🏪 Listo para recoger
                    </button>
                  )}
                  {estado === "listo" && (
                    <button className="ped-btn green" disabled={busy === p.codigo} onClick={() => marcar(p.codigo, "completado")}>
                      ✅ Marcar completado
                    </button>
                  )}
                  <button className="ped-btn red" disabled={busy === p.codigo} onClick={() => marcar(p.codigo, "cancelado")}>
                    ✕ Cancelar
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
