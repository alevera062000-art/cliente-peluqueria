"use client";

import { useState } from "react";
import { useServiciosOverrides } from "@/hooks/useServiciosOverrides";
import { saveServicioOverride, deleteServicioOverride } from "@/lib/servicios";

export function ServiciosTab() {
  const { servicios, loading, reload } = useServiciosOverrides(true);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [desc, setDesc] = useState("");

  async function setPrecioServicio(id: string, valor: string) {
    const precioNum = Math.max(0, parseFloat(valor) || 0);
    await saveServicioOverride(id, { precio: precioNum });
    reload();
  }

  async function toggleActivo(id: string, activo: boolean) {
    await saveServicioOverride(id, { activo });
    reload();
  }

  async function handleGuardar() {
    if (!nombre.trim()) {
      alert("Escribe el nombre del servicio");
      return;
    }
    const id = "custom_sv_" + Date.now();
    await saveServicioOverride(id, {
      nombre: nombre.trim(),
      precio: parseFloat(precio) || 0,
      desc: desc.trim(),
      icon: "estrella",
      activo: true,
      custom: true,
    });
    setNombre("");
    setPrecio("");
    setDesc("");
    reload();
  }

  async function handleEliminar(id: string) {
    if (!confirm("¿Eliminar este servicio de la web?")) return;
    await deleteServicioOverride(id);
    reload();
  }

  if (loading) return <div className="admin-empty">Cargando...</div>;

  return (
    <div>
      <div className="add-prod-form">
        <h4>+ Añadir servicio nuevo</h4>
        <div className="prod-form-grid">
          <div className="fg" style={{ marginBottom: 0 }}>
            <label htmlFor="svNombre">Nombre *</label>
            <input id="svNombre" type="text" className="admin-pass-input" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Manicura" />
          </div>
          <div className="fg" style={{ marginBottom: 0 }}>
            <label htmlFor="svPrecio">Precio desde (€) *</label>
            <input id="svPrecio" type="number" inputMode="decimal" className="admin-pass-input" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="25.00" step="0.01" min="0" />
          </div>
        </div>
        <div className="fg" style={{ marginBottom: "0.8rem" }}>
          <label htmlFor="svDesc">Descripción</label>
          <input id="svDesc" type="text" className="admin-pass-input" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Breve descripción del servicio" />
        </div>
        <button onClick={handleGuardar} className="btn-primary" style={{ width: "100%" }}>
          Guardar servicio
        </button>
      </div>

      <div className="prod-admin-list">
        {servicios.map((s) => (
          <div className={`prod-admin-item${!s.activo ? " agotado" : ""}`} key={s.id}>
            <div className="prod-admin-info">
              <div className="prod-admin-name">{s.nombre}</div>
              <div className="prod-admin-meta">
                {s.activo ? <span style={{ color: "#4ade80" }}>Visible en la web</span> : <span style={{ color: "#e07070" }}>Oculto en la web</span>}
              </div>
            </div>
            <div className="desc-input-wrap" title="Precio desde (€)">
              <span className="desc-pct">€</span>
              <input
                className="desc-input"
                style={{ width: 66 }}
                type="number"
                min={0}
                step="0.01"
                defaultValue={s.precio || 0}
                onBlur={(e) => setPrecioServicio(s.id, e.target.value)}
                placeholder="0"
              />
            </div>
            <label className="stock-toggle" title="Mostrar en la web">
              <input type="checkbox" checked={s.activo} onChange={(e) => toggleActivo(s.id, e.target.checked)} />
              <span className="stock-slider" />
            </label>
            {s.custom && (
              <button className="prod-admin-del" onClick={() => handleEliminar(s.id)} title="Eliminar">
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
