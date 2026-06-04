// Drift guard: assert the whole token chain traces back to ONE canonical source.
//
//   Delego Design System/colors_and_type.css   ← canonical (hex)
//     ├─ landing/app/styles/tokens.css          (byte copy)
//     ├─ landing/public/design/colors_and_type.css (byte copy)
//     └─ delego-registry registry.json delego-theme  (OKLCH, derived here)
//
// Run locally from the workspace (needs the sibling folders):
//   node scripts/verify-tokens.mjs
// Override paths: CANON=/path/colors_and_type.css LANDING=/path/to/landing
// Exits non-zero on any discrepancy.

import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const CANON = process.env.CANON || resolve(here, "../../Delego Design System/colors_and_type.css");
const LANDING = process.env.LANDING || resolve(here, "../../landing");
const REGISTRY = resolve(here, "../registry.json");

// canonical token name (light, dark) → which shadcn var derives from it
const MAP = {
  background: ["paper", "ink-1000"], foreground: ["slate-700", "fg"],
  card: ["surface", "ink-850"], "card-foreground": ["slate-700", "fg"],
  popover: ["surface", "ink-900"], "popover-foreground": ["slate-700", "fg"],
  primary: ["indigo-500", "indigo-500"], "primary-foreground": ["surface", "surface"],
  secondary: ["paper-2", "ink-850"], "secondary-foreground": ["slate-700", "fg"],
  muted: ["paper-2", "ink-900"], "muted-foreground": ["slate-500", "ink-400"],
  accent: ["paper-2", "ink-800"], "accent-foreground": ["slate-700", "fg"],
  destructive: ["deny", "deny"], "destructive-foreground": ["surface", "surface"],
  border: ["line", "ink-700"], input: ["line", "ink-700"], ring: ["indigo-400", "indigo-400"],
  "chart-1": ["indigo-500", "indigo-400"], "chart-2": ["signal-700", "signal-400"],
  "chart-3": ["approval", "approval"], "chart-4": ["deny", "deny"], "chart-5": ["ink-400", "ink-400"],
  "delego-indigo": ["indigo-500", "indigo-500"], "delego-signal": ["signal-700", "signal-400"],
  "delego-allow": ["signal-700", "signal-400"], "delego-approval": ["approval", "approval"],
  "delego-deny": ["deny", "deny"], "delego-hash": ["signal-700", "signal-400"],
  sidebar: ["surface", "ink-900"], "sidebar-foreground": ["slate-700", "fg"],
  "sidebar-primary": ["indigo-500", "indigo-400"], "sidebar-primary-foreground": ["surface", "surface"],
  "sidebar-accent": ["paper-2", "ink-800"], "sidebar-accent-foreground": ["slate-700", "fg"],
  "sidebar-border": ["line", "ink-700"], "sidebar-ring": ["indigo-400", "indigo-400"],
};

function srgbLin(c) { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }
function hexToOklch(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  if (h.toUpperCase() === "FFFFFF") return "oklch(1 0 0)";
  if (h.toUpperCase() === "000000") return "oklch(0 0 0)";
  const [r, g, b] = [0, 2, 4].map((i) => srgbLin(parseInt(h.slice(i, i + 2), 16)));
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const [l_, m_, s_] = [Math.cbrt(l), Math.cbrt(m), Math.cbrt(s)];
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const C = Math.hypot(a, bb);
  const H = ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360;
  return `oklch(${L.toFixed(4)} ${C.toFixed(4)} ${H.toFixed(2)})`;
}

const fail = [];
const canonCss = readFileSync(CANON, "utf8");
const tokens = {};
for (const m of canonCss.matchAll(/(--[\w-]+):\s*(#[0-9A-Fa-f]{3,6})/g)) tokens[m[1].slice(2)] = m[2];

// 1. byte-identical copies
for (const rel of ["app/styles/tokens.css", "public/design/colors_and_type.css"]) {
  const p = resolve(LANDING, rel);
  if (!existsSync(p)) { console.log(`· skip (not found): ${rel}`); continue; }
  if (readFileSync(p, "utf8") !== canonCss) fail.push(`copy drift: ${rel} != canonical`);
}

// 2. registry OKLCH derives from canonical
const reg = JSON.parse(readFileSync(REGISTRY, "utf8"));
const theme = reg.items.find((i) => i.name === "delego-theme").cssVars;
for (const [varName, [lt, dt]] of Object.entries(MAP)) {
  for (const [mode, tok] of [["light", lt], ["dark", dt]]) {
    const hex = tokens[tok];
    if (!hex) { fail.push(`canonical missing token --${tok} (for ${mode} ${varName})`); continue; }
    const want = hexToOklch(hex);
    const got = (theme[mode][varName] || "").replace(/\s+/g, " ").trim();
    if (got !== want) fail.push(`${mode} --${varName}: registry "${got}" != canonical --${tok} ${want}`);
  }
}

if (fail.length) {
  console.error(`\n✗ ${fail.length} token discrepancy(ies):`);
  for (const f of fail) console.error("  - " + f);
  process.exit(1);
}
console.log(`✓ tokens in sync — ${Object.keys(MAP).length} vars × 2 modes derive from canonical; copies byte-identical.`);
