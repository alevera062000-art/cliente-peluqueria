"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

const LINKS = [
  { href: "#nosotros", label: "Nosotros" },
  { href: "#servicios", label: "Servicios" },
  { href: "#galeria", label: "Galería" },
  { href: "#tienda", label: "Tienda" },
  { href: "#reservas", label: "Reservas" },
  { href: "#contacto", label: "Contacto" },
];

export function Navbar({ onOpenCart }: { onOpenCart: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { units } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 55);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className={`mobile-menu${menuOpen ? " open" : ""}`} id="mobileMenu">
        <button className="mobile-close" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B98CA0" strokeWidth="1.5" strokeLinecap="round">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="mobile-link" onClick={() => setMenuOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="tel:627052418" className="mobile-link" style={{ color: "var(--gold)" }} onClick={() => setMenuOpen(false)}>
          627 052 418
        </a>
      </div>

      <nav id="navbar" className={scrolled ? "scrolled" : ""}>
        <a href="#inicio" className="nav-logo" onClick={() => setMenuOpen(false)}>
          <Image src="/assets/logo.png" alt="BN Estilistas" width={42} height={42} />
          <div>
            <div className="logo-fallback">BN Estilistas</div>
            <div className="nav-tagline">Peluquería & Belleza</div>
          </div>
        </a>

        <ul className="nav-links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>

        <button className="cart-icon-btn" onClick={onOpenCart} title="Ver carrito" aria-label="Abrir carrito">
          <svg viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <span className={`cart-count${units > 0 ? " visible" : ""}`} id="cartCount">
            {units}
          </span>
        </button>
        <a href="tel:627052418" className="nav-cta">
          627 052 418
        </a>

        <div className="hamburger" id="hamburger" role="button" aria-label="Abrir menú" onClick={() => setMenuOpen(true)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
    </>
  );
}
