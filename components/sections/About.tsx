import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <section id="nosotros">
      <div className="container">
        <div className="about-grid">
          <Reveal className="reveal-left">
            <span className="label">Sobre nosotros</span>
            <h2 className="section-title">Cuidado experto para tu imagen</h2>
            <div className="about-text">
              <p>
                Somos una <strong>peluquería y centro de belleza</strong> especializado en el cuidado
                de la imagen personal. Ofrecemos servicios de peluquería para mujeres y hombres, junto
                con tratamientos especializados para realzar la mirada y mejorar la estética facial.
              </p>
              <p>
                Nuestro objetivo es ofrecer un <strong>servicio personalizado</strong>, utilizando
                productos de calidad y las técnicas más actuales para garantizar resultados{" "}
                <strong>naturales, duraderos</strong> y adaptados a las necesidades de cada cliente.
              </p>
              <p>
                Nos enfocamos en brindar una <strong>experiencia cómoda y profesional</strong>,
                priorizando siempre la satisfacción, la higiene y la atención al cliente.
              </p>
            </div>
          </Reveal>

          <Reveal className="reveal-right about-visual">
            <div className="about-img-wrap">
              <div className="ph-icon">◈</div>
              <p className="ph-text">
                Coloca aquí una foto del salón o del equipo
                <br />
                <em style={{ fontSize: "0.65rem", opacity: 0.6 }}>Guárdala como assets/salon.jpg</em>
              </p>
            </div>
            <div className="about-badge">
              <span className="badge-title">
                Imagen &amp;
                <br />
                excelencia
              </span>
              <span className="badge-sub">Tenerife · Desde el primer día</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
