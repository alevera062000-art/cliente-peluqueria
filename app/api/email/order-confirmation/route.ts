import { NextResponse } from "next/server";
import type { CartItem } from "@/types";

export async function POST(request: Request) {
  try {
    const { nombre, email, codigo, items, total } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ sent: false, reason: "email inválido" }, { status: 400 });
    }
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ sent: false, reason: "RESEND_API_KEY no configurada" });
    }

    const itemsHtml = (items as CartItem[])
      .map(
        (i) => `
      <div style="display:flex;justify-content:space-between;font-size:0.88rem;color:#333;padding:6px 0;border-bottom:1px solid #eee">
        <span>${i.nombre} ×${i.qty}</span>
        <span>${(i.precio * i.qty).toFixed(2).replace(".", ",")} €</span>
      </div>`,
      )
      .join("");

    const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Arial,sans-serif">
  <div style="max-width:520px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="background:#090c13;padding:28px 32px;text-align:center">
      <div style="font-size:1.5rem;font-weight:700;color:#c9a84c;letter-spacing:0.12em;text-transform:uppercase">BN Estilistas</div>
      <div style="color:#7e8a9a;font-size:0.8rem;margin-top:4px;letter-spacing:0.08em">SANTA CRUZ DE TENERIFE</div>
    </div>
    <div style="padding:32px">
      <p style="margin:0 0 8px;font-size:1rem;color:#222">Hola, <strong>${nombre}</strong> 👋</p>
      <p style="margin:0 0 24px;font-size:0.95rem;color:#555">Tu pedido ha sido reservado. Te avisamos cuando esté listo para recoger.</p>
      <div style="background:#f9f6f0;border-left:4px solid #c9a84c;border-radius:8px;padding:18px 20px;margin-bottom:20px">
        <div style="font-size:0.8rem;color:#999;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Número de pedido</div>
        <div style="font-size:1.1rem;font-weight:700;color:#222">${codigo}</div>
      </div>
      <div style="margin-bottom:16px">
        ${itemsHtml}
        <div style="display:flex;justify-content:space-between;font-size:0.95rem;font-weight:700;color:#222;padding-top:10px">
          <span>Total</span>
          <span>${Number(total).toFixed(2).replace(".", ",")} €</span>
        </div>
      </div>
      <p style="margin:0 0 6px;font-size:0.85rem;color:#555">📍 Recogida y pago en tienda: C. Puerta Canseco, 14 · 38003 Santa Cruz de Tenerife</p>
      <p style="margin:0;font-size:0.8rem;color:#999">¿Alguna duda con tu pedido? Llámanos al <strong>643 50 36 18</strong>.<br>¡Gracias por tu compra! 💛</p>
    </div>
    <div style="background:#090c13;padding:16px 32px;text-align:center">
      <p style="margin:0;font-size:0.72rem;color:#7e8a9a">BN Estilistas · C. Puerta Canseco, 14, 38003 Santa Cruz de Tenerife</p>
    </div>
  </div>
</body>
</html>`;

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BN Estilistas <info@bnestilistas.com>",
        to: [email],
        subject: `Pedido confirmado: ${codigo} 🛍️`,
        html,
      }),
    });

    return NextResponse.json({ sent: emailRes.ok });
  } catch {
    return NextResponse.json({ sent: false, reason: "error interno" }, { status: 500 });
  }
}
