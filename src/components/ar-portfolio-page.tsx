import Image from "next/image";
import Link from "next/link";
import { ContactEnquiryLink } from "@/components/contact-enquiry-link";
import { ContactForm } from "@/components/contact-form";
import { companyAboutProfile, contact, projectBySlug } from "@/data/company-profile";
import { serviceOverview } from "@/data/services";
import { getEnquiryConfig } from "@/lib/enquiries/config";
import { presenceCities } from "@/data/offices";
import clientLogoManifest from "@/data/client-logo-manifest.json" with { type: "json" };

function publicPath(path: string) {
  return `/${path.replace(/^\/+/, "").replace(/^public\//, "")}`;
}

function imageFor(slug: string, index = 0) {
  const project = projectBySlug(slug);
  const image = project?.images[index] ?? project?.comparison?.after;
  if (!project || !image) return null;
  return {
    src: publicPath(image.path),
    alt: `${project.title}${project.location ? `, ${project.location}` : ""} portfolio photograph`,
    caption: `${project.title}${project.location ? ` · ${project.location}` : ""}`,
  };
}

const heroImage = imageFor("ltimindtree-hyderabad");
const aboutImage = imageFor("technip-energies-noida", 2);
const selectedProjects = [
  { project: projectBySlug("microsoft-bengaluru"), image: imageFor("microsoft-bengaluru") },
  { project: projectBySlug("ltimindtree-hyderabad"), image: imageFor("ltimindtree-hyderabad") },
  { project: projectBySlug("highradius-hyderabad",), image: imageFor("highradius-hyderabad", 1) },
  { project: projectBySlug("tata-electronics-tamil-nadu"), image: imageFor("tata-electronics-tamil-nadu", 1) },
  { project: projectBySlug("jcb-jaipur"), image: imageFor("jcb-jaipur", 1) },
  { project: projectBySlug("mv-seals-gurgaon"), image: imageFor("mv-seals-gurgaon", 1) },
].filter((item): item is { project: NonNullable<typeof item.project>; image: NonNullable<typeof item.image> } => Boolean(item.project && item.image));

const serviceCards = serviceOverview.map((service) => ({
  ...service,
  image: service.image ? publicPath(service.image.src) : null,
}));

export function ArPortfolioPage() {
  const onlineEnquiryAvailable = getEnquiryConfig() !== null;

  return (
    <main id="main-content" className="ar-portfolio">
      <section id="home" className="ar-hero" aria-labelledby="hero-title">
        <div className="ar-hero-glow ar-hero-glow-one" aria-hidden="true" />
        <div className="ar-hero-glow ar-hero-glow-two" aria-hidden="true" />
        <div className="ar-container ar-hero-grid">
          <div className="ar-hero-copy">
            <span className="ar-kicker">AR Interior Group · Founded 2019</span>
            <h1 id="hero-title">Spaces that work.<br /><span>Built with intent.</span></h1>
            <p className="ar-hero-lede">{companyAboutProfile.positioning} {companyAboutProfile.tagline}</p>
            <div className="ar-hero-actions">
              <Link href="#projects" className="ar-button ar-button-gold">View our work <span aria-hidden="true">↗</span></Link>
              <ContactEnquiryLink className="ar-button ar-button-quiet">Start a conversation <span aria-hidden="true">↗</span></ContactEnquiryLink>
            </div>
            <div className="ar-hero-note"><span className="ar-status-dot" aria-hidden="true" />Turnkey fit-outs · Project management · Execution</div>
          </div>
          {heroImage && <figure className="ar-hero-visual"><Image src={heroImage.src} alt={heroImage.alt} fill priority sizes="(max-width: 900px) 92vw, 48vw" className="ar-cover" /><figcaption>{heroImage.caption}</figcaption></figure>}
        </div>
        <a href="#about" className="ar-scroll-cue">Scroll to explore <span aria-hidden="true">↓</span></a>
      </section>

      <section id="about" className="ar-section ar-section-paper" aria-labelledby="about-title">
        <div className="ar-container ar-split-grid">
          <div className="ar-section-intro"><span className="ar-kicker">01 · About the group</span><h2 id="about-title">Practical thinking.<br /><em>Considered spaces.</em></h2></div>
          <div className="ar-section-copy"><p className="ar-lead">{companyAboutProfile.story[0]} {companyAboutProfile.story[1]}</p><p>{companyAboutProfile.story[2]}</p><blockquote>{companyAboutProfile.storyMission}</blockquote><Link href="/about" className="ar-text-link">Read our story <span aria-hidden="true">↗</span></Link></div>
        </div>
        <div className="ar-container ar-about-bottom">
          {aboutImage && <figure className="ar-editorial-image"><Image src={aboutImage.src} alt={aboutImage.alt} fill sizes="(max-width: 900px) 92vw, 58vw" className="ar-cover" loading="lazy" /><figcaption>{aboutImage.caption}</figcaption></figure>}
          <div className="ar-fact-list"><div><strong>2019</strong><span>Founded</span></div><div><strong>07</strong><span>Documented service areas</span></div><div><strong>05</strong><span>Presence cities</span></div></div>
        </div>
      </section>

      <section id="services" className="ar-section ar-section-grey" aria-labelledby="services-title">
        <div className="ar-container"><div className="ar-section-heading"><div><span className="ar-kicker">02 · Services &amp; capabilities</span><h2 id="services-title">One space.<br /><em>Many disciplines.</em></h2></div><p>From space planning and design-build to specialist interior works, the documented service areas come together around the brief.</p></div>
          <div className="ar-service-grid">{serviceCards.map((service, index) => <Link href={`/services/${service.slug}`} className="ar-service-card" key={service.slug}>{service.image ? <div className="ar-service-image"><Image src={service.image} alt={service.image ? service.title : ""} fill sizes="(max-width: 640px) 92vw, (max-width: 980px) 45vw, 30vw" className="ar-cover" loading="lazy" /></div> : <div className="ar-service-placeholder" aria-hidden="true"><span>AR</span></div>}<div className="ar-service-card-body"><span className="ar-card-number">{String(index + 1).padStart(2, "0")}</span><h3>{service.title}</h3><span className="ar-card-arrow" aria-hidden="true">↗</span></div></Link>)}</div>
        </div>
      </section>

      <section id="projects" className="ar-section ar-section-paper" aria-labelledby="projects-title">
        <div className="ar-container"><div className="ar-section-heading"><div><span className="ar-kicker">03 · Selected work</span><h2 id="projects-title">Spaces made<br /><em>real.</em></h2></div><p>Selected photographs from the documented AR Interior Group portfolio. Concept renders and Before/After records remain clearly separated from finished project views.</p></div>
          <div className="ar-project-grid">{selectedProjects.map(({ project, image }, index) => <Link href={`/projects/${project.slug}`} key={project.slug} className={`ar-project-card ar-project-card-${index + 1}`}><div className="ar-project-image"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 92vw, (max-width: 1000px) 45vw, 31vw" className="ar-cover" loading="lazy" /><span className="ar-project-index">{String(index + 1).padStart(2, "0")}</span></div><div className="ar-project-meta"><div><h3>{project.title}</h3><p>{project.location ?? project.category}</p></div><span aria-hidden="true">↗</span></div></Link>)}</div>
          <div className="ar-inline-cta"><span>Explore the full documented portfolio</span><Link href="/projects" className="ar-text-link">All projects <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>

      <section id="clients" className="ar-section ar-section-grey" aria-labelledby="clients-title">
        <div className="ar-container"><div className="ar-section-heading"><div><span className="ar-kicker">04 · Client references</span><h2 id="clients-title">Built around<br /><em>trust.</em></h2></div><p>The work profile records organizations across technology, healthcare, finance, education, logistics, and workplace services. Inclusion does not imply endorsement.</p></div><ul className="ar-logo-grid">{clientLogoManifest.map((client) => <li key={client.name}><Image src={client.image} alt={`${client.name} logo`} width={client.width} height={client.height} sizes="(max-width: 640px) 34vw, 150px" loading="lazy" /></li>)}</ul></div>
      </section>

      <section id="presence" className="ar-section ar-section-grey" aria-labelledby="presence-title">
        <div className="ar-container ar-section-heading ar-section-heading-light"><div><span className="ar-kicker">05 · Presence</span><h2 id="presence-title">Local execution.<br /><em>Wider reach.</em></h2></div><p>Documented presence across commercial centres in North, West and South India.</p></div>
        <div className="ar-container ar-presence-grid">{presenceCities.map((city) => <div key={city.name}><span>{city.region}</span><strong>{city.name}</strong><small>{city.highlight}</small></div>)}</div>
      </section>

      <section id="contact" className="ar-section ar-section-paper" aria-labelledby="contact-title">
        <div className="ar-container ar-contact-grid"><div><span className="ar-kicker">06 · Start a conversation</span><h2 id="contact-title">Have a space<br /><em>in mind?</em></h2><p className="ar-lead">Share the location, intended use and priorities. The team can begin with a conversation about your brief.</p><div className="ar-contact-links"><a href={contact.phoneHref}>{contact.phone} <span aria-hidden="true">↗</span></a><a href={`mailto:${contact.email}`}>{contact.email} <span aria-hidden="true">↗</span></a></div></div><div id="enquiry-form" className="ar-form-card"><span className="ar-kicker">Project enquiry</span><h3>Tell us about your requirement</h3>{onlineEnquiryAvailable ? <ContactForm /> : <div className="ar-form-unavailable"><p>Online submission is not configured in this environment.</p><a className="ar-button ar-button-gold" href={`mailto:${contact.email}?subject=${encodeURIComponent("Commercial interior enquiry")}`}>Email your enquiry <span aria-hidden="true">↗</span></a></div>}</div></div>
      </section>
    </main>
  );
}
