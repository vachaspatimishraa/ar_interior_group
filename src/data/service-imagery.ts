export const serviceImagery: Record<string, { path: string; label: string; page: number; width: number; height: number }> = {
  "space-planning-design-build": { path: "public/projects/technip-energies-noida/p26-img478-thumb.webp", label: "Technip Energies interior in Noida", page: 26, width: 720, height: 338 },
  "turnkey-fit-outs": { path: "public/projects/jcb-jaipur/p36-img575-thumb.webp", label: "JCB workplace interior in Jaipur", page: 36, width: 720, height: 591 },
  "micro-markets-kiosks": { path: "public/service-profile/micro-market-kiosk.webp", label: "Micro-market and kiosk service illustration", page: 8, width: 1950, height: 1368 },
  "civil-services": { path: "public/service-profile/civil-services.webp", label: "Civil services illustration", page: 55, width: 1260, height: 1688 },
  "furniture-working-desks": { path: "public/service-profile/furniture-working-desk.webp", label: "Furniture and working desk service illustration", page: 56, width: 1260, height: 1688 },
  "alloy-wooden-partitions": { path: "public/service-profile/alloy-wooden-partition.webp", label: "Alloy and wooden partition service illustration", page: 57, width: 1260, height: 1688 },
  "flooring-ceiling-solutions": { path: "public/service-profile/flooring-ceiling.webp", label: "Flooring and ceiling service illustration", page: 58, width: 1260, height: 1688 },
  "plumbing-sanitary": { path: "public/service-profile/plumbing-sanitary.webp", label: "Plumbing and sanitary service illustration", page: 59, width: 1260, height: 1688 },
  "railing-structures": { path: "public/service-profile/railing-structure.webp", label: "Railing structure service illustration", page: 60, width: 1260, height: 1688 },
};

export function serviceImageSource(path: string) {
  return `/${path.replace(/^public\//, "")}`;
}
