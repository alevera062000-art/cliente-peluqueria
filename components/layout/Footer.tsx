import Image from "next/image";

export function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-logo">
          <Image src="/assets/logo.png" alt="BN Estilistas" width={64} height={64} style={{ borderRadius: "50%", objectFit: "contain" }} />
        </div>
        <p className="footer-copy">© 2026 BN Estilistas · Santa Cruz de Tenerife · Todos los derechos reservados</p>
        <div className="footer-links">
          <a href="#nosotros">Nosotros</a>
          <a href="#servicios">Servicios</a>
          <a href="#faq">FAQ</a>
          <a href="#contacto">Contacto</a>
        </div>
        <div className="footer-social">
          <a href="https://www.instagram.com/bn_estilistas" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
            </svg>
            @bn_estilistas
          </a>
        </div>
      </div>
    </footer>
  );
}
