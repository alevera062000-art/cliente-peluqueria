"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CheckoutModal } from "@/components/cart/CheckoutModal";
import { AdminFab } from "@/components/admin/AdminFab";
import { AdminDrawer } from "@/components/admin/AdminDrawer";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { PrivacyModal } from "@/components/ui/PrivacyModal";
import { CookieBanner } from "@/components/ui/CookieBanner";

/**
 * Agrupa la navbar y todos los overlays (carrito, checkout, admin, chat,
 * privacidad, cookies) en un único límite de cliente, ya que comparten estado
 * de apertura/cierre entre sí. Mantenerlos separados del resto de secciones
 * (Hero, About, Footer...) permite que esas secciones sigan siendo Server
 * Components reales — page.tsx ya no necesita "use client".
 */
export function SiteInteractive() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      <Navbar onOpenCart={() => setCartOpen(true)} />

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

      <ChatWidget />

      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <CookieBanner onOpenPrivacy={() => setPrivacyOpen(true)} />
    </>
  );
}
