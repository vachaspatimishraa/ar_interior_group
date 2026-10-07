"""Reproducibly extract client logo crops and the LTIMindtree pair from the source PDF.

Requires pypdf and Pillow. The crop coordinates below refer to the PDF's embedded
logo-sheet artwork, not page screenshots; the source labels remain in the manifest.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, r"C:\Users\vacha\.cache\codex-runtimes\codex-primary-runtime\dependencies\python")

from PIL import Image, ImageChops
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
PDF = ROOT / "reference" / "AR INTERIOR GROUP WORK PROFILE.pdf"
LOGO_OUT = ROOT / "public" / "client-logos"
TRANSFORM_OUT = ROOT / "public" / "projects" / "ltimindtree-whitefield"

# name, source page, embedded-image index, crop rectangle (left, top, right, bottom)
LOGOS = [
    ("Google", 3, 1, (204, 30, 451, 135)),
    ("Compass Group", 3, 1, (505, 28, 780, 137)),
    ("Myntra", 3, 1, (824, 28, 1040, 138)),
    ("Nxtra by Airtel", 3, 1, (204, 178, 451, 290)),
    ("HighRadius", 3, 1, (504, 178, 780, 290)),
    ("Sequel", 3, 1, (824, 178, 1040, 290)),
    ("iQor", 3, 1, (508, 329, 777, 447)),
    ("ST Telemedia Global Data Centres", 3, 1, (824, 329, 1040, 447)),
    ("TechnipFMC", 3, 1, (508, 482, 780, 562)),
    ("Maier Vidorno", 4, 1, (5, 68, 300, 250)),
    ("Maersk", 4, 1, (315, 80, 600, 230)),
    ("IILM", 4, 1, (950, 75, 1248, 235)),
    ("UFlex", 4, 1, (0, 330, 300, 530)),
    ("Medtronic", 4, 1, (320, 340, 590, 515)),
    ("Vodafone", 4, 1, (590, 315, 810, 535)),
    ("Tata Steel", 4, 1, (775, 285, 990, 520)),
    ("Siemens Healthineers", 4, 1, (990, 335, 1253, 520)),
    ("SmartQ", 5, 1, (0, 0, 340, 220)),
    ("Pronto", 5, 1, (340, 0, 680, 220)),
    ("ICS Foods", 5, 1, (680, 0, 980, 220)),
    ("EXL", 5, 1, (980, 0, 1250, 220)),
    ("OCS", 5, 1, (1250, 0, 1530, 220)),
    ("Shadowfax", 5, 1, (0, 220, 260, 430)),
    ("Technip Energies", 5, 1, (260, 220, 520, 430)),
    ("Coforge", 5, 1, (520, 220, 770, 430)),
    ("NSL", 5, 1, (770, 220, 1030, 430)),
    ("Rivigo", 5, 1, (1030, 220, 1285, 430)),
    ("Defsys Integrated Systems", 5, 1, (1285, 220, 1530, 430)),
    ("Sahyog", 5, 1, (0, 430, 220, 667)),
    ("PB Health", 5, 1, (220, 430, 455, 667)),
    ("HCG Aastha Oncology", 5, 1, (455, 430, 700, 667)),
    ("Narayana Health", 5, 1, (700, 430, 930, 667)),
    ("Medanta", 5, 1, (930, 430, 1150, 667)),
    ("Fortis", 5, 1, (1150, 430, 1340, 667)),
    ("Niwas Housing Finance", 5, 1, (1340, 430, 1530, 667)),
]


def trim_white_margin(image: Image.Image, pad: int = 10) -> Image.Image:
    rgb = image.convert("RGB")
    background = Image.new("RGB", rgb.size, "white")
    diff = ImageChops.difference(rgb, background).convert("L")
    # Ignore faint scan/background noise while retaining pale logo artwork.
    mask = diff.point(lambda value: 255 if value > 58 else 0)
    bounds = mask.getbbox()
    if not bounds:
        return rgb
    left, top, right, bottom = bounds
    return rgb.crop((max(0, left - pad), max(0, top - pad), min(rgb.width, right + pad), min(rgb.height, bottom + pad)))


def main() -> None:
    if not PDF.is_file():
        raise FileNotFoundError(PDF)
    LOGO_OUT.mkdir(parents=True, exist_ok=True)
    TRANSFORM_OUT.mkdir(parents=True, exist_ok=True)
    reader = PdfReader(str(PDF))
    source_sheets: dict[int, Image.Image] = {}
    manifest = []

    for name, page, image_index, rect in LOGOS:
        if page not in source_sheets:
            source_sheets[page] = reader.pages[page - 1].images[image_index].image.convert("RGB")
        crop = trim_white_margin(source_sheets[page].crop(rect))
        filename = name.lower().replace("&", "and").replace(" ", "-").replace(".", "").replace("-", "-") + ".webp"
        filename = "".join(char for char in filename if char.isalnum() or char in "-.")
        path = LOGO_OUT / filename
        crop.save(path, "WEBP", lossless=True, method=6)
        manifest.append({
            "name": name,
            "image": f"/client-logos/{filename}",
            "sourcePage": page,
            "displayOrder": len(manifest) + 1,
            "alt": f"{name} logo, reproduced from the AR Interior Group work profile",
            "publicationApproval": "unconfirmed",
            "width": crop.width,
            "height": crop.height,
            "bytes": path.stat().st_size,
        })

    (ROOT / "src" / "data" / "client-logo-manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    # Page 15's source artwork contains the labeled Before and After views side by side.
    ltim_sheet = reader.pages[14].images[-1].image.convert("RGB")
    mid = ltim_sheet.width // 2
    pair = []
    for label, rect in (("before", (0, 0, mid, ltim_sheet.height)), ("after", (mid, 0, ltim_sheet.width, ltim_sheet.height))):
        image = ltim_sheet.crop(rect)
        filename = f"p15-{label}.webp"
        path = TRANSFORM_OUT / filename
        image.save(path, "WEBP", quality=88, method=6)
        pair.append({"label": label.title(), "path": f"public/projects/ltimindtree-whitefield/{filename}", "sourcePage": 15, "sourceImage": "embedded composite X77.jpg", "width": image.width, "height": image.height, "bytes": path.stat().st_size})
    (ROOT / "src" / "data" / "ltimindtree-whitefield-pair.json").write_text(json.dumps(pair, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"Extracted {len(manifest)} logos and {len(pair)} LTIMindtree panels")
    print(f"Logo bytes: {sum(item['bytes'] for item in manifest)}")
    print(f"LTIMindtree bytes: {sum(item['bytes'] for item in pair)}")


if __name__ == "__main__":
    main()
