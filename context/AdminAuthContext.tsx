"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { setAdminPass } from "@/lib/adminApi";
import { LS_KEYS } from "@/lib/constants";
import { SALON } from "@/lib/constants";

interface AdminAuthContextValue {
  unlocked: boolean;
  getStoredPass: () => string;
  unlock: (pass: string) => boolean;
  changePass: (nueva: string) => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function getStoredPass(): string {
  if (typeof window === "undefined") return SALON.adminPass;
  return localStorage.getItem(LS_KEYS.adminPass) || SALON.adminPass;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);

  const unlock = (pass: string): boolean => {
    if (pass === getStoredPass()) {
      setAdminPass(pass);
      setUnlocked(true);
      return true;
    }
    return false;
  };

  const changePass = (nueva: string) => {
    localStorage.setItem(LS_KEYS.adminPass, nueva);
  };

  return (
    <AdminAuthContext.Provider value={{ unlocked, getStoredPass, unlock, changePass }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth debe usarse dentro de <AdminAuthProvider>");
  return ctx;
}
