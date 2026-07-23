"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MESES, DIAS_LARGO, fmtDate, getSlots } from "@/lib/dates";
import { SALON } from "@/lib/constants";
import { getAllBooked, getDayBooked, setCita } from "@/lib/booking";
import type { ChatMessage, ChatState } from "@/types";

interface ChatBubble {
  from: "user" | "bot";
  html: string;
  typing?: boolean;
}

interface ChatBookingDraft {
  availDays?: { date: string; label: string }[];
  date?: string;
  time?: string;
  nombre?: string;
  telefono?: string;
  servicio?: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [bubbles, setBubbles] = useState<ChatBubble[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [chatState, setChatState] = useState<ChatState>("IDLE");
  const draftRef = useRef<ChatBookingDraft>({});
  const historyRef = useRef<ChatMessage[]>([]);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    msgsRef.current?.scrollTo({ top: msgsRef.current.scrollHeight });
  }, [bubbles]);

  useEffect(() => {
    if (open && bubbles.length === 0) {
      const t = setTimeout(() => {
        botSay(
          "¡Hola! 👋 Soy la asistente de <strong>BN Estilistas</strong>. ¿En qué puedo ayudarte?",
          ["Servicios", "Horario", "Dónde estáis", "Pedir cita"],
        );
      }, 150);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function botSay(html: string, replies: string[] = []) {
    setBubbles((prev) => [...prev, { from: "bot", html }]);
    setQuickReplies(replies);
  }

  function replaceLastBot(html: string) {
    setBubbles((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i].from === "bot") {
          next[i] = { from: "bot", html };
          break;
        }
      }
      return next;
    });
  }

  function userSay(text: string) {
    setBubbles((prev) => [...prev, { from: "user", html: text }]);
    setQuickReplies([]);
  }

  function botSayFallback() {
    botSay(
      "Para cualquier consulta llámanos al <strong>643 50 36 18</strong> o escríbenos por WhatsApp. ¡Estaremos encantadas de ayudarte!",
      ["Pedir cita", "Horario"],
    );
  }

  async function askAI(text: string) {
    historyRef.current = [...historyRef.current, { role: "user", content: text }];
    setBubbles((prev) => [...prev, { from: "bot", html: "", typing: true }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyRef.current }),
      });
      const data = await res.json();
      setBubbles((prev) => prev.filter((b) => !b.typing));
      if (data.reply) {
        historyRef.current = [...historyRef.current, { role: "assistant", content: data.reply }];
        botSay(data.reply, ["Pedir cita", "Servicios", "Horario"]);
      } else {
        botSayFallback();
      }
    } catch {
      setBubbles((prev) => prev.filter((b) => !b.typing));
      botSayFallback();
    }
  }

  async function startChatBooking() {
    setChatState("BOOKING_DATE");
    draftRef.current = {};
    botSay("¡Perfecto! Buscando disponibilidad...");

    const allBooked = await getAllBooked();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const availDays: { date: string; label: string }[] = [];
    for (let i = 0; i <= 45 && availDays.length < 6; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (!SALON.diasAbiertos.includes(d.getDay())) continue;
      const ds = fmtDate(d);
      const bookedCount = allBooked[ds] ? Object.keys(allBooked[ds]).length : 0;
      if (bookedCount < getSlots(ds).length) {
        availDays.push({
          date: ds,
          label: DIAS_LARGO[d.getDay()].charAt(0).toUpperCase() + DIAS_LARGO[d.getDay()].slice(1) + " " + d.getDate(),
        });
      }
    }

    if (!availDays.length) {
      setChatState("IDLE");
      replaceLastBot(`No hay disponibilidad en los próximos días. Llámanos al <strong>${SALON.telefono}</strong>.`);
      return;
    }

    draftRef.current.availDays = availDays;
    replaceLastBot("¿Qué día te va mejor?");
    setQuickReplies(availDays.map((d) => d.label));
  }

  async function handleChatDate(text: string) {
    const tl = text.toLowerCase();
    const found = draftRef.current.availDays?.find(
      (d) => tl.includes(d.label.toLowerCase().split(" ")[0]) || text === d.label,
    );
    if (!found) {
      botSay("Elige uno de los días disponibles.", draftRef.current.availDays?.map((d) => d.label) ?? []);
      return;
    }
    draftRef.current.date = found.date;
    setChatState("BOOKING_TIME");

    const dayBooked = await getDayBooked(found.date);
    const bookedKeys = Object.keys(dayBooked);
    const freeSlots = getSlots(found.date).filter((s) => !bookedKeys.includes(s.replace(":", "-")));

    if (!freeSlots.length) {
      botSay("Ese día está completo. ¿Pruebas con otro?", draftRef.current.availDays?.map((d) => d.label) ?? []);
      setChatState("BOOKING_DATE");
      return;
    }
    botSay("¿A qué hora?", freeSlots);
  }

  async function handleChatTime(text: string) {
    const date = draftRef.current.date!;
    const dayBooked = await getDayBooked(date);
    const bookedKeys = Object.keys(dayBooked);
    const free = getSlots(date).filter((s) => !bookedKeys.includes(s.replace(":", "-")));
    const slot = free.find((s) => s === text || s.replace(":00", "") === text);
    if (!slot) {
      botSay("Elige una hora disponible.", free);
      return;
    }
    draftRef.current.time = slot;
    setChatState("BOOKING_NAME");
    botSay("¡Genial! ¿Cuál es tu nombre?");
  }

  async function submitChatBooking() {
    setChatState("IDLE");
    botSay("Confirmando...");
    try {
      const token = await setCita(draftRef.current.date!, draftRef.current.time!, {
        nombre: draftRef.current.nombre!,
        telefono: draftRef.current.telefono!,
        servicio: draftRef.current.servicio || "Sin especificar",
        ts: Date.now(),
      });
      draftRef.current = {};
      replaceLastBot(
        `✅ <strong>¡Cita confirmada!</strong><br><br>Tu código de cancelación:<br>` +
          `<span style="font-family:monospace;font-size:1.15rem;letter-spacing:0.18em;color:var(--gold)">${token}</span><br><br>` +
          `Guárdalo por si necesitas cancelar. ¡Hasta pronto! 💛`,
      );
      setQuickReplies(["Más información"]);
    } catch {
      draftRef.current = {};
      botSay(`Hubo un problema. Llámanos al <strong>${SALON.telefono}</strong>.`, ["Pedir cita"]);
    }
  }

  async function handleInput(text: string) {
    const t = text.toLowerCase().trim();

    if (chatState === "BOOKING_DATE") return handleChatDate(text);
    if (chatState === "BOOKING_TIME") return handleChatTime(text);
    if (chatState === "BOOKING_NAME") {
      draftRef.current.nombre = text;
      setChatState("BOOKING_PHONE");
      botSay("¿Y tu número de teléfono?");
      return;
    }
    if (chatState === "BOOKING_PHONE") {
      draftRef.current.telefono = text;
      setChatState("BOOKING_SERVICE");
      botSay("¿Para qué servicio?", ["Corte y coloración", "Tratamientos capilares", "Cejas", "Extensiones de pestañas", "Saltar"]);
      return;
    }
    if (chatState === "BOOKING_SERVICE") {
      draftRef.current.servicio = t === "saltar" ? "Sin especificar" : text;
      setChatState("BOOKING_CONFIRM");
      const d = new Date(draftRef.current.date + "T12:00:00");
      const dl = `${DIAS_LARGO[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()].toLowerCase()}`;
      botSay(
        `Perfecto, voy a confirmar:<br><br>📅 <strong>${dl} · ${draftRef.current.time}</strong><br>` +
          `👤 ${draftRef.current.nombre} · 📞 ${draftRef.current.telefono}<br>💇 ${draftRef.current.servicio}<br><br>¿Lo confirmo?`,
        ["Sí, confirmar", "Cancelar"],
      );
      return;
    }
    if (chatState === "BOOKING_CONFIRM") {
      if (t.includes("sí") || t.includes("si")) {
        await submitChatBooking();
      } else {
        setChatState("IDLE");
        draftRef.current = {};
        botSay("Entendido, reserva cancelada. ¿En qué más puedo ayudarte?", ["Pedir cita", "Servicios", "Horario"]);
      }
      return;
    }

    if (t.includes("cita") || t.includes("reservar") || t.includes("reserva")) {
      await startChatBooking();
      return;
    }

    if (t === "más información") {
      botSay("¡Hola! 👋 ¿En qué más puedo ayudarte?", ["Servicios", "Horario", "Dónde estáis", "Pedir cita"]);
      return;
    }

    await askAI(text);
  }

  function handleQuickReply(label: string) {
    userSay(label);
    setTimeout(() => handleInput(label), 400);
  }

  function sendChat() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    userSay(text);
    setTimeout(() => handleInput(text), 400);
  }

  return (
    <>
      <div className={`chat-widget${open ? " open" : ""}`} id="chatWidget">
        <div className="chat-head">
          <div className="chat-head-info">
            <div className="chat-avatar" style={{ background: "transparent", overflow: "hidden", padding: 0 }}>
              <Image src="/assets/logo.png" alt="BN" width={40} height={40} style={{ objectFit: "cover", borderRadius: "50%" }} />
            </div>
            <div>
              <div className="chat-head-name">BN Estilistas</div>
              <div className="chat-head-sub">Asistente virtual</div>
            </div>
          </div>
          <button className="chat-x" onClick={() => setOpen(false)} aria-label="Cerrar chat">
            ✕
          </button>
        </div>
        <div className="chat-msgs" ref={msgsRef}>
          {bubbles.map((b, i) =>
            b.typing ? (
              <div className="cmsg bot typing" key={i}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              <div className={`cmsg ${b.from === "user" ? "usr" : "bot"}`} key={i} dangerouslySetInnerHTML={{ __html: b.html }} />
            ),
          )}
        </div>
        <div className="chat-qr">
          {quickReplies.map((label) => (
            <button className="qbtn" key={label} onClick={() => handleQuickReply(label)}>
              {label}
            </button>
          ))}
        </div>
        <div className="chat-inp-row">
          <input
            className="chat-inp"
            placeholder="Escribe un mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendChat()}
            autoComplete="off"
            aria-label="Escribe un mensaje"
          />
          <button className="chat-snd" onClick={sendChat} aria-label="Enviar mensaje">
            &#8594;
          </button>
        </div>
      </div>

      <button
        className="chat-toggle"
        onClick={() => setOpen((o) => !o)}
        title={open ? "Cerrar chat" : "Abrir chat"}
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
      >
        {!open ? (
          <svg viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6V10h12v2zm0-3H6V7h12v2z" />
          </svg>
        ) : (
          <span style={{ fontSize: "1.4rem", fontWeight: 700, lineHeight: 1 }}>✕</span>
        )}
      </button>
    </>
  );
}
