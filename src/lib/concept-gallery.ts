type ConceptAsset = { path: string; pdf_xref: number; page: number; width: number; height: number };

const excludedConceptFiles = new Set([
  "design-p43-img649.webp",
  "design-p44-img662.webp",
  "design-p45-img672.webp",
  "design-p47-img672.webp",
  "design-p48-img689.webp",
  "design-p49-img703.webp",
]);

export function getConceptGalleryAssets(assets: readonly ConceptAsset[]): ConceptAsset[] {
  return [...new Map(assets.map((asset) => [asset.pdf_xref, asset])).values()]
    .filter((asset) => !excludedConceptFiles.has(asset.path.split("/").at(-1) ?? ""));
}
