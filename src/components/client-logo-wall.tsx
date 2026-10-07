import Image from "next/image";
import logoManifest from "@/data/client-logo-manifest.json";
import { ImageReveal } from "@/lib/motion/reveal-attributes";

type ClientLogo = (typeof logoManifest)[number];

const rows: ClientLogo[][] = [logoManifest.slice(0, 12), logoManifest.slice(12, 24), logoManifest.slice(24)];

function LogoSet({ logos, duplicate = false }: { logos: ClientLogo[]; duplicate?: boolean }) {
  return (
    <ul className="client-logo-set" aria-hidden={duplicate || undefined}>
      {logos.map((logo, index) => (
        <li className="client-logo-item" key={`${duplicate ? "copy-" : ""}${logo.name}`}>
          <Image
            src={logo.image}
            alt={duplicate ? "" : `${logo.name} logo`}
            width={logo.width}
            height={logo.height}
            sizes="(max-width: 639px) 38vw, (max-width: 1023px) 22vw, 14vw"
            loading="lazy"
            className="client-logo-image"
            data-size={index % 5}
          />
        </li>
      ))}
    </ul>
  );
}

export function ClientLogoWall({ compact = false, reveal = false }: { compact?: boolean; reveal?: boolean }) {
  return (
    <div className={`client-logo-wall${compact ? " client-logo-wall-compact" : ""}`} role="region" aria-label="Client organizations featured in the portfolio" {...(reveal ? ImageReveal({ direction: "none" }) : {})}>
      {rows.map((logos, index) => (
        <div className={`client-logo-row client-logo-row-${index + 1}`} key={index} role="group" tabIndex={0} aria-label={`Moving client logos, row ${index + 1} of 3. Focus this row to pause it.`}>
          <div className="client-logo-track">
            <LogoSet logos={logos} />
            <LogoSet logos={logos} duplicate />
          </div>
        </div>
      ))}
    </div>
  );
}
