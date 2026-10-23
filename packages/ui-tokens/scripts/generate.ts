import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { buildThemeCss } from "../src/theme-css";

const out = fileURLToPath(new URL("../theme.css", import.meta.url));
writeFileSync(out, buildThemeCss());
console.log(`Wrote ${out}`);
