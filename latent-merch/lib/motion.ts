import type { Variants, Transition } from "framer-motion";

// Shared motion language for Latent Merch.
// Premium feel: long expo-out easing, generous staggers, springless settle.

export const expoOut = [0.16, 1, 0.3, 1] as const;
export const expoInOut = [0.83, 0, 0.17, 1] as const;
export const silk = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: expoOut },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1.4, ease: expoOut },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -48 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 1.2, ease: expoOut },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 48 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 1.2, ease: expoOut },
  },
};

export const stagger = (delay = 0.08, child = 0.12): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: child,
      delayChildren: delay,
    },
  },
});

export const productCardHover: Transition = {
  duration: 0.8,
  ease: silk,
};
