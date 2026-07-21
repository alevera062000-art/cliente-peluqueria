export function Hero() {
  return (
    <section className="hero" id="inicio">
      <video
        className="hero-video"
        src="/assets/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="hero-bg" />
      <div className="hero-petal" />

      <div className="hero-content">
        <div className="hero-eyebrow hi">
          <span>Santa Cruz de Tenerife</span>
        </div>

        <h1 className="hero-title hi">
          Tu imagen,
          <br />
          <em>nuestra pasión</em>
        </h1>

        <p className="hero-sub hi">
          Peluquería y centro de belleza especializado en el cuidado de la imagen personal. Técnicas
          actuales, productos de calidad, resultados naturales.
        </p>

        <div className="hero-actions hi">
          <a href="#contacto" className="btn-primary">
            Pide tu cita
          </a>
          <a href="#servicios" className="btn-ghost">
            Ver servicios
          </a>
        </div>
      </div>
    </section>
  );
}
