import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Firebase Realtime Database cae a un transporte de long-polling basado en
      // <script src="https://...firebasedatabase.app/..."> cuando el WebSocket no
      // se establece igual que en Chrome/Firefox (observado en Safari/WebKit) —
      // ese fallback lo gobierna script-src, no connect-src, así que también
      // necesita permitir el dominio de la base de datos.
      "script-src 'self' 'unsafe-inline' https://*.firebasedatabase.app https://*.firebaseio.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "media-src 'self' blob:",
      "connect-src 'self' https://*.firebasedatabase.app wss://*.firebasedatabase.app https://*.firebaseio.com wss://*.firebaseio.com https://firebasedatabase.googleapis.com https://api.emailjs.com https://generativelanguage.googleapis.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        source: "/assets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
