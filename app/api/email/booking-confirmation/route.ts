import { NextResponse } from "next/server";

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export async function POST(request: Request) {
  try {
    const { nombre, email, date, time, servicio, token } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ sent: false, reason: "email inválido" }, { status: 400 });
    }
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ sent: false, reason: "RESEND_API_KEY no configurada" });
    }

    const d = new Date(date + "T12:00:00");
    const fechaLarga = `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`;

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
      <p style="margin:0 0 24px;font-size:0.95rem;color:#555">Tu cita ha sido confirmada:</p>
      <div style="background:#f9f6f0;border-left:4px solid #c9a84c;border-radius:8px;padding:18px 20px;margin-bottom:24px">
        <div style="font-size:0.9rem;color:#222;margin-bottom:6px">📅 <strong>${fechaLarga}</strong></div>
        <div style="font-size:0.9rem;color:#222;margin-bottom:6px">🕐 <strong>${time}</strong></div>
        <div style="font-size:0.9rem;color:#222">💇 ${servicio || "Sin especificar"}</div>
      </div>
      <p style="margin:0 0 6px;font-size:0.85rem;color:#555">📍 C. Puerta Canseco, 14 · 38003 Santa Cruz de Tenerife</p>
      <p style="margin:0 0 24px;font-size:0.85rem;color:#555">📞 643 50 36 18</p>
      ${
        token
          ? `<p style="margin:0 0 6px;font-size:0.85rem;color:#555">Tu código para cancelar la cita si lo necesitas:</p>
      <div style="font-size:1.2rem;font-weight:700;letter-spacing:0.15em;color:#c9a84c;margin-bottom:20px">${token}</div>`
          : ""
      }
      <p style="margin:0;font-size:0.8rem;color:#999">¿Necesitas cancelar o cambiar la hora? Llámanos al <strong>643 50 36 18</strong>.<br>¡Te esperamos! 💛</p>
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
        subject: `Cita confirmada: ${fechaLarga} a las ${time} ✂️`,
        html,
      }),
    });

    return NextResponse.json({ sent: emailRes.ok });
  } catch {
    return NextResponse.json({ sent: false, reason: "error interno" }, { status: 500 });
  }
}
