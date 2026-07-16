import type { Pedido } from "@/types";

const EMAIL_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "",
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
  templateCliente: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CLIENTE || "",
  templateAdmin: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ADMIN || "",
  businessEmail: process.env.NEXT_PUBLIC_EMAILJS_BUSINESS_EMAIL || "",
};

const METODO_NOMBRE: Record<string, string> = {
  tarjeta: "Tarjeta de crédito/débito",
  bizum: "Bizum",
  transferencia: "Transferencia bancaria",
  tienda: "Recogida en tienda",
};

export async function sendInvoiceEmail(pedido: Pedido, emailCliente: string): Promise<void> {
  if (!EMAIL_CONFIG.publicKey) return; // no configurado todavía, igual que en el sitio original

  const { default: emailjs } = await import("@emailjs/browser");
  emailjs.init({ publicKey: EMAIL_CONFIG.publicKey });

  const itemsList = pedido.items
    .map((i) => `• ${i.nombre} ×${i.qty}  →  ${(i.precio * i.qty).toFixed(2)}€`)
    .join("\n");
  const fecha = new Date(pedido.ts);
  const fechaStr = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()} ${fecha
    .getHours()
    .toString()
    .padStart(2, "0")}:${fecha.getMinutes().toString().padStart(2, "0")}`;

  const params = {
    order_code: pedido.codigo,
    order_date: fechaStr,
    customer_name: pedido.nombre,
    customer_phone: pedido.telefono || "",
    customer_email: emailCliente || "",
    items_list: itemsList,
    total: pedido.total.toFixed(2).replace(".", ",") + " €",
    payment_method: METODO_NOMBRE[pedido.metodo] || pedido.metodo,
  };

  try {
    if (emailCliente && emailCliente.includes("@")) {
      await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateCliente, {
        ...params,
        to_name: pedido.nombre,
        to_email: emailCliente,
      });
    }
    if (EMAIL_CONFIG.businessEmail) {
      await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateAdmin, {
        ...params,
        to_name: "BN Estilistas",
        to_email: EMAIL_CONFIG.businessEmail,
      });
    }
  } catch (e) {
    console.warn("EmailJS:", e);
  }
}
