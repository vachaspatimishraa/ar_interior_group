import { companyAboutProfile, cqetPrinciples, projectBySlug, serviceBySlug, type Project } from "./company-profile.ts";

type ProjectLabel = Pick<Project, "slug" | "title" | "location">;
type ServiceLink = { slug: string; title: string };

export type AboutVisual = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  project: ProjectLabel;
};

function requireProject(slug: string) {
  const project = projectBySlug(slug);
  if (!project) throw new Error(`Unknown About-page project: ${slug}`);
  return project;
}

function projectLabel(project: Project): ProjectLabel {
  const { slug, title, location } = project;
  return { slug, title, location };
}

export function aboutVisual(slug: string, index: number, alt: string): AboutVisual {
  const project = requireProject(slug);
  const image = project.images[index];
  if (!image) throw new Error(`Missing About-page image: ${slug}[${index}]`);
  return {
    src: `/${image.path.replace(/^public\//, "")}`,
    alt,
    caption: `${project.title}${project.location ? ` · ${project.location}` : ""}`,
    width: image.width,
    height: image.height,
    project: projectLabel(project),
  };
}

function requireService(slug: string): ServiceLink {
  const service = serviceBySlug(slug);
  if (!service) throw new Error(`Unknown About-page service: ${slug}`);
  return { slug: service.slug, title: service.title };
}

export const aboutPage = {
  foundingYear: "2019",
  story: companyAboutProfile.story,
  storyMission: companyAboutProfile.storyMission,
  introduction: companyAboutProfile.positioning,
  tagline: companyAboutProfile.tagline,
  closingExcerpt: companyAboutProfile.closingExcerpt,
  strength: {
    roles: companyAboutProfile.teamRoles,
    values: companyAboutProfile.statements[2].values,
  },
  heroVisual: aboutVisual("ltimindtree-hyderabad", 0, "Micro-market seating, lighting and shelving in the LTIMindtree Hyderabad portfolio."),
  processImage: aboutVisual("technip-energies-noida", 0, "Portfolio photograph from Technip Energies, Noida Sector 16."),
  storyVisuals: [
    aboutVisual("sequel-logistics", 4, "Workstations and storage within the Sequel Logistics portfolio workplace."),
    aboutVisual("microsoft-bengaluru", 1, "The Brews & Bakes service counter in the Microsoft Bengaluru portfolio."),
  ],
  capabilityGroups: [
    {
      title: "Space planning & design-build",
      description: "Space planning, interior design and design-build projects.",
      services: [requireService("space-planning-design-build")],
      image: aboutVisual("mv-seals-gurgaon", 1, "Workstations and partitions in the MV Seals Gurgaon portfolio."),
    },
    {
      title: "Turnkey project delivery",
      description: "Turnkey fit-out solutions, project management and execution.",
      services: [requireService("turnkey-fit-outs")],
      image: aboutVisual("sequel-logistics", 2, "Workstation installation shown in the Sequel Logistics portfolio."),
    },
    {
      title: "Micro-markets & kiosks",
      description: "Micro Markets Setup and kiosk work, including custom carpentry beyond catalogue options.",
      services: [requireService("micro-markets-kiosks")],
      image: aboutVisual("hcg-aastha-ahmedabad", 0, "Micro-market counter photographed at HCG Aastha Cancer Centre, Ahmedabad."),
    },
    {
      title: "Interior works & furnishings",
      description: "Civil Services, Furniture & Working Desk, Alloy & Wooden partition, Flooring & ceiling solution, Plumbing & Sanitary work and Railing Structure.",
      services: [
        requireService("civil-services"),
        requireService("furniture-working-desks"),
        requireService("alloy-wooden-partitions"),
        requireService("flooring-ceiling-solutions"),
        requireService("plumbing-sanitary"),
        requireService("railing-structures"),
        requireService("mep-team-capability"),
      ],
      image: aboutVisual("furniture-assembly", 0, "Seating and modular furniture shown in the portfolio’s furniture assembly example."),
    },
  ],
  statements: companyAboutProfile.statements.map((statement, index) => ({
    ...statement,
    description: "description" in statement ? statement.description : statement.values.join(" · "),
    image: [
      aboutVisual("sequel-logistics", 4, "Portfolio photograph from Sequel Logistics."),
      aboutVisual("technip-energies-noida", 2, "Portfolio photograph from Technip Energies, Noida Sector 16."),
      aboutVisual("jcb-jaipur", 1, "Portfolio photograph from JCB, Jaipur."),
      aboutVisual("mv-seals-gurgaon", 1, "Portfolio photograph from MV Seals, Gurgaon."),
    ][index],
  })),
  principles: {
    note: "Success Mantra \"C.Q.E.T\".",
    images: [
      aboutVisual("sequel-logistics", 4, "Portfolio photograph from Sequel Logistics."),
      aboutVisual("technip-energies-noida", 2, "Portfolio photograph from Technip Energies, Noida Sector 16."),
      aboutVisual("jcb-jaipur", 1, "Portfolio photograph from JCB, Jaipur."),
      aboutVisual("mv-seals-gurgaon", 1, "Portfolio photograph from MV Seals, Gurgaon."),
    ],
    items: [
      ...cqetPrinciples,
    ],
  },
  selectedProjects: [
    {
      project: projectLabel(requireProject("microsoft-bengaluru")),
      image: aboutVisual("microsoft-bengaluru", 0, "Brews & Bakes cafe and service counter in the Microsoft Bengaluru portfolio."),
       scope: "",
    },
    {
      project: projectLabel(requireProject("hcg-aastha-ahmedabad")),
      image: aboutVisual("hcg-aastha-ahmedabad", 1, "Micro-market interior photographed at HCG Aastha Cancer Centre in Ahmedabad."),
       scope: "",
    },
    {
      project: projectLabel(requireProject("pb-health-gurgaon")),
      image: aboutVisual("pb-health-gurgaon", 1, "Steeped counter and interior shown in the PB Health Gurgaon portfolio."),
       scope: "",
    },
  ],
  contactVisual: aboutVisual("tata-electronics-tamil-nadu", 1, "Micro-market counter shown in the Tata Electronics Tamil Nadu portfolio."),
} as const;
