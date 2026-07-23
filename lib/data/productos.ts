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
  // GOA ORGANICS
  { id: "g1", nombre: "L'Essentiel Shampoo", desc: "Champú nutritivo para cabello seco o dañado. 300 ml.", precio: 28.95, cat: "Goa Organics", img: "/assets/goa-lessentiel-shampoo.webp", badge: "" },
  { id: "g2", nombre: "Melrose Shampoo", desc: "Champú hidratante para uso frecuente. 250 ml.", precio: 29.95, cat: "Goa Organics", img: "/assets/goa-melrose-shampoo.webp", badge: "" },
  { id: "g3", nombre: "Le Blonde Shampoo", desc: "Champú matizador para cabellos rubios o con mechas. 300 ml.", precio: 28.95, cat: "Goa Organics", img: "/assets/goa-le-blonde-shampoo.webp", badge: "" },
  { id: "g4", nombre: "L'Essentiel Mask", desc: "Mascarilla reparadora de nutrición intensa. 200 g.", precio: 40.95, cat: "Goa Organics", img: "/assets/goa-lessentiel-mask.webp", badge: "" },
  { id: "g5", nombre: "Tasmania Mask", desc: "Mascarilla hidratante para restaurar la fibra capilar. 200 g.", precio: 40.95, cat: "Goa Organics", img: "/assets/goa-tasmania-mask.webp", badge: "" },
  { id: "g6", nombre: "Cotton Lust", desc: "Tratamiento de acabado para aportar suavidad y brillo. 50 ml.", precio: 33.95, cat: "Goa Organics", img: "/assets/goa-cotton-lust.webp", badge: "" },
  { id: "g7", nombre: "Hair Bloom", desc: "Suplemento para fortalecer y favorecer el crecimiento del cabello. 200 g.", precio: 49.95, cat: "Goa Organics", img: "/assets/goa-hair-bloom.webp", badge: "" },
  { id: "g8", nombre: "Melrose Conditioner", desc: "Acondicionador hidratante para uso diario. 200 g.", precio: 30.95, cat: "Goa Organics", img: "/assets/goa-melrose-conditioner.webp", badge: "" },
  { id: "g9", nombre: "South Bondi", desc: "Protector capilar con protección térmica y frente a los rayos UV. 200 g.", precio: 35.0, cat: "Goa Organics", img: "/assets/goa-south-bondi.webp", badge: "" },
];

export const CATEGORIAS_PRODUCTO = [
  "Fortificante",
  "Hidrante",
  "Antiencrespado",
  "Color Radiante",
  "Aceites",
  "Goa Organics",
] as const;
