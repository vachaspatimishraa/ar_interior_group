import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactEnquiryLink } from "@/components/contact-enquiry-link";
import { EditorialContactCta } from "@/components/editorial-contact-cta";
import { ContentPage } from "@/components/content-page";
import { projectBySlug, serviceBySlug, services } from "@/data/company-profile";
import { serviceImageSource, serviceImagery } from "@/data/service-imagery";
import { createPageMetadata } from "@/lib/page-metadata";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return services.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  return service ? createPageMetadata(service.title, service.intro, `/services/${slug}`) : { title: "Service not found" };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) notFound();
  const related = service.relatedProjectSlugs?.map(projectBySlug).filter((project) => project !== undefined) ?? [];
  const visual = serviceImagery[service.slug];
  const serviceIndex = services.findIndex(({ slug: itemSlug }) => itemSlug === service.slug);
  const otherServices = services.filter((item) => item.slug !== service.slug).slice(serviceIndex % Math.max(services.length - 1, 1), serviceIndex % Math.max(services.length - 1, 1) + 3);

  return (
    <ContentPage eyebrow="Service detail" title={<>{service.title.split(" ").slice(0, -1).join(" ")}<br /><em>{service.title.split(" ").at(-1)}.</em></>} description={service.intro} current={service.title} parent={{ href: "/services", label: "Services" }} image={visual ? { src: serviceImageSource(visual.path), alt: visual.label, caption: visual.label } : undefined}>
      <section className="bg-surface-muted"><div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20 lg:px-12 lg:py-32">
        <div><p className="eyebrow text-gold-ink">Service overview</p><p className="mt-5 text-xs leading-6 text-ink-muted">Each project&apos;s precise deliverables are agreed with its client.</p></div>
        <div><h2 className="max-w-4xl font-display text-3xl leading-[1.13] tracking-[-0.04em] sm:text-5xl">{service.detail}</h2><ul className="mt-9 grid border-t border-ink/15 sm:grid-cols-2">{service.points.map((point, index) => <li key={point} className="border-b border-ink/15 py-4 pr-5 text-sm leading-6 text-ink-muted sm:odd:border-r sm:odd:pr-8 sm:even:pl-8"><span className="mr-3 font-ui text-[10px] text-gold-ink">{String(index + 1).padStart(2, "0")}</span>{point}</li>)}</ul>{visual && <p className="mt-5 text-xs leading-6 text-ink-muted">The hero photograph provides portfolio context only; it does not establish that this specific scope was included in the pictured project.</p>}</div>
      </div></section>

      <section className="bg-ivory"><div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20 lg:px-12 lg:py-28">
        <div className="service-detail-note"><p className="eyebrow text-gold-ink">Scope, with clarity</p><h2 className="mt-4 max-w-xl font-display text-4xl leading-tight tracking-[-0.045em] sm:text-5xl">A service area, not a one-size-fits-all specification.</h2></div>
        <div className="border-l border-gold pl-6 sm:pl-9"><p className="text-sm leading-7 text-ink-muted">Every space has different requirements. Share the location, intended use and priorities to start a conversation about your brief.</p><ContactEnquiryLink className="link-arrow mt-7">Discuss this requirement <span aria-hidden="true">↗</span></ContactEnquiryLink></div>
      </div></section>

      {related.length > 0 && <section className="bg-surface-muted"><div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28"><div className="section-heading-row"><div><p className="eyebrow text-gold-ink">Related work</p><h2 className="mt-4 font-display text-4xl tracking-[-0.045em] sm:text-5xl">Selected work.</h2></div><p className="max-w-sm text-xs leading-6 text-ink-muted">Selected projects associated with this service area.</p></div><div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((project) => { const image = project.images[0]; return <Link key={project.slug} href={`/projects/${project.slug}`} className="group min-w-0 border-t border-ink/15 pt-4">{image ? <div className="relative aspect-[1.5] overflow-hidden bg-image-surface"><Image src={`/${image.path.replace(/^public\//, "").replace(/\.webp$/, "-thumb.webp")}`} alt={`${project.title}${project.location ? `, ${project.location}` : ""} portfolio photograph`} fill sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 30vw" loading="lazy" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" /></div> : <div className="project-portfolio-text-card project-portfolio-text-card-compact"><span className="eyebrow text-gold-ink">Project</span><span className="text-xs uppercase tracking-[0.13em] text-ink-muted">Image not available</span></div>}<h3 className="mt-4 font-display text-2xl">{project.title}{project.location ? ` · ${project.location}` : ""}</h3></Link>; })}</div></div></section>}

      <section className="bg-ivory"><div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28"><div className="section-heading-row"><div><p className="eyebrow text-gold-ink">Continue exploring</p><h2 className="mt-4 font-display text-4xl tracking-[-0.045em] sm:text-5xl">Other service areas.</h2></div><Link href="/services" className="link-arrow">All services <span aria-hidden="true">↗</span></Link></div><div className="mt-8 grid border-t border-ink/15 sm:grid-cols-3">{otherServices.map((item) => <Link key={item.slug} href={`/services/${item.slug}`} className="group border-b border-ink/15 py-5 pr-5 sm:border-r sm:px-5 first:sm:pl-0 last:sm:border-r-0"><span className="eyebrow text-gold-ink">{item.title}</span><p className="mt-3 text-xs leading-5 text-ink-muted">{item.intro}</p><span className="mt-4 inline-block text-gold-ink transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span></Link>)}</div></div></section>
      <EditorialContactCta compact />
    </ContentPage>
  );
}
