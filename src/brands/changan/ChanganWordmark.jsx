// Renders the word "changan" in the spirit of the Changan wordmark:
// uppercase, wide tracking, heavy geometric weight. This is a CSS
// approximation of the bespoke logotype (triangular "A", cut "G") — swap in
// the official wordmark SVG later for an exact match.
export function ChanganWordmark({ color = "#ffffff", style }) {
  return (
    <span
      style={{
        fontFamily:
          '"Arial Black", "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        // faux-italic slant + tight vertical scale evokes the logotype's
        // forward-leaning, engineered feel
        fontStyle: "normal",
        WebkitTextStroke: "0.5px currentColor",
        color,
        ...style,
      }}
    >
      Changan
    </span>
  );
}
