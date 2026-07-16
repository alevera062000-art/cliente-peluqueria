import { buildHairSalonSchema, buildFaqSchema, buildBreadcrumbSchema } from "@/lib/data/schema";

export function JsonLd() {
  const schemas = [buildHairSalonSchema(), buildFaqSchema(), buildBreadcrumbSchema()];
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
