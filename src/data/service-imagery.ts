export const serviceImagery: Record<string, { path: string; label: string; page: number; width: number; height: number }> = {
  "space-planning-design-build": { path: "public/projects/technip-energies-noida/p26-img478-thumb.webp", label: "Technip Energies interior in Noida", page: 26, width: 720, height: 338 },
  "turnkey-fit-outs": { path: "public/projects/jcb-jaipur/p36-img575-thumb.webp", label: "JCB workplace interior in Jaipur", page: 36, width: 720, height: 591 },
  "micro-markets-kiosks": { path: "public/projects/ltimindtree-hyderabad/p13-img313-thumb.webp", label: "Micro-market seating, lighting and shelving in the LTIMindtree Hyderabad portfolio", page: 13, width: 720, height: 343 },
  "civil-services": { path: "public/service-profile/civil-services.webp", label: "Civil services illustration", page: 55, width: 1260, height: 1688 },
  "furniture-working-desks": { path: "public/service-profile/furniture-working-desk.webp", label: "Furniture and working desk service illustration", page: 56, width: 1260, height: 1688 },
  "alloy-wooden-partitions": { path: "public/service-profile/alloy-wooden-partition.webp", label: "Alloy and wooden partition service illustration", page: 57, width: 1260, height: 1688 },
  "flooring-ceiling-solutions": { path: "public/projects/technip-energies-noida/p27-img483-thumb.webp", label: "Interior finish and ceiling detail from the Technip Energies Noida portfolio", page: 27, width: 720, height: 338 },
  "plumbing-sanitary": { path: "public/projects/technip-energies-noida/p26-img478-thumb.webp", label: "Washroom interior from the Technip Energies Noida portfolio", page: 26, width: 720, height: 338 },
  "railing-structures": { path: "public/service-profile/railing-structure.webp", label: "Railing structure service illustration", page: 60, width: 1260, height: 1688 },
};

export function serviceImageSource(path: string) {
  return `/${path.replace(/^public\//, "")}`;
}
