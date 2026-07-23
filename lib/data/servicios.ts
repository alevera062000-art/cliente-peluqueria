import type { Servicio } from "@/types";

// ► SERVICIOS BASE — precio 0 significa "Consultar" ◄
export const SERVICIOS: Servicio[] = [
  {
    id: "sv6",
    nombre: "Keratin Infusion",
    precio: 210,
    icon: "tratamiento",
    img: "/assets/goa-keratin-infusion.webp",
    desc: "Consigue un cabello liso, brillante y sin encrespamiento con el tratamiento profesional de Goa Organics. Reconstruye la fibra capilar desde el interior, controla el frizz y proporciona un acabado sedoso y duradero. Resultados de hasta seis meses con el mantenimiento adecuado.",
  },
  {
    id: "sv7",
    nombre: "Softy Mood",
    precio: 130,
    icon: "tratamiento",
    img: "/assets/goa-softy-mood.webp",
    desc: "El tratamiento perfecto para eliminar el encrespamiento manteniendo la forma natural del cabello. Ideal para cabellos lisos, ondulados o rizados que buscan hidratación, brillo y un acabado natural durante hasta 12 semanas.",
  },
  {
    id: "sv8",
    nombre: "Sublime 10·31",
    precio: 75,
    icon: "tratamiento",
    img: "/assets/goa-sublime-10-31.webp",
    desc: "Tratamiento profesional de reconstrucción profunda que repara la fibra capilar desde el interior, recuperando elasticidad, hidratación y brillo. Especialmente recomendado para cabellos dañados, secos o tratados químicamente.",
  },
  {
    id: "sv9",
    nombre: "Bae Berry",
    precio: 40,
    icon: "tratamiento",
    img: "/assets/goa-bae-berry.webp",
    desc: "Tratamiento flash reparador que fortalece la fibra capilar y devuelve suavidad, brillo y un aspecto saludable al cabello dañado desde la primera sesión.",
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
