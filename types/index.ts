export interface Producto {
  id: string;
  nombre: string;
  desc: string;
  precio: number;
  cat: string;
  img: string;
  badge: string;
}

export interface ProductoOverride {
  stock?: boolean;
  descuento?: number;
}

export interface ProductoConOverride extends Producto {
  agotado: boolean;
  descuento: number;
  precioFinal: number;
}

export interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  icon: string;
  desc: string;
  img?: string;
}

export interface ServicioOverride {
  precio?: number;
  activo?: boolean;
  custom?: boolean;
  nombre?: string;
  desc?: string;
  icon?: string;
}

export interface ServicioConOverride extends Servicio {
  activo: boolean;
  custom?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  qty: number;
  img?: string;
}

export type EstadoPedido =
  | "pendiente"
  | "nuevo"
  | "preparando"
  | "enviado"
  | "listo"
  | "completado"
  | "cancelado";

export interface Pedido {
  codigo: string;
  nombre: string;
  telefono: string;
  email: string;
  contacto: string;
  metodo: "tienda";
  items: CartItem[];
  total: number;
  ts: number;
  estado: EstadoPedido;
}

export interface Cita {
  nombre: string;
  telefono: string;
  email?: string;
  servicio: string;
  date: string;
  time: string;
  cancelToken: string;
  ts: number;
}

export interface CancelToken {
  date: string;
  slot: string;
  nombre: string;
  servicio: string;
}

export interface Recordatorio {
  id?: string;
  tipo: string;
  titulo: string;
  fecha: string;
  hora?: string;
  notas?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type ChatState =
  | "IDLE"
  | "BOOKING_DATE"
  | "BOOKING_TIME"
  | "BOOKING_NAME"
  | "BOOKING_PHONE"
  | "BOOKING_SERVICE"
  | "BOOKING_CONFIRM";

export type AdminAction =
  | "GET_CITAS"
  | "GET_PEDIDOS"
  | "UPDATE_PEDIDO_ESTADO"
  | "DELETE_PEDIDO"
  | "CANCEL_APPT"
  | "GET_RECORDATORIOS"
  | "SAVE_RECORDATORIO"
  | "DELETE_RECORDATORIO"
  | "UPDATE_PRODUCTO"
  | "DELETE_PRODUCTO"
  | "UPDATE_SERVICIO"
  | "DELETE_SERVICIO";
