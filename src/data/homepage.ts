// Homepage copy and selections. Project and service facts live in company-profile.ts.
export const homepage = {
  hero: {
    eyebrow: "AR Interior Group",
    heading: "Experts in Space Planning",
    emphasis: "and Design & Build Projects.",
    projects: { label: "Explore projects", href: "/projects" },
    contact: { label: "Contact us", href: "/contact#enquiry-form" },
    disclosure: "Where Visionary Designs Meet Practical Solutions.",
  },
  about: {
    eyebrow: "About AR Interior Group",
    title: "About Us",
    description: "Founded in 2019, A R Interior Group provides turnkey fit-out solutions nationwide. The team brings expertise in project management and execution, taking projects from planning through completion.",
    action: { label: "About Us", href: "/about" },
    image: { slug: "medanta-lucknow", index: 0 },
  },
  services: {
    eyebrow: "Services & capabilities",
    title: "One space. Many disciplines.",
    description: "Rapid growing space planning organization.",
    action: { label: "All services", href: "/services" },
  },
  projects: {
    eyebrow: "Selected projects",
    title: "Spaces with a story to tell.",
    description: "",
    action: { label: "View All Projects", href: "/projects" },
  },
  transformations: {
    eyebrow: "From site to finished space",
    title: "Before and After.",
    description: "",
    action: { label: "View All Projects", href: "/projects" },
  },
  principles: {
    eyebrow: "",
    title: "Success Mantra “C.Q.E.T”",
    image: { slug: "sequel-logistics", index: 6 },
  },
  clients: {
    eyebrow: "",
    title: "Our Clients",
    description: "",
    action: { label: "View Clients", href: "/clients" },
    note: "",
  },
  contact: {
    title: "Start a Conversation",
    action: { label: "Discuss Your Space", href: "/contact#enquiry-form" },
    image: { slug: "medanta-lucknow", index: 1 },
  },
} as const;

export const homepageServiceSelections = [
  {
    slug: "micro-markets-kiosks",
    description: "As per the existing interior and the selection of client we can provide variant type of Micro market/ Kiosk that enhance the interior structure and also comes with brilliant durability & strength. We have wide range of unique and latest design of market setup and if any carpentry/kiosk are comes from out of our catalogue, then we have ability to make the same with same quality.",
    image: { slug: "hcg-aastha-ahmedabad", index: 0 },
  },
  {
    slug: "civil-services",
    description: "We have very experienced & skilled civil engineers who can provide great civil & infrastructure to enhance the area. Still we are working on new bench marks in our civil work for better furnishing, construction of unique civil designs & landscaping space management.",
    image: { slug: "mv-seals-gurgaon", index: 0 },
  },
  {
    slug: "furniture-working-desks",
    description: "We have huge verities of Modular Furniture & Related Fixtures. We always provide the product and services as per the requirement of client to complete the structure of site only with the functional furniture and working desk.",
    image: { slug: "furniture-assembly", index: 0 },
  },
  {
    slug: "alloy-wooden-partitions",
    description: "The wide range of different kind of alloy and wooden partition related services are already done by A R Interior Group. Basically we use our expert’s team as wells experience gained in industry from last few years to match the requirement of client and can be able to provide best partitioning solution. A R Interior Group’s have huge range of alloy and wooden partition to match the almost each & every structure of modular furniture.",
    image: { slug: "mv-seals-gurgaon", index: 1 },
  },
  {
    slug: "flooring-ceiling-solutions",
    description: "Ceiling & Flooring is most important & noticeable part of an infrastructure. AR Interior Group have ability to provide the brilliant service for flooring weather it is related to laying of Granite Stone, Marble Stone, Vitrified Tiles, Glossy Tiles or other Ceiling, Cove ceiling or any other kind of ceiling.",
    image: { slug: "technip-energies-noida", index: 6 },
  },
  {
    slug: "plumbing-sanitary",
    description: "A R Interior Group have a large team of skilled and experience workers who are specialist in Plumbing & Sanitary work, they are also specialist in extraction and installation plumbing accessories, here specific quality as follows: Washroom Solutions; Fire Line Solutions; Extraction Work; Submersible Work; Drain Chamber.",
    image: { slug: "technip-energies-noida", index: 4 },
  },
  {
    slug: "railing-structures",
    description: "As per the existing interior and the selection of client we can provide variant type of railing that enhance the interior structure and also comes with brilliant durability & strength. We have wide range of unique and latest design of railing and if any railings comes from out of our catalogue, then we have ability to fabricate the same with same quality.",
  },
] as const;

export const homepageFeaturedProjects = [
  { slug: "microsoft-bengaluru", imageIndex: 0 },
  { slug: "ltimindtree-hyderabad", imageIndex: 0 },
  { slug: "highradius-hyderabad", imageIndex: 0 },
] as const;

export const homepageTransformationSlugs = [
  "tata-electronics-tamil-nadu",
  "ltimindtree-whitefield",
  "jcb-jaipur",
  "pb-health-gurgaon",
  "mv-seals-gurgaon",
] as const;

export const homepagePrinciples = [
  { title: "Consistency", description: "Consistent innovation and attention to details are the cornerstones of our interior design success." },
  { title: "Quality", description: "Uncompromising quality in design and execution is the foundation of our success." },
  { title: "Economical", description: "Delivering exceptional design solutions that blend creativity with cost-efficiency." },
  { title: "Time Efficiency", description: "On-time delivery without compromising quality, making every project a timely success." },
] as const;

export const homepageHeroStages = [
  { limit: 0.24, label: "Experts in Space Planning" },
  { limit: 0.55, label: "Design & Build Projects" },
  { limit: 0.82, label: "Where Visionary Designs Meet Practical Solutions." },
  { limit: 1.01, label: "Rapid growing space planning organization" },
] as const;
