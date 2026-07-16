"use client";

import { useState } from "react";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import { AdminPasswordGate } from "@/components/admin/AdminPasswordGate";
import { ChangePasswordSection } from "@/components/admin/ChangePasswordSection";
import { CitasTab } from "@/components/admin/tabs/CitasTab";
import { PedidosTab } from "@/components/admin/tabs/PedidosTab";
import { AgendaTab } from "@/components/admin/tabs/AgendaTab";
import { TiendaTab } from "@/components/admin/tabs/TiendaTab";
import { ServiciosTab } from "@/components/admin/tabs/ServiciosTab";

type Tab = "citas" | "pedidos" | "agenda" | "productos" | "servicios";

const TABS: { key: Tab; label: string }[] = [
  { key: "citas", label: "Citas" },
  { key: "pedidos", label: "Pedidos" },
  { key: "agenda", label: "Agenda" },
  { key: "productos", label: "Tienda" },
  { key: "servicios", label: "Servicios" },
];

interface AdminDrawerProps {
  open: boolean;
  onClose: () => void;
}

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("citas");

  return (
    <div id="adminDash">
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.2rem", flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`filter-btn${tab === t.key ? " active" : ""}`}
            style={{ flex: 1, minWidth: 70 }}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "citas" && <CitasTab />}
      {tab === "pedidos" && <PedidosTab />}
      {tab === "agenda" && <AgendaTab />}
      {tab === "productos" && <TiendaTab />}
      {tab === "servicios" && <ServiciosTab />}

      <div style={{ marginTop: "1.5rem", borderTop: tab !== "citas" ? "1px solid var(--border)" : undefined, paddingTop: tab !== "citas" ? "1.2rem" : undefined }}>
        <ChangePasswordSection />
      </div>
    </div>
  );
}

function AdminBody() {
  const { unlocked } = useAdminAuth();
  return unlocked ? <AdminDashboard /> : <AdminPasswordGate />;
}

export function AdminDrawer({ open, onClose }: AdminDrawerProps) {
  return (
    <AdminAuthProvider>
      <div className={`admin-overlay${open ? " open" : ""}`} onClick={onClose} />
      <div className={`admin-drawer${open ? " open" : ""}`}>
        <div className="admin-head">
          <div>
            <div className="admin-head-sub">Panel de gestión</div>
            <h2>BN Estilistas</h2>
          </div>
          <button
            onClick={onClose}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(124,131,72,0.1)", border: "1px solid var(--gold)", borderRadius: 8, color: "var(--gold)", padding: "0.5rem 1rem", cursor: "pointer", fontFamily: "var(--font-raleway), sans-serif", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em" }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Volver a la web
          </button>
        </div>
        <div className="admin-body">
          <AdminBody />
        </div>
      </div>
    </AdminAuthProvider>
  );
}
