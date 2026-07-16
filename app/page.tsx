"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Gallery } from "@/components/sections/Gallery";
import { Shop } from "@/components/sections/Shop";
import { Booking } from "@/components/sections/Booking";
import { Contact } from "@/components/sections/Contact";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CheckoutModal } from "@/components/cart/CheckoutModal";
import { AdminFab } from "@/components/admin/AdminFab";
import { AdminDrawer } from "@/components/admin/AdminDrawer";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { PrivacyModal } from "@/components/ui/PrivacyModal";
import { CookieBanner } from "@/components/ui/CookieBanner";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      <Navbar onOpenCart={() => setCartOpen(true)} />

      <Hero />
      <About />
      <Services />
      <Gallery />
      <Shop />
      <Booking />
      <Contact />
      <FAQAccordion />

      <Footer />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />

      <AdminFab onClick={() => setAdminOpen(true)} />
      <AdminDrawer open={adminOpen} onClose={() => setAdminOpen(false)} />

      <FloatingButtons />
      <ChatWidget />

      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <CookieBanner onOpenPrivacy={() => setPrivacyOpen(true)} />
    </>
  );
}
