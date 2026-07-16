"use client";

import { useServiciosOverrides } from "@/hooks/useServiciosOverrides";
import { ICONS_SERVICIO } from "@/lib/data/servicios";
import { Reveal } from "@/components/ui/Reveal";

export function Services() {
  const { servicios } = useServiciosOverrides();

  return (
    <section id="servicios">
      <div className="container">
        <Reveal className="services-head reveal">
          <div>
            <span className="label">Lo que hacemos</span>
            <h2 className="section-title">Nuestros servicios</h2>
          </div>
          <p className="services-note">
            Todos nuestros servicios se realizan con productos profesionales y las técnicas más
            actuales.
          </p>
        </Reveal>

        <div className="services-grid" id="serviciosGrid">
          {servicios.map((s, i) => {
            const span = i === servicios.length - 1 && servicios.length % 3 === 2;
            const precioTxt = s.precio > 0 ? "€" + s.precio.toFixed(2).replace(".", ",") : "Consultar";
            return (
              <Reveal
                key={s.id}
                className="card stagger"
                style={span ? { gridColumn: "span 2" } : undefined}
                staggerDelayMs={i * 110}
              >
                <span className="card-num">{String(i + 1).padStart(2, "0")}</span>
                <div className="card-icon">
                  <svg
                    viewBox="0 0 24 24"
                    dangerouslySetInnerHTML={{ __html: ICONS_SERVICIO[s.icon] || ICONS_SERVICIO.estrella }}
                  />
                </div>
                <h3 className="card-name">{s.nombre}</h3>
                <p
                  className="card-desc"
                  dangerouslySetInnerHTML={{ __html: s.desc || "" }}
                />
                <div className="card-price">
                  <span className="plabel">Desde</span>
                  <span className="pval">{precioTxt}</span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
