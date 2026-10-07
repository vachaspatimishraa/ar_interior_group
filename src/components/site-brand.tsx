import Image from "next/image";
import Link from "next/link";

type SiteBrandProps = { variant?: "header" | "footer" | "compact" };

const brandSizes = { header: 48, footer: 62, compact: 54 } as const;

export function SiteBrand({ variant = "header" }: SiteBrandProps) {
  const size = brandSizes[variant];
  return (
    <Link className={`site-brand site-brand-${variant}`} href="/" aria-label="AR Interior Group home">
      <Image
        src="/brand/ar-interior-group-original.webp"
        alt=""
        width={640}
        height={640}
        sizes={`${size}px`}
        loading={variant === "header" ? "eager" : "lazy"}
        className="site-brand-mark"
      />
      <span className="site-brand-name">AR Interior <span>Group</span></span>
    </Link>
  );
}
