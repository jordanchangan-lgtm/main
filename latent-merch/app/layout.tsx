import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { NavHeader } from "@/components/NavHeader";
import { CartDrawer } from "@/components/CartDrawer";
import { COMMERCE_ENABLED } from "@/lib/config";

export const metadata: Metadata = {
  title: "Latent Merch — AI-native apparel",
  description:
    "Garments generated, not sampled. The apparel arm of Latent Studio (Amman). No logos. No noise.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <NavHeader />
          {children}
          {COMMERCE_ENABLED && <CartDrawer />}
        </CartProvider>
      </body>
    </html>
  );
}
