import { Hero } from "@/components/Hero";
import { ScrollModel } from "@/components/ScrollModel";
import { ProductShowcase } from "@/components/ProductShowcase";

export default function Home() {
  return (
    <main className="bg-ink">
      <Hero />
      <ScrollModel />
      <ProductShowcase />
    </main>
  );
}
