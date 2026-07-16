"use client";

import { useEffect, useState } from "react";
import { getRecordatorios, saveRecordatorio, getRecordatorio, deleteRecordatorio } from "@/lib/recordatorios";
import type { Recordatorio } from "@/types";

export function AgendaTab() {
  const [items, setItems] = useState<(Recordatorio & { id: string })[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tipo, setTipo] = useState("");
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [notas, setNotas] = useState("");

  async function reload() {
    const data = await getRecordatorios();
    if (!data) {
      setItems([]);
      return;
    }
    setItems(
      Object.entries(data)
        .map(([id, r]) => ({ id, ...r }))
        .sort((a, b) => a.fecha.localeCompare(b.fecha)),
    );
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos del admin
    reload();
  }, []);

  function resetForm() {
    setTipo("");
    setTitulo("");
    setFecha("");
    setHora("");
    setNotas("");
    setEditingId(null);
  }

  async function handleGuardar() {
    if (!tipo) {
      alert("Elige el tipo de tarea");
      return;
    }
    if (!titulo.trim()) {
      alert("Escribe un detalle");
      return;
    }
    if (!fecha) {
      alert("Elige una fecha");
      return;
    }
    await saveRecordatorio(editingId, { tipo, titulo: titulo.trim(), fecha, hora, notas: notas.trim() });
    resetForm();
    await reload();
  }

  async function handleEditar(id: string) {
    const r = await getRecordatorio(id);
    if (!r) return;
    setTipo(r.tipo || "");
    setTitulo(r.titulo || "");
    setFecha(r.fecha || "");
    setHora(r.hora || "");
    setNotas(r.notas || "");
    setEditingId(id);
  }

  async function handleBorrar(id: string) {
    if (!confirm("¿Borrar este recordatorio?")) return;
    await deleteRecordatorio(id);
    await reload();
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div style={{ background: "var(--dark-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "1rem", marginBottom: "1rem" }}>
        <select className="admin-pass-input" value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ marginBottom: "0.6rem" }}>
          <option value="">— Tipo de tarea —</option>
          <option value="Proveedores">🚚 Proveedores</option>
          <option value="Otros">📌 Otros</option>
        </select>
        <input
          className="admin-pass-input"
          type="text"
          placeholder="Detalle: Llegada Schwarzkopf, Pago alquiler..."
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          style={{ marginBottom: "0.6rem" }}
        />
        <div style={{ display: "flex", gap: "0.6rem", marginBottom: "0.6rem" }}>
          <input className="admin-pass-input" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} style={{ flex: 1 }} />
          <input className="admin-pass-input" type="time" value={hora} onChange={(e) => setHora(e.target.value)} style={{ flex: "0 0 110px" }} />
        </div>
        <textarea
          className="admin-pass-input"
          rows={2}
          placeholder="Notas adicionales (opcional)..."
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          style={{ resize: "vertical", fontFamily: "var(--font-raleway), sans-serif", marginBottom: "0.7rem" }}
        />
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn-co-next" onClick={handleGuardar}>
            {editingId ? "Actualizar recordatorio" : "Guardar recordatorio"}
          </button>
          {editingId && (
            <button className="btn-co-back" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      {!items ? (
        <div className="admin-empty">Cargando...</div>
      ) : items.length === 0 ? (
        <div className="admin-empty">
          No hay recordatorios.
          <br />
          ¡Añade el primero arriba!
        </div>
      ) : (
        items.map((r) => {
          const isPast = r.fecha < today;
          const isToday = r.fecha === today;
          const d = new Date(r.fecha + "T12:00:00");
          const fechaStr = d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
          const color = isPast ? "var(--text-muted)" : isToday ? "var(--gold)" : "var(--text)";
          const tipoIcon = r.tipo === "Proveedores" ? "🚚" : "📌";
          return (
            <div className={`agenda-item ${isPast ? "past" : isToday ? "today" : ""}`} key={r.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ marginBottom: 4 }}>
                    {r.tipo && (
                      <span style={{ fontSize: "0.65rem", background: "rgba(124,131,72,0.12)", color: "var(--gold)", border: "1px solid var(--border)", padding: "1px 8px", borderRadius: 20, marginRight: 6 }}>
                        {tipoIcon} {r.tipo}
                      </span>
                    )}
                    {isToday && (
                      <span style={{ background: "var(--gold)", color: "var(--dark)", fontSize: "0.58rem", padding: "1px 7px", borderRadius: 20, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Hoy
                      </span>
                    )}
                  </div>
                  <div style={{ fontWeight: 600, color, fontSize: "0.88rem", marginBottom: 2 }}>{r.titulo}</div>
                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                    📅 {fechaStr}
                    {r.hora ? `  🕐 ${r.hora}` : ""}
                  </div>
                  {r.notas && (
                    <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 4, fontStyle: "italic" }}>📝 {r.notas}</div>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.35rem", flexShrink: 0 }}>
                  <button className="ag-btn" onClick={() => handleEditar(r.id)}>
                    Editar
                  </button>
                  <button className="ag-btn del" onClick={() => handleBorrar(r.id)}>
                    Borrar
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
