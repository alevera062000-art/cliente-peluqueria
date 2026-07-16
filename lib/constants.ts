export const SALON = {
  diasAbiertos: [1, 2, 3, 4, 5, 6] as number[], // 0=dom, 1=lun ... 6=sab
  horaInicio: 9,
  horaFin: 19,
  horaSabFin: 14,
  duracion: 60,
  adminPass: "BN2026",
  telefono: "627 052 418",
  telefonoIntl: "+34627052418",
  whatsapp: "34627052418",
  direccion: "C. Puerta Canseco, 14",
  localidad: "Santa Cruz de Tenerife",
  codigoPostal: "38003",
  instagram: "https://www.instagram.com/bn_estilistas",
} as const;

export const LS_KEYS = {
  citas: "bn-citas-v1",
  carrito: "bn_carrito",
  productos: "bn_productos",
  servicios: "bn_servicios",
  adminPass: "bn_admin_pass",
  cookies: "bn_cookies",
} as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
