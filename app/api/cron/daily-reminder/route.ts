import { NextResponse } from "next/server";
import type { Cita, Recordatorio } from "@/types";

const FIREBASE_BASE = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ?? "";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const fecha = tomorrow.toISOString().split("T")[0];

  const [agendaEnviados, citasEnviadas] = await Promise.all([
    enviarRecordatoriosAgenda(fecha),
    enviarRecordatoriosCitas(fecha),
  ]);

  return NextResponse.json({ agenda: agendaEnviados, citas: citasEnviadas });
}

async function enviarRecordatoriosAgenda(fecha: string): Promise<number> {
  try {
    const res = await fetch(`${FIREBASE_BASE}/recordatorios.json`);
    const data: Record<string, Recordatorio> | null = await res.json();
    if (!data) return 0;

    const manana = Object.values(data).filter((r) => r.fecha === fecha);
    let enviados = 0;

    for (const r of manana) {
      const hora = r.hora ? ` a las ${r.hora}` : "";
      const notas = r.notas ? `\n📝 ${r.notas}` : "";
      const texto = `🔔 Recordatorio BN Estilistas\n\nMañana${hora}:\n${r.titulo}${notas}`;

      const waRes = await fetch(
        `https://api.callmebot.com/whatsapp.php?phone=${process.env.CALLMEBOT_PHONE}&text=${encodeURIComponent(texto)}&apikey=${process.env.CALLMEBOT_APIKEY}`,
      );
      if (waRes.ok) enviados++;
    }
    return enviados;
  } catch {
    return 0;
  }
}

async function enviarRecordatoriosCitas(fecha: string): Promise<number> {
  if (!process.env.RESEND_API_KEY) return 0;
  try {
    const res = await fetch(`${FIREBASE_BASE}/citas.json`);
    const data: Record<string, Record<string, Cita>> | null = await res.json();
    if (!data) return 0;

    const citasManana: (Cita & { time: string })[] = [];
    Object.entries(data).forEach(([dateKey, slots]) => {
      if (dateKey === fecha) {
        Object.entries(slots).forEach(([timeKey, cita]) => {
          if (cita && cita.email) citasManana.push({ ...cita, time: timeKey.replace("-", ":") });
        });
      }
    });

    let enviados = 0;
    for (const cita of citasManana) {
      const ok = await enviarEmailRecordatorio(cita);
      if (ok) enviados++;
    }
    return enviados;
  } catch {
    return 0;
  }
}

async function enviarEmailRecordatorio(cita: Cita & { time: string }): Promise<boolean> {
  try {
    const d = new Date(cita.date + "T12:00:00");
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const meses = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
    ];
    const fechaLarga = `${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]}`;

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
      <p style="margin:0 0 8px;font-size:1rem;color:#222">Hola, <strong>${cita.nombre}</strong> 👋</p>
      <p style="margin:0 0 24px;font-size:0.95rem;color:#555">Te recordamos que tienes una cita con nosotras <strong>mañana</strong>:</p>
      <div style="background:#f9f6f0;border-left:4px solid #c9a84c;border-radius:8px;padding:18px 20px;margin-bottom:24px">
        <div style="font-size:0.9rem;color:#222;margin-bottom:6px">📅 <strong>${fechaLarga}</strong></div>
        <div style="font-size:0.9rem;color:#222;margin-bottom:6px">🕐 <strong>${cita.time}</strong></div>
        <div style="font-size:0.9rem;color:#222">💇 ${cita.servicio || "Cita en el salón"}</div>
      </div>
      <p style="margin:0 0 6px;font-size:0.85rem;color:#555">📍 C. Puerta Canseco, 14 · 38003 Santa Cruz de Tenerife</p>
      <p style="margin:0 0 24px;font-size:0.85rem;color:#555">📞 627 052 418</p>
      <p style="margin:0;font-size:0.8rem;color:#999">¿Necesitas cancelar? Llámanos con antelación al <strong>627 052 418</strong>.<br>¡Te esperamos! 💛</p>
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
        // Remitente de pruebas de Resend (onboarding@resend.dev): se usa mientras
        // no haya un dominio propio verificado en resend.com/domains. En este modo,
        // Resend solo entrega a la dirección de la cuenta — para enviar recordatorios
        // a clientes reales hay que verificar un dominio y cambiar este remitente.
        from: "BN Estilistas <onboarding@resend.dev>",
        to: [cita.email],
        subject: `Recordatorio: tu cita es mañana a las ${cita.time} ✂️`,
        html,
      }),
    });

    return emailRes.ok;
  } catch {
    return false;
  }
}
