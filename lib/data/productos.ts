import type { Producto } from "@/types";

export const PRODUCTOS: Producto[] = [
  // FORTIFICANTE
  { id: "f1", nombre: "Champú Fortificante", desc: "Para cabello dañado y excesivamente tratado. 300 ml.", precio: 19.0, cat: "Fortificante", img: "/assets/fortify-shampoo.webp", badge: "" },
  { id: "f2", nombre: "Acondicionador Fortificante", desc: "Para cabello dañado y excesivamente tratado. 250 ml.", precio: 21.9, cat: "Fortificante", img: "/assets/fortify-conditioner.webp", badge: "" },
  { id: "f3", nombre: "Tratamiento Fortificante", desc: "Para cabello dañado y excesivamente tratado. 250 ml.", precio: 28.65, cat: "Fortificante", img: "/assets/fortify-treatment.webp", badge: "" },
  { id: "f4", nombre: "Multireparador Fortificante", desc: "Para cabello dañado y excesivamente tratado. 100 ml.", precio: 21.9, cat: "Fortificante", img: "/assets/fortify-multi-repair.webp", badge: "" },
  // HIDRANTE
  { id: "h1", nombre: "Champú Hidrante", desc: "Para cabello seco y quebradizo. 300 ml.", precio: 19.0, cat: "Hidrante", img: "/assets/hydrate-shampoo.webp", badge: "" },
  { id: "h2", nombre: "Acondicionador Hidrante", desc: "Para cabello seco y quebradizo. 250 ml.", precio: 21.9, cat: "Hidrante", img: "/assets/hydrate-conditioner.webp", badge: "" },
  { id: "h3", nombre: "Tratamiento Hidrante", desc: "Para cabello seco y quebradizo. 250 ml.", precio: 28.65, cat: "Hidrante", img: "/assets/hydrate-treatment.webp", badge: "" },
  { id: "h4", nombre: "Spray Acondicionador Hidrante", desc: "Para cabello seco y quebradizo. 200 ml.", precio: 21.9, cat: "Hidrante", img: "/assets/hydrate-spray-conditioner.webp", badge: "" },
  // ANTIENCRESPADO
  { id: "a1", nombre: "Champú Antiencrespado", desc: "Para cabello grueso, encrespado y rebelde. 300 ml.", precio: 19.0, cat: "Antiencrespado", img: "/assets/de-frizz-shampoo.webp", badge: "" },
  { id: "a2", nombre: "Tratamiento Antiencrespado", desc: "Para cabello grueso, encrespado y rebelde. 250 ml.", precio: 28.65, cat: "Antiencrespado", img: "/assets/de-frizz-treatment.webp", badge: "" },
  { id: "a3", nombre: "Spray Antiencrespado", desc: "Para cabello grueso, encrespado y rebelde. 200 ml.", precio: 21.9, cat: "Antiencrespado", img: "/assets/de-frizz-spray-conditioner.webp", badge: "" },
  // COLOR RADIANTE
  { id: "c1", nombre: "Champú Color Radiante", desc: "Para cabello coloreado. Preserva la vibrancia del color. 300 ml.", precio: 19.0, cat: "Color Radiante", img: "/assets/vibrancy-shampoo.webp", badge: "" },
  { id: "c2", nombre: "Acondicionador Color Radiante", desc: "Para cabello coloreado. Preserva la vibrancia del color. 250 ml.", precio: 21.9, cat: "Color Radiante", img: "/assets/vibrancy-conditioner.webp", badge: "" },
  { id: "c3", nombre: "Tratamiento Color Radiante", desc: "Para cabello coloreado. Preserva la vibrancia del color. 250 ml.", precio: 28.65, cat: "Color Radiante", img: "/assets/vibrancy-treatment.webp", badge: "" },
  { id: "c4", nombre: "Spray Color Radiante", desc: "Para cabello coloreado. Preserva la vibrancia del color. 200 ml.", precio: 21.9, cat: "Color Radiante", img: "/assets/vibrancy-spray-conditioner.webp", badge: "" },
  // ACEITES & SELLADOR
  { id: "ac1", nombre: "Aceite Enriquecido", desc: "Aceite capilar enriquecido para nutrición profunda. 100 ml.", precio: 28.95, cat: "Aceites", img: "/assets/rich-oil.webp", badge: "" },
  { id: "ac2", nombre: "Aceite Ligero", desc: "Aceite capilar ligero para brillo y suavidad. 100 ml.", precio: 28.95, cat: "Aceites", img: "/assets/light-oil.webp", badge: "" },
  { id: "s1", nombre: "Sellador de Puntas Fibroso", desc: "Sella y repara las puntas dañadas. 150 ml.", precio: 30.8, cat: "Aceites", img: "/assets/fibre-sealer.webp", badge: "" },
];

export const CATEGORIAS_PRODUCTO = [
  "Fortificante",
  "Hidrante",
  "Antiencrespado",
  "Color Radiante",
  "Aceites",
] as const;
