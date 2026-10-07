export const PROJECT_FILTERS = ["All projects", "Photographed case studies", "Short references", "Micro-markets & kiosks", "Workplace & fit-outs", "Before & after"] as const;
export type ProjectFilter = (typeof PROJECT_FILTERS)[number];

export type ProjectCard = {
  slug: string;
  title: string;
  location?: string;
  summary: string;
  scope?: string;
  category: string;
  hasBeforeAfter: boolean;
  entryKind: "photographed-case-study" | "short-reference";
  cover?: { path: string; width: number; height: number; page: number };
};

export function filterProjectCards<T extends Pick<ProjectCard, "category" | "hasBeforeAfter" | "entryKind">>(projects: T[], selected: ProjectFilter) {
  if (selected === "All projects") return projects;
  if (selected === "Before & after") return projects.filter((project) => project.hasBeforeAfter);
  if (selected === "Photographed case studies") return projects.filter((project) => project.entryKind === "photographed-case-study");
  if (selected === "Short references") return projects.filter((project) => project.entryKind === "short-reference");
  return projects.filter((project) => project.category === selected);
}
