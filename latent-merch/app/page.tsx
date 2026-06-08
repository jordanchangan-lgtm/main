import { Hero } from "@/components/Hero";
import { ScrollModel } from "@/components/ScrollModel";
import { ProductShowcase } from "@/components/ProductShowcase";
import { Lookbook } from "@/components/Lookbook";
import { Manifesto } from "@/components/Manifesto";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-ink">
      <Hero />
      <ScrollModel />
      <ProductShowcase />
      <Lookbook />
      <Manifesto />
      <Footer />
    </main>
  );
}
