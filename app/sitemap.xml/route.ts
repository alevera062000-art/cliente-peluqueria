import { SITE_URL } from "@/lib/constants";

// Ruta XML manual (en vez de app/sitemap.ts) para conservar las extensiones
// <image:image>, que la API tipada de sitemaps de Next.js no soporta.
export async function GET() {
  const lastmod = "2026-06-29";
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${SITE_URL}/assets/salon.jpg</image:loc>
      <image:title>BN Estilistas — Peluquería y Centro de Belleza en Santa Cruz de Tenerife</image:title>
    </image:image>
  </url>

  <url>
    <loc>${SITE_URL}/#nosotros</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>${SITE_URL}/#servicios</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${SITE_URL}/#galeria</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <image:image>
      <image:loc>${SITE_URL}/assets/trabajo1.jpg</image:loc>
      <image:title>Trabajos de peluquería BN Estilistas</image:title>
    </image:image>
    <image:image>
      <image:loc>${SITE_URL}/assets/trabajo2.jpg</image:loc>
      <image:title>Coloración y peinado BN Estilistas</image:title>
    </image:image>
    <image:image>
      <image:loc>${SITE_URL}/assets/trabajo3.jpg</image:loc>
      <image:title>Tratamientos capilares BN Estilistas</image:title>
    </image:image>
  </url>

  <url>
    <loc>${SITE_URL}/#tienda</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${SITE_URL}/#reservas</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${SITE_URL}/#faq</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>${SITE_URL}/#contacto</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
