import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  const pass = request.headers.get("x-admin-pass");
  if (!pass || pass !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: { action?: string; payload?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const { action, payload = {} } = body;
  const db = getAdminDb();

  try {
    let result: unknown;

    switch (action) {
      case "GET_CITAS": {
        const snap = await db.ref("citas").once("value");
        result = snap.val();
        break;
      }
      case "GET_PEDIDOS": {
        const snap = await db.ref("pedidos").once("value");
        result = snap.val();
        break;
      }
      case "UPDATE_PEDIDO_ESTADO": {
        await db.ref(`pedidos/${payload.codigo}/estado`).set(payload.estado);
        result = { ok: true };
        break;
      }
      case "DELETE_PEDIDO": {
        await db.ref(`pedidos/${payload.codigo}`).remove();
        result = { ok: true };
        break;
      }
      case "CANCEL_APPT": {
        const { dateStr, timeKey, cancelToken } = payload as {
          dateStr: string;
          timeKey: string;
          cancelToken?: string;
        };
        await db.ref(`booked/${dateStr}/${timeKey}`).remove();
        await db.ref(`citas/${dateStr}/${timeKey}`).remove();
        if (cancelToken) await db.ref(`tokens/${cancelToken}`).remove();
        result = { ok: true };
        break;
      }
      case "GET_RECORDATORIOS": {
        const snap = await db.ref("recordatorios").orderByChild("fecha").once("value");
        result = snap.val();
        break;
      }
      case "SAVE_RECORDATORIO": {
        const { id, data } = payload as { id: string | null; data: Record<string, unknown> };
        if (id) {
          await db.ref(`recordatorios/${id}`).update(data);
          result = { id };
        } else {
          const ref = await db.ref("recordatorios").push(data);
          result = { id: ref.key };
        }
        break;
      }
      case "DELETE_RECORDATORIO": {
        await db.ref(`recordatorios/${payload.id}`).remove();
        result = { ok: true };
        break;
      }
      case "UPDATE_PRODUCTO": {
        const { id, data } = payload as { id: string; data: Record<string, unknown> };
        await db.ref(`productos/${id}`).update(data);
        result = { ok: true };
        break;
      }
      case "DELETE_PRODUCTO": {
        await db.ref(`productos/${payload.id}`).remove();
        result = { ok: true };
        break;
      }
      case "UPDATE_SERVICIO": {
        const { id, data } = payload as { id: string; data: Record<string, unknown> };
        await db.ref(`servicios/${id}`).update(data);
        result = { ok: true };
        break;
      }
      case "DELETE_SERVICIO": {
        await db.ref(`servicios/${payload.id}`).remove();
        result = { ok: true };
        break;
      }
      default:
        return NextResponse.json({ error: "Acción desconocida" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
