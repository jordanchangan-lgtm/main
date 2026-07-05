// Renders a brand name in the spirit of its wordmark: heavy geometric weight,
// wide tracking. A CSS approximation of each bespoke logotype (Changan's
// triangular "A", Deepal's lowercase rounded mark, Nevo's tech sans) — swap in
// the official wordmark SVGs later for an exact match.
export function Wordmark({ text, color = "#ffffff", transform = "uppercase", style }) {
  return (
    <span
      style={{
        fontFamily: '"Arial Black", "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontWeight: 900,
        textTransform: transform,
        letterSpacing: transform === "lowercase" ? "0.02em" : "0.12em",
        WebkitTextStroke: "0.5px currentColor",
        color,
        ...style,
      }}
    >
      {text}
    </span>
  );
}
