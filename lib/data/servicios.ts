import type { Servicio } from "@/types";

// ► SERVICIOS BASE — precio 0 significa "Consultar" ◄
export const SERVICIOS: Servicio[] = [
  {
    id: "sv1",
    nombre: "Corte, peinado y coloración",
    precio: 0,
    icon: "corte",
    desc: "Cortes personalizados, peinados para cualquier ocasión y coloración profesional con técnicas modernas adaptadas a tu tipo de cabello y estilo.",
  },
  {
    id: "sv2",
    nombre: "Tratamientos capilares",
    precio: 0,
    icon: "tratamiento",
    desc: "Tratamientos especializados para el cuidado y reparación del cabello. Hidratación, nutrición y recuperación del brillo natural de tu melena.",
  },
  {
    id: "sv3",
    nombre: "Diseño y definición de cejas",
    precio: 0,
    icon: "cejas",
    desc: "Diseño, depilación y definición de cejas para enmarcar tu mirada. Técnicas precisas adaptadas a tu morfología facial para un resultado natural y armonioso.",
  },
  {
    id: "sv4",
    nombre: "Laminado y tinte de cejas",
    precio: 0,
    icon: "laminado",
    desc: "Laminado para ordenar y fijar los vellos con un resultado definido, y tinte para intensificar el color y dar mayor presencia a tu mirada durante semanas.",
  },
  {
    id: "sv5",
    nombre: "Extensiones de pestañas",
    precio: 0,
    icon: "pestanas",
    desc: 'Colocación de extensiones con técnicas <strong>clásicas, volumen e híbridas</strong> para conseguir el efecto deseado. Realizamos también mantenimiento y retoques periódicos para mantener tu look siempre impecable.',
  },
];

export const ICONS_SERVICIO: Record<string, string> = {
  corte: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/>',
  tratamiento: '<path d="M12 2l1.8 5.4L19.2 9l-5.4 1.8L12 16.2l-1.8-5.4L4.8 9l5.4-1.8L12 2z"/><path d="M19 14l.9 2.7L22 17.6l-2.1.9L19 21l-.9-2.1-2.1-.9 2.1-.9L19 14z" stroke-opacity="0.5"/>',
  cejas: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/><path d="M8 7.5C9 5.5 10.5 4.5 12 4.5s3 1 4 2.5" stroke-opacity="0.55"/>',
  laminado: '<path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>',
  pestanas: '<polyline points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  estrella: '<path d="M12 2l1.8 5.4L19.2 9l-5.4 1.8L12 16.2l-1.8-5.4L4.8 9l5.4-1.8L12 2z"/>',
};
