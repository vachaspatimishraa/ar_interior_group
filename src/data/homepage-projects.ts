import { projectBySlug, serviceBySlug } from "@/data/company-profile";
import { homepage, homepageFeaturedProjects, homepageServiceSelections } from "@/data/homepage";

function requireProject(slug: string) {
  const project = projectBySlug(slug);
  if (!project) throw new Error(`Unknown homepage project: ${slug}`);
  return project;
}

export function homepageImage(slug: string, index: number) {
  const project = requireProject(slug);
  const asset = project.images[index];
  if (!asset) throw new Error(`Missing homepage image: ${slug}[${index}]`);
  const fallbackAsset = project.images.find((candidate) => candidate.path !== asset.path);
  return {
    src: `/${asset.path.replace(/^public\//, "")}`,
    fallbackSrc: fallbackAsset ? `/${fallbackAsset.path.replace(/^public\//, "")}` : undefined,
    alt: `${project.title}${project.location ? `, ${project.location}` : ""} portfolio photograph`,
    caption: `${project.title}${project.location ? ` · ${project.location}` : ""}`,
    width: asset.width,
    height: asset.height,
  };
}
export type HomepageImage = ReturnType<typeof homepageImage>;

export const homepageAboutImage = homepageImage(homepage.about.image.slug, homepage.about.image.index);
export const homepagePrinciplesImage = homepageImage(homepage.principles.image.slug, homepage.principles.image.index);
export const homepageContactImage = homepageImage(homepage.contact.image.slug, homepage.contact.image.index);

export const homepageProjects = homepageFeaturedProjects.map(({ slug, imageIndex }) => ({
  project: requireProject(slug),
  image: homepageImage(slug, imageIndex),
}));

export const homepageServices = homepageServiceSelections.map((selection) => {
  const service = serviceBySlug(selection.slug);
  if (!service) throw new Error(`Unknown homepage service: ${selection.slug}`);
  return {
    slug: service.slug,
    title: service.title,
    description: selection.description,
    image: "image" in selection ? homepageImage(selection.image.slug, selection.image.index) : undefined,
  };
});
