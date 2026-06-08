"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { fadeUp, stagger, silk, expoOut } from "@/lib/motion";

type Product = {
  handle: string;
  number: string;
  name: string;
  tagline: string;
  price: string;
  video: string;
  poster: string;
  alt: string;
};

const PRODUCTS: Product[] = [
  {
    handle: "tee",
    number: "ə–01",
    name: "the latent tee",
    tagline: "Heavyweight cotton. Copper schwa, hand-pulled.",
    price: "29 JOD",
    video: "/product-tee.webm",
    poster: "/product-tee.png",
    alt: "The latent tee — bone heavyweight cotton with copper ə print",
  },
  {
    handle: "hoodie",
    number: "ə–02",
    name: "the void hoodie",
    tagline: "Brushed-back jade. Drop shoulder. Built to hang.",
    price: "59 JOD",
    video: "/product-hoodie.webm",
    poster: "/product-hoodie.png",
    alt: "The void hoodie — jade heavyweight fleece with cream ə",
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
            ə · the drop
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
  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 1.2, ease: expoOut }}
      whileHover="hover"
      className="group relative"
    >
      {/* Card surface — soft jade-tinged dark glass */}
      <motion.div
        className="relative overflow-hidden rounded-[28px] border border-paper/8 bg-gradient-to-b from-jadeDeep/45 via-ink to-ink p-6 md:p-10"
        variants={{ hover: { borderColor: "rgba(217,181,123,0.35)" } }}
        transition={{ duration: 0.8, ease: silk }}
      >
        {/* Ambient glow */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50 blur-3xl"
          variants={{
            hover: { opacity: 0.85, scale: 1.1 },
          }}
          transition={{ duration: 1.4, ease: silk }}
        >
          <div className="absolute inset-x-10 top-6 h-2/3 rounded-full bg-jadeLit/30" />
        </motion.div>

        {/* Product spin — rotates 360° on loop, alpha-channel video */}
        <motion.div
          className="relative mx-auto aspect-square w-full max-w-md"
          variants={{
            hover: { y: -10, scale: 1.03 },
          }}
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
        </motion.div>

        {/* Card body */}
        <div className={`relative mt-8 flex items-end justify-between gap-6 ${reverseAlign ? "md:flex-row-reverse md:text-right" : ""}`}>
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
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-paper/40">
              from
            </p>
            <p className="mt-2 text-xl font-medium text-paper">{product.price}</p>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
