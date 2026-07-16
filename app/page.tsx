import { Footer } from "@/components/layout/Footer";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import { SiteInteractive } from "@/components/layout/SiteInteractive";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Gallery } from "@/components/sections/Gallery";
import { Shop } from "@/components/sections/Shop";
import { Booking } from "@/components/sections/Booking";
import { Contact } from "@/components/sections/Contact";
import { FAQAccordion } from "@/components/sections/FAQAccordion";

export default function Home() {
  return (
    <>
      <SiteInteractive />

      <Hero />
      <About />
      <Services />
      <Gallery />
      <Shop />
      <Booking />
      <Contact />
      <FAQAccordion />

      <Footer />
      <FloatingButtons />
    </>
  );
}
