import { ScrollModel } from "@/components/ScrollModel";

export default function Home() {
  return (
    <main className="bg-ink">
      <section className="min-h-screen flex items-center justify-center">
        <h1 className="text-5xl font-bold tracking-tight">Latent Merch</h1>
        {/* Port the jade void hero from latent_merch.html — see MIGRATION.md */}
      </section>

      <ScrollModel />
    </main>
  );
}
