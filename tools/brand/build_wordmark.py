"""Builds the U-Drive "Lane" wordmark (option C, founder pick 2026-10-23) as outlined SVG.

The logo is the brand name in Instrument Sans Bold capitals with a slanted bar ("lane line")
in place of the hyphen. Outlining the glyphs makes the logo independent of the web font.

Usage (needs Python 3 with `fonttools brotli uharfbuzz`):
    python tools/brand/build_wordmark.py path/to/instrument-sans-700.woff2

Writes:
    apps/web/src/components/layout/wordmark-paths.ts   (path data for the React component)
    apps/web/public/brand/*.svg                        (standalone files)
    apps/web/src/app/icon.svg                          (favicon)
    tools/brand/out/icon-square.svg, og.svg            (sources for tools/brand/rasterize.mjs)

Then run `node tools/brand/rasterize.mjs` for the PNG icons and the Open Graph image.
"""

from __future__ import annotations

import json
import math
import sys
from pathlib import Path

import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[2]
BRAND_FILE = ROOT / "packages/core/src/config/brand.ts"

# Geometry in em units, matching the approved HTML exploration (design/brand).
LETTER_SPACING = 0.01
BAR = {"width": 0.6, "height": 0.15, "bottom": 0.24, "margin": 0.12, "skew_deg": 24}


def brand_name() -> str:
    for line in BRAND_FILE.read_text().splitlines():
        if line.strip().startswith("name:"):
            return line.split('"')[1]
    raise SystemExit("brand name not found in " + str(BRAND_FILE))


class Shaper:
    def __init__(self, font_path: str):
        self.tt = TTFont(font_path)
        self.upem = self.tt["head"].unitsPerEm
        self.glyphs = self.tt.getGlyphSet()
        blob = hb.Blob(Path(font_path).read_bytes()) if not font_path.endswith(".woff2") else None
        if blob is None:
            # HarfBuzz needs the raw sfnt; decompress WOFF2 via fontTools.
            from io import BytesIO

            buf = BytesIO()
            self.tt.flavor = None
            self.tt.save(buf)
            blob = hb.Blob(buf.getvalue())
        self.hb_font = hb.Font(hb.Face(blob))

    def shape(self, text: str):
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        hb.shape(self.hb_font, buf, {"kern": True, "liga": False})
        order = self.tt.getGlyphOrder()
        return [(order[i.codepoint], p.x_advance, p.x_offset) for i, p in zip(buf.glyph_infos, buf.glyph_positions)]


def draw_text(shaper: Shaper, text: str, x: float, pen_paths: list, bounds: BoundsPen) -> float:
    spacing = LETTER_SPACING * shaper.upem
    shaped = shaper.shape(text)
    for index, (name, advance, offset) in enumerate(shaped):
        glyph = shaper.glyphs[name]
        svg = SVGPathPen(shaper.glyphs, ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
        # Flip y (font units are y-up); the viewBox is fixed later.
        glyph.draw(TransformPen(svg, (1, 0, 0, -1, x + offset, 0)))
        glyph.draw(TransformPen(bounds, (1, 0, 0, 1, x + offset, 0)))
        pen_paths.append(svg.getCommands())
        x += advance + (spacing if index < len(shaped) - 1 else 0)
    return x


def bar_path(x: float, upem: int) -> tuple[str, float, tuple]:
    w, h = BAR["width"] * upem, BAR["height"] * upem
    y0 = BAR["bottom"] * upem
    lean = math.tan(math.radians(BAR["skew_deg"])) * h / 2
    pts = [(x - lean, y0), (x + w - lean, y0), (x + w + lean, y0 + h), (x + lean, y0 + h)]
    d = "M" + "L".join(f"{px:.1f} {-py:.1f}" for px, py in pts) + "Z"
    xs = [p[0] for p in pts]
    return d, x + w, (min(xs), y0, max(xs), y0 + h)


def build(shaper: Shaper, first: str, second: str | None):
    paths: list[str] = []
    bounds = BoundsPen(shaper.glyphs)
    x = draw_text(shaper, first, 0, paths, bounds)
    x += BAR["margin"] * shaper.upem
    d, x, bar_bounds = bar_path(x, shaper.upem)
    paths.append(d)
    if second:
        x += BAR["margin"] * shaper.upem
        draw_text(shaper, second, x, paths, bounds)
    gx0, gy0, gx1, gy1 = bounds.bounds
    x0, y0 = min(gx0, bar_bounds[0]), min(gy0, bar_bounds[1])
    x1, y1 = max(gx1, bar_bounds[2]), max(gy1, bar_bounds[3])
    # viewBox in flipped space: y runs from -y1 (top) to -y0 (bottom).
    view_box = f"{x0:.1f} {-y1:.1f} {x1 - x0:.1f} {y1 - y0:.1f}"
    return {"viewBox": view_box, "d": " ".join(paths), "width": x1 - x0, "height": y1 - y0}


def svg_file(art: dict, fill: str, title: str) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{art["viewBox"]}" role="img" '
        f'aria-label="{title}"><title>{title}</title><path fill="{fill}" d="{art["d"]}"/></svg>\n'
    )


def icon_svg(art: dict, size: int, radius: int, mark_ratio: float) -> str:
    vx, vy, vw, vh = (float(v) for v in art["viewBox"].split())
    scale = size * mark_ratio / vw
    tx = (size - vw * scale) / 2 - vx * scale
    ty = (size - vh * scale) / 2 - vy * scale
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">'
        f'<rect width="{size}" height="{size}" rx="{radius}" fill="#000000"/>'
        f'<path fill="#FFFFFF" transform="translate({tx:.2f} {ty:.2f}) scale({scale:.5f})" d="{art["d"]}"/>'
        "</svg>\n"
    )


def og_svg(art: dict) -> str:
    width, height, left = 1200, 630, 96
    vx, vy, vw, vh = (float(v) for v in art["viewBox"].split())
    scale = 640 / vw
    tx = left - vx * scale
    ty = (height - vh * scale) / 2 - vy * scale
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">'
        f'<rect width="{width}" height="{height}" fill="#000000"/>'
        f'<path fill="#FFFFFF" transform="translate({tx:.2f} {ty:.2f}) scale({scale:.5f})" d="{art["d"]}"/>'
        "</svg>\n"
    )


def main():
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    name = brand_name()
    first, _, second = name.upper().partition("-")
    shaper = Shaper(sys.argv[1])
    wordmark = build(shaper, first, second)
    mark = build(shaper, first, None)

    ts = ROOT / "apps/web/src/components/layout/wordmark-paths.ts"
    ts.write_text(
        "// Generated by tools/brand/build_wordmark.py. Do not edit by hand.\n"
        f"export const wordmarkArt = {json.dumps({k: wordmark[k] for k in ('viewBox', 'd')})} as const;\n"
        f"export const markArt = {json.dumps({k: mark[k] for k in ('viewBox', 'd')})} as const;\n"
    )

    public = ROOT / "apps/web/public/brand"
    public.mkdir(parents=True, exist_ok=True)
    for variant, fill in (("black", "#000000"), ("white", "#FFFFFF")):
        (public / f"wordmark-{variant}.svg").write_text(svg_file(wordmark, fill, name))
        (public / f"mark-{variant}.svg").write_text(svg_file(mark, fill, name))
    # Favicon: rounded black tile, readable on light and dark browser chrome.
    (ROOT / "apps/web/src/app/icon.svg").write_text(icon_svg(mark, 32, 6, 0.72))
    out = ROOT / "tools/brand/out"
    out.mkdir(exist_ok=True)
    # Full-bleed square for app icons; mark at 56% stays inside the maskable safe zone.
    (out / "icon-square.svg").write_text(icon_svg(mark, 512, 0, 0.56))
    (out / "og.svg").write_text(og_svg(wordmark))
    print(f"wordmark {wordmark['width']:.0f}x{wordmark['height']:.0f}, mark {mark['width']:.0f}x{mark['height']:.0f}")


if __name__ == "__main__":
    main()
