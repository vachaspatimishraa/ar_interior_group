import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactEnquiryLink } from "@/components/contact-enquiry-link";
import { EditorialContactCta } from "@/components/editorial-contact-cta";
import { ContentPage } from "@/components/content-page";
import { BeforeAfter, ProjectGallery } from "@/components/project-gallery";
import { directoryProjects, projectBySlug } from "@/data/company-profile";
import { createPageMetadata } from "@/lib/page-metadata";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return [...directoryProjects, projectBySlug("furniture-assembly")!].map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  return project ? createPageMetadata(project.location ? `${project.title} · ${project.location}` : project.title, project.summary, `/projects/${slug}`) : { title: "Project not found" };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();
  const index = directoryProjects.findIndex((item) => item.slug === project.slug);
  const previous = index > 0 ? directoryProjects[index - 1] : undefined;
  const next = index >= 0 ? directoryProjects[index + 1] : undefined;
  const heroImage = project.comparison?.after ?? project.images[0];
  const heroPath = heroImage?.path.replace(/^public\//, "").replace(/\.webp$/, project.slug === "ltimindtree-whitefield" ? ".webp" : "-thumb.webp");
  const comparedPaths = project.comparison ? [project.comparison.before.path, project.comparison.after.path] : [];

  return (
    <ContentPage eyebrow={project.entryKind === "short-reference" ? "Project" : project.entryKind === "service-example" ? "Service example" : "Project"} title={<>{project.title}{project.location && <><br /><em>{project.location}.</em></>}</>} description={project.summary} current={project.title} parent={{ href: "/projects", label: "Projects" }} image={heroImage && heroPath ? { src: `/${heroPath}`, alt: `${project.title}${project.location ? `, ${project.location}` : ""} portfolio photograph`, caption: `${project.title}${project.location ? ` · ${project.location}` : ""}` } : undefined}>
      <section className="bg-surface-muted"><div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20 lg:px-12 lg:py-28">
        <p className="eyebrow text-gold-ink">{project.entryKind === "short-reference" ? "Project" : project.entryKind === "service-example" ? "Service illustration" : "Project details"}</p><div><h2 className="font-display text-3xl leading-tight tracking-[-0.04em] sm:text-5xl">{project.entryKind === "short-reference" ? "A concise reference." : project.entryKind === "service-example" ? "Service capability." : "A closer look."}</h2><p className="mt-6 max-w-3xl text-sm leading-7 text-ink-muted">{project.scope ?? project.summary}</p>{project.entryKind === "service-example" && <p className="mt-4 max-w-3xl text-sm leading-7 text-ink-muted">This illustrates a service and is not presented as a named client project.</p>}<div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.13em] text-ink-muted"><span>{project.category}</span></div></div>
      </div></section>

      {project.entryKind !== "short-reference" && <section className="bg-ivory"><div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <div className="section-heading-row"><div><p className="eyebrow text-gold-ink">{project.comparison ? "Before & after" : "Project photography"}</p><h2 className="mt-4 font-display text-4xl tracking-[-0.045em] sm:text-6xl">{project.comparison ? "A documented transformation." : "Project views."}</h2></div><p className="max-w-sm text-xs leading-6 text-ink-muted">Project photographs are grouped with the names and locations they document.</p></div>
        {project.comparison && <BeforeAfter comparison={project.comparison} />}
        <div className={project.comparison ? "mt-12" : "mt-8"}><ProjectGallery project={project} excludePaths={comparedPaths} /></div>
        <p className="mt-8 max-w-3xl border-l border-gold pl-5 text-xs leading-6 text-ink-muted">The photographs are grouped with their project entry. Where before-and-after views show different perspectives, they are not presented as an aligned comparison.</p>
      </div></section>}

      <section className="bg-surface-muted"><div className="mx-auto max-w-[1440px] px-6 py-12 sm:px-8 lg:px-12"><div className="grid gap-5 sm:grid-cols-2">{previous ? <Link href={`/projects/${previous.slug}`} className="project-neighbor group border-t border-ink/20 py-5"><span className="eyebrow text-gold-ink">← Previous project</span><span className="mt-3 block font-display text-2xl">{previous.title}{previous.location ? ` · ${previous.location}` : ""}</span></Link> : <span />}{next ? <Link href={`/projects/${next.slug}`} className="project-neighbor group border-t border-ink/20 py-5 sm:text-right"><span className="eyebrow text-gold-ink">Next project →</span><span className="mt-3 block font-display text-2xl">{next.title}{next.location ? ` · ${next.location}` : ""}</span></Link> : <span />}</div><div className="mt-5 flex flex-wrap gap-3"><Link href="/projects" className="button button-outline">All projects <span aria-hidden="true">↗</span></Link><ContactEnquiryLink className="button button-dark">Discuss a requirement <span aria-hidden="true">↗</span></ContactEnquiryLink></div></div></section>
      <EditorialContactCta compact />
    </ContentPage>
  );
}
