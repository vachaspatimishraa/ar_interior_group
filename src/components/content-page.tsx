import type { ReactNode } from "react";
import { PageIntro } from "@/components/page-intro";

type ContentPageProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  current: string;
  parent?: { href: string; label: string };
  image?: { src: string; alt: string; caption: string };
  children: ReactNode;
};

export function ContentPage({ eyebrow, title, description, current, parent, image, children }: ContentPageProps) {
  return (
    <main id="main-content" className={current === "Services" ? "services-page" : undefined}>
      <PageIntro eyebrow={eyebrow} title={title} description={description} current={current} parent={parent} image={image} staged={current === "Services"} />
      {children}
    </main>
  );
}
