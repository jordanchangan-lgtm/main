"use client";

import { createContext, useContext, useEffect, useReducer, useMemo, useCallback } from "react";

// Cart line item.
// `variantId` is the DB variant UUID — populated once supabase/seed.sql is applied.
// Until then, treat it as a stable identifier per (handle, size).
export type CartLine = {
  variantId: string;
  handle: string;
  name: string;
  size: string;
  priceMinor: number;
  currency: string;
  quantity: number;
  image: string;
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
};

type Action =
  | { type: "ADD"; line: CartLine }
  | { type: "REMOVE"; variantId: string }
  | { type: "SET_QTY"; variantId: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE" }
  | { type: "HYDRATE"; lines: CartLine[] };

const STORAGE_KEY = "latent-merch:cart:v1";

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD": {
      const idx = state.lines.findIndex((l) => l.variantId === action.line.variantId);
      const next =
        idx >= 0
          ? state.lines.map((l, i) =>
              i === idx ? { ...l, quantity: l.quantity + action.line.quantity } : l
            )
          : [...state.lines, action.line];
      return { ...state, lines: next, isOpen: true };
    }
    case "REMOVE":
      return { ...state, lines: state.lines.filter((l) => l.variantId !== action.variantId) };
    case "SET_QTY":
      return {
        ...state,
        lines: state.lines
          .map((l) =>
            l.variantId === action.variantId ? { ...l, quantity: Math.max(0, action.quantity) } : l
          )
          .filter((l) => l.quantity > 0),
      };
    case "CLEAR":
      return { ...state, lines: [] };
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "TOGGLE":
      return { ...state, isOpen: !state.isOpen };
    case "HYDRATE":
      return { ...state, lines: action.lines };
    default:
      return state;
  }
}

type CartCtx = {
  lines: CartLine[];
  isOpen: boolean;
  count: number;
  subtotalMinor: number;
  currency: string;
  add: (line: CartLine) => void;
  remove: (variantId: string) => void;
  setQty: (variantId: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  checkout: () => Promise<void>;
};

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], isOpen: false });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", lines: JSON.parse(raw) });
    } catch {
      // ignore
    }
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // ignore
    }
  }, [state.lines]);

  const checkout = useCallback(async () => {
    if (state.lines.length === 0) return;
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        items: state.lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
      }),
    });
    const json = await res.json();
    if (json.url) {
      window.location.href = json.url;
    } else {
      console.error("Checkout failed", json);
    }
  }, [state.lines]);

  const value = useMemo<CartCtx>(() => {
    const count = state.lines.reduce((n, l) => n + l.quantity, 0);
    const subtotalMinor = state.lines.reduce((n, l) => n + l.priceMinor * l.quantity, 0);
    const currency = state.lines[0]?.currency ?? "JOD";
    return {
      lines: state.lines,
      isOpen: state.isOpen,
      count,
      subtotalMinor,
      currency,
      add: (line) => dispatch({ type: "ADD", line }),
      remove: (variantId) => dispatch({ type: "REMOVE", variantId }),
      setQty: (variantId, quantity) => dispatch({ type: "SET_QTY", variantId, quantity }),
      clear: () => dispatch({ type: "CLEAR" }),
      open: () => dispatch({ type: "OPEN" }),
      close: () => dispatch({ type: "CLOSE" }),
      toggle: () => dispatch({ type: "TOGGLE" }),
      checkout,
    };
  }, [state, checkout]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function formatMoney(minor: number, currency: string) {
  const major = minor / 100;
  return `${major.toFixed(major % 1 === 0 ? 0 : 2)} ${currency.toUpperCase()}`;
}
