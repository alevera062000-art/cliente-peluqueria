"use client";

import { useState } from "react";
import { useProductosOverrides } from "@/hooks/useProductosOverrides";
import { saveProductoOverride, deleteProductoOverride } from "@/lib/cart";
import { CATEGORIAS_PRODUCTO } from "@/lib/data/productos";

export function TiendaTab() {
  const { productos, loading, reload } = useProductosOverrides();
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("");
  const [badge, setBadge] = useState("");
  const [img, setImg] = useState("");

  async function toggleStock(id: string, enStock: boolean) {
    await saveProductoOverride(id, { stock: enStock });
    reload();
  }

  async function setDescuento(id: string, valor: string) {
    const pct = Math.min(90, Math.max(0, parseInt(valor, 10) || 0));
    await saveProductoOverride(id, { descuento: pct });
    reload();
  }

  async function handleGuardar() {
    const precioNum = parseFloat(precio);
    if (!nombre.trim() || !precioNum || !cat) {
      alert("Rellena nombre, precio y categoría");
      return;
    }
    const id = "custom_" + Date.now();
    await saveProductoOverride(id, {
      nombre: nombre.trim(),
      precio: precioNum,
      cat,
      desc: desc.trim(),
      img: img.trim(),
      badge: badge.trim(),
      stock: true,
      custom: true,
    });
    setNombre("");
    setPrecio("");
    setDesc("");
    setCat("");
    setBadge("");
    setImg("");
    reload();
  }

  async function handleEliminar(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    await deleteProductoOverride(id);
    reload();
  }

  if (loading) return <div className="admin-empty">Cargando...</div>;

  const cats = [...new Set(productos.map((p) => p.cat))];

  return (
    <div>
      <div className="add-prod-form">
        <h4>+ Añadir producto nuevo</h4>
        <div className="prod-form-grid">
          <div className="fg" style={{ marginBottom: 0 }}>
            <label>Nombre *</label>
            <input type="text" className="admin-pass-input" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Mascarilla Reparadora" />
          </div>
          <div className="fg" style={{ marginBottom: 0 }}>
            <label>Precio (€) *</label>
            <input type="number" className="admin-pass-input" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="24.90" step="0.01" min="0" />
          </div>
        </div>
        <div className="fg" style={{ marginBottom: "0.6rem" }}>
          <label>Descripción</label>
          <input type="text" className="admin-pass-input" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Ej: Para cabello seco. 250 ml." />
        </div>
        <div className="prod-form-grid">
          <div className="fg" style={{ marginBottom: 0 }}>
            <label>Categoría *</label>
            <select className="admin-pass-input" value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="">— Elige —</option>
              {CATEGORIAS_PRODUCTO.map((c) => (
                <option key={c}>{c}</option>
              ))}
              <option>Otro</option>
            </select>
          </div>
          <div className="fg" style={{ marginBottom: 0 }}>
            <label>Etiqueta (opcional)</label>
            <input type="text" className="admin-pass-input" value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Ej: Nuevo, Oferta..." />
          </div>
        </div>
        <div className="fg" style={{ marginBottom: "0.8rem" }}>
          <label>URL de la imagen</label>
          <input type="url" className="admin-pass-input" value={img} onChange={(e) => setImg(e.target.value)} placeholder="https://... o /assets/nombre.webp" />
        </div>
        <button onClick={handleGuardar} className="btn-primary" style={{ width: "100%" }}>
          Guardar producto
        </button>
      </div>

      <div className="prod-admin-list">
        {cats.map((cat) => (
          <div key={cat}>
            <div className="prod-cat-group">{cat}</div>
            {productos
              .filter((p) => p.cat === cat)
              .map((p) => (
                <div className={`prod-admin-item${p.agotado ? " agotado" : ""}`} key={p.id}>
                  {p.img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="prod-admin-thumb" src={p.img} alt="" />
                  )}
                  <div className="prod-admin-info">
                    <div className="prod-admin-name">{p.nombre}</div>
                    <div className="prod-admin-meta">
                      {p.precio.toFixed(2)}€ ·{" "}
                      {p.agotado ? <span style={{ color: "#e07070" }}>Agotado</span> : <span style={{ color: "#4ade80" }}>En stock</span>}
                    </div>
                  </div>
                  <div className="desc-input-wrap" title="Descuento %">
                    <input
                      className="desc-input"
                      type="number"
                      min={0}
                      max={90}
                      defaultValue={p.descuento || 0}
                      onBlur={(e) => setDescuento(p.id, e.target.value)}
                      placeholder="0"
                    />
                    <span className="desc-pct">%</span>
                  </div>
                  <label className="stock-toggle" title="Stock">
                    <input type="checkbox" checked={!p.agotado} onChange={(e) => toggleStock(p.id, e.target.checked)} />
                    <span className="stock-slider" />
                  </label>
                  {p.id.startsWith("custom_") && (
                    <button className="prod-admin-del" onClick={() => handleEliminar(p.id)} title="Eliminar">
                      ✕
                    </button>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
