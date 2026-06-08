"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { fadeUp, stagger, silk, expoOut } from "@/lib/motion";
import { useCart } from "@/lib/cart";
import { COMMERCE_ENABLED, WAITLIST_EMAIL } from "@/lib/config";

type Product = {
  handle: string;
  number: string;
  name: string;
  tagline: string;
  priceMinor: number;
  priceLabel: string;
  currency: string;
  sizes: string[];
  defaultSize: string;
  // Stable variant UUID per (handle, size). Seeded by supabase/seed.sql.
  variantIds: Record<string, string>;
  video: string;
  poster: string;
  alt: string;
  colorways: string[]; // hex swatches floating over the spin
};

const PRODUCTS: Product[] = [
  {
    handle: "tee",
    number: "ə–01",
    name: "the latent tee",
    tagline: "Heavyweight cotton. Copper schwa, hand-pulled.",
    priceMinor: 2900,
    priceLabel: "29 JOD",
    currency: "JOD",
    sizes: ["XS", "S", "M", "L", "XL"],
    defaultSize: "M",
    variantIds: {
      XS: "1a000000-0000-4000-8000-000000000001",
      S: "1a000000-0000-4000-8000-000000000002",
      M: "1a000000-0000-4000-8000-000000000003",
      L: "1a000000-0000-4000-8000-000000000004",
      XL: "1a000000-0000-4000-8000-000000000005",
    },
    video: "/product-tee.webm",
    poster: "/product-tee.png",
    alt: "The latent tee — bone heavyweight cotton with copper ə print",
    colorways: ["#EDE7DA", "#1E5E45", "#15201B"],
  },
  {
    handle: "hoodie",
    number: "ə–02",
    name: "the void hoodie",
    tagline: "Brushed-back jade. Drop shoulder. Built to hang.",
    priceMinor: 5900,
    priceLabel: "59 JOD",
    currency: "JOD",
    sizes: ["XS", "S", "M", "L", "XL"],
    defaultSize: "M",
    variantIds: {
      XS: "2b000000-0000-4000-8000-000000000001",
      S: "2b000000-0000-4000-8000-000000000002",
      M: "2b000000-0000-4000-8000-000000000003",
      L: "2b000000-0000-4000-8000-000000000004",
      XL: "2b000000-0000-4000-8000-000000000005",
    },
    video: "/product-hoodie.webm",
    poster: "/product-hoodie.png",
    alt: "The void hoodie — jade heavyweight fleece with cream ə",
    colorways: ["#1E5E45", "#EDE7DA", "#15201B"],
  },
];

export function ProductShowcase() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={ref} id="shop" className="relative bg-ink py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          style={{ y: headingY }}
          variants={stagger(0.05, 0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-15%" }}
          className="mb-20 flex flex-col items-start gap-3 md:mb-28"
        >
          <motion.p
            variants={fadeUp}
            className="font-mono text-[11px] uppercase tracking-[0.34em] text-jadeLit"
          >
            ə · {COMMERCE_ENABLED ? "the drop" : "drop coming soon"}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-[clamp(40px,7vw,96px)] font-extrabold leading-[0.9] tracking-[-0.04em] lowercase text-paper"
          >
            two pieces. <span className="text-metalLit">no noise.</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="max-w-lg text-base leading-relaxed text-paper/55"
          >
            Each piece is a primitive — generated, not sampled. Wear them how you wear thought.
            {!COMMERCE_ENABLED && " Drop one launches soon — join the list."}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.handle} product={p} reverseAlign={i === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, reverseAlign }: { product: Product; reverseAlign?: boolean }) {
  const { add } = useCart();
  const [size, setSize] = useState(product.defaultSize);
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (!COMMERCE_ENABLED) {
      const subject = encodeURIComponent(`Notify me · ${product.name} · ${size}`);
      const body = encodeURIComponent(
        `Hey — let me know when ${product.name} (size ${size}) drops.`
      );
      window.location.href = `mailto:${WAITLIST_EMAIL}?subject=${subject}&body=${body}`;
      setAdding(true);
      setTimeout(() => setAdding(false), 1200);
      return;
    }
    add({
      variantId: product.variantIds[size],
      handle: product.handle,
      name: product.name,
      size,
      priceMinor: product.priceMinor,
      currency: product.currency,
      quantity: 1,
      image: product.poster,
    });
    setAdding(true);
    setTimeout(() => setAdding(false), 900);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 1.2, ease: expoOut }}
      whileHover="hover"
      className="group relative"
    >
      <motion.div
        className="relative overflow-hidden rounded-[28px] border border-paper/8 bg-gradient-to-b from-jadeDeep/45 via-ink to-ink p-6 md:p-10"
        variants={{ hover: { borderColor: "rgba(217,181,123,0.35)" } }}
        transition={{ duration: 0.8, ease: silk }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50 blur-3xl"
          variants={{ hover: { opacity: 0.85, scale: 1.1 } }}
          transition={{ duration: 1.4, ease: silk }}
        >
          <div className="absolute inset-x-10 top-6 h-2/3 rounded-full bg-jadeLit/30" />
        </motion.div>

        <motion.div
          className="relative mx-auto aspect-square w-full max-w-md"
          variants={{ hover: { y: -10, scale: 1.03 } }}
          transition={{ duration: 1.1, ease: silk }}
        >
          <video
            src={product.video}
            poster={product.poster}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label={product.alt}
            className="h-full w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
          />

          {/* Floating colorway popup */}
          <FloatingPopup
            position={{ left: "78%", top: "22%" }}
            from="right"
            delay={0.2}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-jade">
              colorway
            </p>
            <div className="mt-2 flex gap-1.5">
              {product.colorways.map((c, i) => (
                <span
                  key={i}
                  className="h-3 w-3 rounded-full border border-paper/15"
                  style={{ background: c }}
                />
              ))}
            </div>
          </FloatingPopup>

          {/* Floating price popup */}
          <FloatingPopup
            position={{ left: "80%", top: "68%" }}
            from="right"
            delay={0.4}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-jade">
              {product.handle === "tee" ? "latent tee" : "void hoodie"}
            </p>
            <p className="mt-1.5 text-base font-medium text-ink">{product.priceLabel}</p>
          </FloatingPopup>
        </motion.div>

        <div className={`relative mt-6 flex items-end justify-between gap-6 ${reverseAlign ? "md:flex-row-reverse md:text-right" : ""}`}>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-metalLit">
              {product.number}
            </p>
            <h3 className="mt-3 text-3xl font-medium leading-tight tracking-tight text-paper lowercase">
              {product.name}
            </h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-paper/55">
              {product.tagline}
            </p>
          </div>
          <div className={reverseAlign ? "text-left md:text-left" : "text-right"}>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-paper/40">
              from
            </p>
            <p className="mt-2 text-xl font-medium text-paper">{product.priceLabel}</p>
          </div>
        </div>

        {/* Size selector + Add to cart */}
        <div className="relative mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={[
                  "h-10 min-w-10 rounded-full border px-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-all duration-500",
                  size === s
                    ? "border-metalLit bg-metalLit/15 text-metalLit"
                    : "border-paper/15 text-paper/65 hover:border-paper/40 hover:text-paper",
                ].join(" ")}
              >
                {s}
              </button>
            ))}
          </div>

          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.96 }}
            className="group/btn relative flex items-center justify-between gap-3 overflow-hidden rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition-colors duration-500 hover:bg-metalLit"
          >
            <motion.span
              animate={{ y: adding ? -28 : 0 }}
              transition={{ duration: 0.5, ease: expoOut }}
              className="flex items-center gap-2"
            >
              {COMMERCE_ENABLED ? "add to cart" : "notify me"}
              <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-500 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </motion.span>
            <motion.span
              initial={{ y: 28 }}
              animate={{ y: adding ? 0 : 28 }}
              transition={{ duration: 0.5, ease: expoOut }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {COMMERCE_ENABLED ? `added · ${size}` : `on the list · ${size}`}
            </motion.span>
          </motion.button>
        </div>
      </motion.div>
    </motion.article>
  );
}

function FloatingPopup({
  children,
  position,
  from,
  delay = 0,
}: {
  children: React.ReactNode;
  position: { left: string; top: string };
  from: "left" | "right";
  delay?: number;
}) {
  const fromX = from === "right" ? 24 : -24;
  return (
    <motion.div
      initial={{ opacity: 0, x: fromX, y: 8 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.0, ease: expoOut, delay }}
      variants={{ hover: { y: -4 } }}
      style={{ left: position.left, top: position.top }}
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-metal/40 bg-paper/95 px-3 py-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.5)] backdrop-blur-sm"
    >
      {children}
    </motion.div>
  );
}
