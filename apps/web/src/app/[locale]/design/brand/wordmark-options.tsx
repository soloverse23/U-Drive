import type { CSSProperties } from "react";
import { brand } from "@u-drive/core";

// Exploration only (step 0.8). The chosen option becomes an outlined SVG; these HTML
// renderings use the live font so the options can be compared before that.

export type WordmarkOption = "a" | "b" | "c";

const [first = "", second = ""] = brand.name.split("-");

const bar = (style: CSSProperties) => (
  <span aria-hidden style={{ display: "inline-block", background: "currentColor", ...style }} />
);

export function WordmarkSample({ option, size }: { option: WordmarkOption; size: number }) {
  const base: CSSProperties = {
    fontSize: size,
    lineHeight: 1,
    fontWeight: 700,
    whiteSpace: "nowrap",
  };

  if (option === "a") {
    return <span style={{ ...base, letterSpacing: "-0.03em" }}>{brand.name}</span>;
  }

  if (option === "b") {
    return (
      <span aria-label={brand.name} style={{ ...base, letterSpacing: "-0.02em" }}>
        {first.toLowerCase()}
        {bar({ width: "0.3em", height: "0.12em", margin: "0 0.06em", verticalAlign: "0.18em" })}
        {second.toLowerCase()}
      </span>
    );
  }

  return (
    <span aria-label={brand.name} style={{ ...base, letterSpacing: "0.01em" }}>
      {first.toUpperCase()}
      {bar({
        width: "0.6em",
        height: "0.15em",
        margin: "0 0.12em",
        verticalAlign: "0.24em",
        transform: "skewX(-24deg)",
      })}
      {second.toUpperCase()}
    </span>
  );
}

/** Compact mark for favicon and app icon: first letter plus the option's hyphen/bar. */
export function CompactMark({ option, size }: { option: WordmarkOption; size: number }) {
  const base: CSSProperties = {
    fontSize: size,
    lineHeight: 1,
    fontWeight: 700,
    whiteSpace: "nowrap",
  };
  if (option === "a")
    return <span style={{ ...base, letterSpacing: "-0.03em" }}>{`${first}-`}</span>;
  if (option === "b") {
    return (
      <span style={base}>
        {first.toLowerCase()}
        {bar({ width: "0.3em", height: "0.12em", marginLeft: "0.06em", verticalAlign: "0.18em" })}
      </span>
    );
  }
  return (
    <span style={base}>
      {first.toUpperCase()}
      {bar({
        width: "0.6em",
        height: "0.15em",
        marginLeft: "0.12em",
        verticalAlign: "0.24em",
        transform: "skewX(-24deg)",
      })}
    </span>
  );
}
