import { SITE_URL } from "@/lib/constants";
import { FAQ } from "@/lib/data/faq";

export function buildHairSalonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: "BN Estilistas",
    description:
      "Peluquería y centro de belleza en Santa Cruz de Tenerife especializado en coloración, rubios y tratamientos capilares profesionales Goa Organics (Keratin Infusion, Softy Mood, Sublime 10·31, Bae Berry).",
    url: SITE_URL + "/",
    telephone: "+34643503618",
    email: "bn.estilistas1@gmail.com",
    image: `${SITE_URL}/assets/salon.jpg`,
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Cash, Credit Card",
    sameAs: ["https://www.instagram.com/bn_estilistas"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "C. Puerta Canseco, 14",
      addressLocality: "Santa Cruz de Tenerife",
      postalCode: "38003",
      addressRegion: "Tenerife",
      addressCountry: "ES",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.4636,
      longitude: -16.2518,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "14:00",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Tratamientos Goa Organics",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Keratin Infusion" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Softy Mood" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sublime 10·31" } },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Bae Berry",
          },
        },
      ],
    },
    areaServed: { "@type": "City", name: "Santa Cruz de Tenerife" },
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/#reservas`,
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      result: { "@type": "Reservation", name: "Reserva de cita en BN Estilistas" },
    },
  };
}

export function buildFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function buildBreadcrumbSchema() {
  const crumbs = [
    { name: "Inicio", path: "/" },
    { name: "Servicios", path: "/#servicios" },
    { name: "Tienda", path: "/#tienda" },
    { name: "Reservas", path: "/#reservas" },
    { name: "FAQ", path: "/#faq" },
    { name: "Contacto", path: "/#contacto" },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: SITE_URL + c.path,
    })),
  };
}
