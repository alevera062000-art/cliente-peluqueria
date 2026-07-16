"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";

const SERVICIOS_OPCIONES = [
  "Corte, peinado y coloración",
  "Tratamientos capilares",
  "Diseño y definición de cejas",
  "Laminado y tinte de cejas",
  "Extensiones de pestañas",
  "Otro servicio",
];

export function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contacto">
      <div className="container">
        <Reveal className="contact-intro reveal">
          <span className="label">Reserva tu cita</span>
          <h2 className="section-title">Estamos aquí para ti</h2>
        </Reveal>

        <div className="contact-grid">
          <Reveal className="reveal-left contact-info">
            <h3>
              Ven a visitarnos en
              <br />
              Santa Cruz de Tenerife
            </h3>

            <div className="cinfo-list">
              <div className="cinfo-item">
                <div className="cinfo-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="cinfo-body">
                  <span className="clabel">Dirección</span>
                  <span className="cval">
                    C. Puerta Canseco, 14
                    <br />
                    38003 Santa Cruz de Tenerife
                  </span>
                </div>
              </div>

              <div className="cinfo-item">
                <div className="cinfo-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div className="cinfo-body">
                  <span className="clabel">Teléfono</span>
                  <span className="cval">
                    <a href="tel:627052418">627 052 418</a>
                  </span>
                </div>
              </div>

              <div className="cinfo-item">
                <div className="cinfo-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div className="cinfo-body">
                  <span className="clabel">Horario</span>
                  <span className="cval">[HORARIO DE APERTURA]</span>
                </div>
              </div>

              <div className="cinfo-item">
                <div className="cinfo-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="cinfo-body">
                  <span className="clabel">Email</span>
                  <span className="cval">[TU EMAIL AQUÍ]</span>
                </div>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/C.+Puerta+Canseco+14+38003+Santa+Cruz+de+Tenerife"
              target="_blank"
              rel="noopener noreferrer"
              className="map-btn"
            >
              Cómo llegar →
            </a>
          </Reveal>

          <Reveal className="reveal-right contact-form">
            <h3>Escríbenos</h3>
            <p className="form-note">
              Déjanos tu mensaje y te confirmamos tu cita lo antes posible. También puedes llamarnos
              directamente al{" "}
              <a href="tel:627052418" style={{ color: "var(--gold)" }}>
                627 052 418
              </a>
              .
            </p>

            <form
              id="cForm"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="fg">
                <label htmlFor="fname">Nombre</label>
                <input type="text" id="fname" name="name" placeholder="Tu nombre" required />
              </div>
              <div className="fg">
                <label htmlFor="ftel">Teléfono</label>
                <input type="tel" id="ftel" name="phone" placeholder="Tu número de teléfono" />
              </div>
              <div className="fg">
                <label htmlFor="fserv">Servicio</label>
                <select id="fserv" name="service" defaultValue="">
                  <option value="">Selecciona un servicio</option>
                  {SERVICIOS_OPCIONES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="fg">
                <label htmlFor="fmsg">Mensaje</label>
                <textarea id="fmsg" name="message" placeholder="Cuéntanos qué necesitas..." />
              </div>
              <button
                type="submit"
                className="form-btn"
                id="formBtn"
                disabled={sent}
                style={sent ? { background: "#4a9970" } : undefined}
              >
                {sent ? "¡Mensaje enviado! ✓" : "Enviar mensaje"}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
