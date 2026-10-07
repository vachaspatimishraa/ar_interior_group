import Image from "next/image";
import clientLogoManifest from "@/data/client-logo-manifest.json";
import { RevealItem, StaggerGroup } from "@/lib/motion/reveal-attributes";

type ClientLogo = (typeof clientLogoManifest)[number];

function normalizedName(name: string) {
  return name.toLocaleLowerCase().replace(/[^a-z0-9]/g, "");
}

export function ClientLogoCollection({ names }: { names: readonly string[] }) {
  const logos = new Map<string, ClientLogo>(clientLogoManifest.map((logo) => [normalizedName(logo.name), logo]));

  return (
    <ul className="clients-logo-grid" aria-label="Client organisations" {...StaggerGroup({ intervalMs: 14 })}>
      {names.map((name) => {
        const logo = logos.get(normalizedName(name));
        return (
          <li className={"clients-logo-item" + (logo ? "" : " clients-logo-item-text-only")} key={name} {...RevealItem({ kind: "card", delayMs: 700 })}>
            <div className="clients-logo-mark">
              {logo ? <Image src={logo.image} alt="" width={logo.width} height={logo.height} sizes="(max-width: 639px) 36vw, (max-width: 1023px) 25vw, 16vw" loading="lazy" /> : <span aria-hidden="true">{name}</span>}
            </div>
            <span className="clients-logo-name">{name}</span>
          </li>
        );
      })}
    </ul>
  );
}
