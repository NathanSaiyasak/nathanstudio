#!/usr/bin/env python3
"""One-off: build WebP variants from backed-up PNGs. Reads img-originals, writes to featured-img."""
from __future__ import annotations

import csv
import re
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BACKUP = ROOT / "assets/img-originals/featured-img"
OUT_DIR = ROOT / "assets/img/featured-img"
QUALITY = 84
CARD_MAX = 1000
MODAL_MAX = 1600

CARD_RE = re.compile(r"^img-(\d+)\.png$")
MODAL_RE = re.compile(r"^img-\d+-\d+\.png$")


def prepare_rgba(im: Image.Image) -> Image.Image:
    if im.mode in ("RGBA", "LA"):
        return im
    if im.mode == "P" and "transparency" in im.info:
        return im.convert("RGBA")
    if im.mode != "RGB":
        return im.convert("RGB")
    return im


def resize_cap(im: Image.Image, max_dim: int) -> Image.Image:
    w, h = im.size
    if max(w, h) <= max_dim:
        return im.copy()
    out = im.copy()
    out.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
    return out


def main() -> int:
    if not BACKUP.is_dir():
        print("Missing backup:", BACKUP, file=sys.stderr)
        return 1

    rows: list[tuple[str, int, int, int, int, str, str]] = []

    for png in sorted(BACKUP.glob("*.png")):
        name = png.name
        if CARD_RE.match(name):
            max_dim = CARD_MAX
            kind = "card"
        elif MODAL_RE.match(name):
            max_dim = MODAL_MAX
            kind = "modal"
        else:
            print("skip (pattern):", name, file=sys.stderr)
            continue

        before = png.stat().st_size
        im = Image.open(png)
        im = prepare_rgba(im)
        im = resize_cap(im, max_dim)
        webp_path = OUT_DIR / (png.stem + ".webp")
        im.save(
            webp_path,
            "WEBP",
            quality=QUALITY,
            method=6,
        )
        after = webp_path.stat().st_size
        w, h = im.size
        rows.append((webp_path.relative_to(ROOT).as_posix(), before, after, w, h, kind, name))

    # Remove optimized PNGs from deploy folder (originals remain in img-originals)
    for png in OUT_DIR.glob("*.png"):
        if CARD_RE.match(png.name) or MODAL_RE.match(png.name):
            png.unlink()

    report = ROOT / "scripts/featured-img-optimization-report.csv"
    report.parent.mkdir(parents=True, exist_ok=True)
    with report.open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["path", "before_bytes", "after_bytes", "width", "height", "kind", "source_png"])
        for row in rows:
            w.writerow(row)

    total_before = sum(r[1] for r in rows)
    total_after = sum(r[2] for r in rows)
    print(f"files={len(rows)} before={total_before} after={total_after}")
    print(f"report={report}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
