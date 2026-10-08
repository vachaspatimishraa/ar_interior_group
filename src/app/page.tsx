import { CinematicPlaceholder } from "@/components/cinematic-placeholder";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AboutSection } from "@/components/about-section";
import { ServicesSection } from "@/components/services-section";
import { ClientsSection } from "@/components/clients-section";
import { ProjectsSection } from "@/components/projects-section";
import { OngoingProjectsSection } from "@/components/ongoing-projects-section";
import { OfficesSection } from "@/components/offices-section";
import { ContactSection } from "@/components/contact-section";
import { getEnquiryConfig } from "@/lib/enquiries/config";
import "./homepage.css";

export default function Home() {
  const onlineEnquiryAvailable = getEnquiryConfig() !== null;

  return (
    <main id="main-content" className="homepage single-page-portfolio">
      <ScrollReveal scope="homepage" />

      {/* Section 1 — Home (Cinematic 2.5D Introduction) */}
      <div id="home">
        <CinematicPlaceholder />
      </div>

      {/* Section 2 — About (Story, Mission, CQET, Team, Presence) */}
      <AboutSection />

      {/* Section 3 — Services (All 7 Documented Categories & Preview Selection) */}
      <ServicesSection />

      {/* Section 4 — Clients (35+ Verified Client Logos & Micro-Market References) */}
      <ClientsSection />

      {/* Section 5 — Projects (Documented Portfolio, 5 Before/After Pairs, 3D Concepts) */}
      <ProjectsSection />

      {/* Section 6 — Ongoing Projects (Unpublished until verified data provided) */}
      <OngoingProjectsSection />

      {/* Section 7 — Both Offices (Two Office Entries & Presence Footprint) */}
      <OfficesSection />

      {/* Section 8 — Availability & Contact (Acceptance Notice & Secure Enquiry Form) */}
      <ContactSection onlineEnquiryAvailable={onlineEnquiryAvailable} />
    </main>
  );
}
