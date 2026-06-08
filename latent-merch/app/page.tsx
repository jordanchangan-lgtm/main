import { Hero } from "@/components/Hero";
import { ProductShowcase } from "@/components/ProductShowcase";
import { Lookbook } from "@/components/Lookbook";
import { Manifesto } from "@/components/Manifesto";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-ink">
      <Hero />
      <ProductShowcase />
      <Lookbook />
      <Manifesto />
      <Footer />
    </main>
  );
}
