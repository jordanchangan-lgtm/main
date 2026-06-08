import { Hero } from "@/components/Hero";
import { ScrollModel } from "@/components/ScrollModel";
import { XrayReveal } from "@/components/XrayReveal";
import { ProductShowcase } from "@/components/ProductShowcase";
import { Lookbook } from "@/components/Lookbook";
import { Manifesto } from "@/components/Manifesto";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-ink">
      <Hero />
      <ScrollModel />
      <XrayReveal />
      <ProductShowcase />
      <Lookbook />
      <Manifesto />
      <Footer />
    </main>
  );
}
