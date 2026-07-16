"use client";

import { useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

const FOTOS = ["/assets/trabajo1.jpg", "/assets/trabajo2.jpg", "/assets/trabajo3.jpg"];

export function Gallery() {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <>
      <section id="galeria">
        <div className="container">
          <Reveal className="reveal" style={{ marginBottom: "3rem", textAlign: "center" }}>
            <span className="label">Nuestro trabajo</span>
            <h2 className="section-title" style={{ marginTop: "0.8rem" }}>
              Resultados que hablan por sí solos
            </h2>
          </Reveal>
          <div className="gallery-grid">
            {FOTOS.map((src, i) => (
              <Reveal
                key={src}
                className="gallery-item reveal"
                style={{ transitionDelay: `${0.05 + i * 0.07}s` }}
                onClick={() => setLightboxSrc(src)}
              >
                <Image src={src} alt="Trabajo BN Estilistas" fill sizes="(max-width: 640px) 100vw, 33vw" style={{ objectFit: "cover" }} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div
        className={`lightbox${lightboxSrc ? " open" : ""}`}
        id="lightbox"
        onClick={() => setLightboxSrc(null)}
      >
        <button className="lightbox-close" onClick={() => setLightboxSrc(null)}>
          ✕
        </button>
        {lightboxSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img id="lightboxImg" src={lightboxSrc} alt="" />
        )}
      </div>
    </>
  );
}
