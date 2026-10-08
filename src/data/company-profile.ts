import manifest from "./project-image-manifest.json" with { type: "json" };
import ltimPair from "./ltimindtree-whitefield-pair.json" with { type: "json" };

export type PortfolioImage = {
  path: string;
  width: number;
  height: number;
  bytes: number;
  page: number;
  pdf_xref: number;
  classification: string;
};

type Manifest = {
  projects: Record<string, PortfolioImage[]>;
  concept_designs: PortfolioImage[];
};

const assets = manifest as Manifest;

export type Project = {
  slug: string;
  title: string;
  location?: string;
  summary: string;
  scope?: string;
  category: "Micro-markets & kiosks" | "Workplace & fit-outs" | "Furniture assembly";
  entryKind: "photographed-case-study" | "short-reference" | "service-example";
  sourcePages: number[];
  images: PortfolioImage[];
  comparison?: { before: PortfolioImage; after: PortfolioImage; note: string };
};

const documentedPairNote = "The photographs retain their Before and After labels. They show different views and are not an aligned image comparison.";
const referenceCopy = "Listed among the company’s micro-market and kiosk project locations.";

const projectInfo: Omit<Project, "images">[] = [
  { slug: "medanta-lucknow", title: "Medanta Super Speciality Hospital", location: "Lucknow", summary: "A project included in the AR Interior Group portfolio.", scope: "Associated with the micro-market and kiosk service area.", category: "Micro-markets & kiosks", entryKind: "photographed-case-study", sourcePages: [9, 10] },
  { slug: "hcg-aastha-ahmedabad", title: "HCG Aastha Cancer Centre", location: "Ahmedabad", summary: "A project included in the AR Interior Group portfolio.", scope: "Associated with the micro-market and kiosk service area.", category: "Micro-markets & kiosks", entryKind: "photographed-case-study", sourcePages: [11, 12] },
  { slug: "narayana-institute-cardiac-sciences", title: "Narayana Institute of Cardiac Sciences", location: "Bommasandra", summary: referenceCopy, scope: "No project-specific scope or photographs are documented for this reference.", category: "Micro-markets & kiosks", entryKind: "short-reference", sourcePages: [8] },
  { slug: "shell-india-markets-bengaluru", title: "Shell India Markets Private Limited", location: "Bengaluru", summary: referenceCopy, scope: "No project-specific scope or photographs are documented for this reference.", category: "Micro-markets & kiosks", entryKind: "short-reference", sourcePages: [8] },
  { slug: "lt-tech-park-hebbal", title: "L&T Tech Park", location: "Hebbal, Bengaluru", summary: referenceCopy, scope: "No project-specific scope or photographs are documented for this reference.", category: "Micro-markets & kiosks", entryKind: "short-reference", sourcePages: [8] },
  { slug: "ltimindtree-hyderabad", title: "LTIMindtree", location: "Hyderabad", summary: "A project included in the AR Interior Group portfolio.", scope: "Associated with the micro-market and kiosk service area.", category: "Micro-markets & kiosks", entryKind: "photographed-case-study", sourcePages: [13] },
  { slug: "accenture-services-mumbai", title: "Accenture Services Pvt Ltd", location: "Mumbai", summary: referenceCopy, scope: "No project-specific scope or photographs are documented for this reference.", category: "Micro-markets & kiosks", entryKind: "short-reference", sourcePages: [8] },
  { slug: "wells-fargo-india", title: "Wells Fargo India Private Limited", location: "Hyderabad · Bengaluru", summary: referenceCopy, scope: "No project-specific scope or photographs are documented for this reference.", category: "Micro-markets & kiosks", entryKind: "short-reference", sourcePages: [8] },
  { slug: "tata-electronics-tamil-nadu", title: "Tata Electronics Private Limited", location: "Hosur, Tamil Nadu", summary: "A before-and-after project presentation.", category: "Micro-markets & kiosks", entryKind: "photographed-case-study", sourcePages: [14], comparison: { before: assets.projects["tata-electronics-tamil-nadu"][0], after: assets.projects["tata-electronics-tamil-nadu"][1], note: documentedPairNote } },
  { slug: "ltimindtree-whitefield", title: "LTIMindtree", location: "Whitefield, Bengaluru", summary: "A before-and-after presentation for this location.", category: "Workplace & fit-outs", entryKind: "photographed-case-study", sourcePages: [15], comparison: { before: { path: ltimPair[0].path, width: ltimPair[0].width, height: ltimPair[0].height, bytes: ltimPair[0].bytes, page: 15, pdf_xref: 77, classification: "project_portfolio_photo_before_crop" }, after: { path: ltimPair[1].path, width: ltimPair[1].width, height: ltimPair[1].height, bytes: ltimPair[1].bytes, page: 15, pdf_xref: 77, classification: "project_portfolio_photo_after_crop" }, note: "The photographs are labeled Before and After. They show different viewpoints and are not an aligned image comparison." } },
  { slug: "microsoft-bengaluru", title: "Microsoft", location: "Bengaluru", summary: "A Brews & Bakes workplace amenity counter.", scope: "A café and service-counter setting.", category: "Workplace & fit-outs", entryKind: "photographed-case-study", sourcePages: [16] },
  { slug: "highradius-hyderabad", title: "HighRadius", location: "Hyderabad", summary: "A project included in the AR Interior Group portfolio.", category: "Workplace & fit-outs", entryKind: "photographed-case-study", sourcePages: [17] },
  { slug: "furniture-assembly", title: "Sofa delivery & assembly", summary: "A service example illustrating sofa delivery, assembly, and inspection before customer handover.", scope: "Service example only; no client or location is named.", category: "Furniture assembly", entryKind: "service-example", sourcePages: [18] },
  { slug: "sahyog-rishikesh", title: "Sahyog Urban Thrift & Credit Cooperative Society", location: "Rishikesh", summary: "A project included in the AR Interior Group portfolio.", category: "Workplace & fit-outs", entryKind: "photographed-case-study", sourcePages: [19, 20] },
  { slug: "sequel-logistics", title: "Sequel Logistics Pvt. Ltd.", summary: "A project included in the AR Interior Group portfolio.", category: "Workplace & fit-outs", entryKind: "photographed-case-study", sourcePages: [21, 22, 23, 24] },
  { slug: "technip-energies-noida", title: "Technip Energies", location: "Noida, Sector 16", summary: "A project included in the AR Interior Group portfolio.", category: "Workplace & fit-outs", entryKind: "photographed-case-study", sourcePages: [25, 26, 27, 28, 29, 30] },
  { slug: "airtel-pune", title: "Airtel", location: "Pune", summary: "A project included in the AR Interior Group portfolio.", category: "Workplace & fit-outs", entryKind: "photographed-case-study", sourcePages: [31, 32, 33, 34, 35] },
  { slug: "jcb-jaipur", title: "JCB", location: "Jaipur", summary: "A before-and-after project presentation.", category: "Workplace & fit-outs", entryKind: "photographed-case-study", sourcePages: [36], comparison: { before: assets.projects["jcb-jaipur"][0], after: assets.projects["jcb-jaipur"][1], note: documentedPairNote } },
  { slug: "pb-health-gurgaon", title: "PB Health", location: "Gurgaon", summary: "A before-and-after project presentation.", category: "Workplace & fit-outs", entryKind: "photographed-case-study", sourcePages: [37, 38], comparison: { before: assets.projects["pb-health-gurgaon"][0], after: assets.projects["pb-health-gurgaon"][1], note: documentedPairNote } },
  { slug: "mv-seals-gurgaon", title: "MV Seals", location: "Gurgaon", summary: "A before-and-after project presentation.", category: "Workplace & fit-outs", entryKind: "photographed-case-study", sourcePages: [39, 40], comparison: { before: assets.projects["mv-seals-gurgaon"][0], after: assets.projects["mv-seals-gurgaon"][1], note: documentedPairNote } },
];

export const projects: Project[] = projectInfo.map((project) => ({
  ...project,
  images: assets.projects[project.slug] ?? [],
}));

export const projectBySlug = (slug: string) => projects.find((project) => project.slug === slug);
export const directoryProjects = projects.filter((project) => project.entryKind !== "service-example");

export type Service = {
  slug: string;
  title: string;
  intro: string;
  detail: string;
  points: string[];
  sourcePage: number;
  sourceSection?: string;
  relatedProjectSlugs?: string[];
};

export const services: Service[] = [
  { slug: "space-planning-design-build", title: "Space planning & design-build", intro: "Space planning and design-build are core service areas.", detail: "The work centers on translating client spatial requirements into a planned and designed interior environment.", points: ["Space planning", "Interior design", "Design-and-build projects"], sourcePage: 1 },
  { slug: "turnkey-fit-outs", title: "Turnkey fit-outs", intro: "AR Interior Group provides turnkey fit-out services.", detail: "Project management and execution are areas of expertise. Specific delivery methods and project scopes vary and are not inferred here.", points: ["Turnkey fit-out projects", "Project management", "Project execution"], sourcePage: 50 },
  { slug: "micro-markets-kiosks", title: "MICRO MARKETS SETUP", intro: "As per the existing interior and the selection of client we can provide variant type of Micro market/ Kiosk that enhance the interior structure and also comes with brilliant durability & strength.", detail: "We have wide range of unique and latest design of market setup and if any carpentry/kiosk are comes from out of our catalogue, then we have ability to make the same with same quality.", points: ["Micro market / Kiosk", "Unique and latest design of market setup", "Carpentry / kiosk beyond our catalogue"], sourcePage: 7, sourceSection: "Micro Markets Setup", relatedProjectSlugs: ["medanta-lucknow", "hcg-aastha-ahmedabad", "narayana-institute-cardiac-sciences", "shell-india-markets-bengaluru", "lt-tech-park-hebbal", "ltimindtree-hyderabad", "accenture-services-mumbai", "wells-fargo-india", "tata-electronics-tamil-nadu"] },
  { slug: "civil-services", title: "Civil Services", intro: "We have very experienced & skilled civil engineers who can provide great civil & infrastructure to enhance the area.", detail: "Still we are working on new bench marks in our civil work for better furnishing, construction of unique civil designs & landscaping space management.", points: ["Skilled & experienced Civil Engineers", "Equipped with the latest technology"], sourcePage: 55, sourceSection: "Civil Services" },
  { slug: "mep-team-capability", title: "MEP team capability", intro: "MEP technicians are included among the listed team roles.", detail: "This describes a team capability and does not claim a separately scoped MEP contracting service.", points: ["MEP technicians are included in the team roster"], sourcePage: 51 },
  { slug: "furniture-working-desks", title: "Furniture & Working Desk", intro: "We have huge verities of Modular Furniture & Related Fixtures. We always provide the product and services as per the requirement of client to complete the structure of site only with the functional furniture and working desk.", detail: "Things we consider be fore delivering The product /service on site:", points: ["As per the need of clients", "Latest Design", "Quality of Material", "Appropriate Budget"], sourcePage: 56, sourceSection: "Furniture & Working Desk", relatedProjectSlugs: ["furniture-assembly"] },
  { slug: "alloy-wooden-partitions", title: "Alloy & Wooden partition", intro: "The wide range of different kind of alloy and wooden partition related services are already done by A R Interior Group.", detail: "Basically we use our expert’s team as wells experience gained in industry from last few years to match the requirement of client and can be able to provide best partitioning solution. A R Interior Group’s have huge range of alloy and wooden partition to match the almost each & every structure of modular furniture.", points: ["Alloy partition", "Wooden partition", "Partitioning to match modular furniture"], sourcePage: 57, sourceSection: "Alloy & Wooden partition" },
  { slug: "flooring-ceiling-solutions", title: "Flooring & ceiling solution", intro: "Ceiling & Flooring is most important & noticeable part of an infrastructure.", detail: "A R Interior Group have ability to provide the brilliant service for flooring weather it is related to laying of Granite Stone, Marble Stone, Vitrified Tiles, Glossy Tiles or other Ceiling, Cove ceiling or any other kind of ceiling.", points: ["Granite Stone", "Marble Stone", "Vitrified Tiles", "Glossy Tiles", "Ceiling", "Cove ceiling"], sourcePage: 58, sourceSection: "Flooring & ceiling solution" },
  { slug: "plumbing-sanitary", title: "Plumbing & Sanitary work", intro: "A R Interior Group have a large team of skilled and experience workers who are specialist in Plumbing & Sanitary work,", detail: "they are also specialist in extraction and installation plumbing accessories, here specific quality as follows:-", points: ["Washroom Solutions", "Fire Line Solutions", "Extraction Work", "Submersible Work", "Drain Chamber"], sourcePage: 59, sourceSection: "Plumbing & Sanitary work" },
  { slug: "railing-structures", title: "Railing Structure", intro: "As per the existing interior and the selection of client we can provide variant type of railing that enhance the interior structure and also comes with brilliant durability & strength.", detail: "We have wide range of unique and latest design of railing and if any railings comes from out of our catalogue, then we have ability to fabricate the same with same quality.", points: ["Railing suited to the existing interior and client selection", "Unique and latest designs", "Fabrication beyond catalogue options"], sourcePage: 60, sourceSection: "Railing Structure" },
];

export const serviceBySlug = (slug: string) => services.find((service) => service.slug === slug);

export const cqetPrinciples = [
  { title: "Consistency", description: "Consistent innovation and attention to details are the cornerstones of our interior design success." },
  { title: "Quality", description: "Uncompromising quality in design and execution is the foundation of our success." },
  { title: "Economical", description: "Delivering exceptional design solutions that blend creativity with cost-effectiveness." },
  { title: "Time Efficiency", description: "On-time delivery without compromising quality, making every project a timely success." },
] as const;

export const companyAboutProfile = {
  positioning: "Experts in Space Planning and Design & Build Projects.",
  tagline: "Where Visionary Designs Meet Practical Solutions.",
  story: [
    "A R Interior Group was founded in 2019.",
    "Since then we have established ourselves as one of the leading turn key fit-out solution providers nationwide.",
    "With our key expertise in project management and execution we take full control of each and every aspect of the project and ensure that we achieve the timelines with high end workmanship.",
  ],
  storyMission: "Our mission is to construct a booming interior fit-out firm that enhances the standards of living through the creation of significant jobs in our communities that challenge people to grow in a principled environment.",
  teamRoles: [
    "Designing Officials (Architects & Visualizers)", "Experienced Project Managers", "Planning/Commercial Team",
    "Skilled & Capable Supervisors", "Safety Officers", "Quality Managers", "Skilled Technicians (MEP)",
  ],
  statements: [
    { title: "Purpose", description: "We are personally accountable for delivering on our commitments." },
    { title: "Vision", description: "To be first & last choice of client." },
    { title: "Core Values", values: ["Integrity", "Commitment to clients", "Honesty", "Innovation", "Constant Improvement", "Delivering on our commitments"] },
    { title: "Mission", description: "To fulfill the each & every requirement of our client whether it’s a small or a big organization." },
  ],
  closingExcerpt: "We are committed to delivering exceptional interior design solutions that blend creativity, functionality and affordability. Our mission is to transform every space into a work of art, ensuring that our clients experience the perfect balance of high-quality design, cost-effectiveness, and timely execution.",
} as const;

export const clientNames = [
  "Google", "Compass Group", "Myntra", "Nxtra by Airtel", "HighRadius", "Sequel", "iQor", "ST Telemedia Global Data Centres", "TechnipFMC", "IIM Lucknow", "Maier Vidorno", "Maersk", "GBU", "IILM", "UFlex", "Medtronic", "Vodafone", "Tata Steel", "Siemens Healthineers", "SmartQ", "Pronto", "ICS Foods", "EXL", "OCS", "Shadowfax", "Technip Energies", "Coforge", "NSL", "Rivigo", "Defsys Integrated Systems", "Sahyog", "PB Health", "HCG Aastha Oncology", "Narayana Health", "Medanta", "Fortis", "Niwas Housing Finance",
];

export const contact = {
  phone: "+91 7678495036",
  phoneHref: "tel:+917678495036",
  email: "facilities@arinteriorgroup.com",
  secondaryEmail: "Arinteriorgroup@gmail.com",
  linkedin: "https://www.linkedin.com/in/atul-kumar-shukla-b0703134a",
  instagram: "https://www.instagram.com/a_r_interior_group/",
  googleBusiness: "https://share.google/lbmBGbxJoZZZS7Xcz",
};
