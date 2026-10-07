import { ContactEnquiryLink } from "@/components/contact-enquiry-link";
import { HomepagePortfolioImage } from "@/components/homepage-portfolio-image";
import { contact } from "@/data/company-profile";
import { homepage } from "@/data/homepage";
import { homepageContactImage } from "@/data/homepage-projects";
import { ImageReveal, RevealItem, SectionReveal, StaggerGroup } from "@/lib/motion/reveal-attributes";

export function HomepageContactCta() {
  return (
    <section className="home-section home-contact" aria-labelledby="home-contact-title" {...SectionReveal()}>
      <div className="home-shell home-contact-layout">
        <figure className="home-contact-figure" {...ImageReveal({ direction: "right" })}>
          <div className="home-contact-image"><HomepagePortfolioImage image={homepageContactImage} sizes="(max-width: 767px) 92vw, 51vw" /></div>
          <figcaption>{homepageContactImage.caption}</figcaption>
        </figure>
        <div className="home-contact-copy" {...StaggerGroup()}>
          <h2 className="home-title" id="home-contact-title" {...RevealItem({ kind: "heading" })}>{homepage.contact.title}</h2>
          <a className="home-contact-email" href={`mailto:${contact.email}`} {...RevealItem({ kind: "copy" })}>{contact.email}</a>
          <ContactEnquiryLink className="button button-dark home-contact-button" {...RevealItem({ kind: "control" })}>{homepage.contact.action.label} <span aria-hidden="true">→</span></ContactEnquiryLink>
        </div>
      </div>
    </section>
  );
}
