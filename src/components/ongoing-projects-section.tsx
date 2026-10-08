export type OngoingProject = {
  title: string;
  location: string;
  scope: string;
  progress?: string;
  expectedCompletion?: string;
};

// No ongoing projects are documented in the 63-page company profile PDF.
// This array is kept empty until verified ongoing project data is provided by the client.
export const verifiedOngoingProjects: OngoingProject[] = [];

export function OngoingProjectsSection() {
  if (verifiedOngoingProjects.length === 0) {
    // Keep section unpublished per specification:
    // "If no ongoing projects are verified, keep the section unpublished and report the missing data."
    return null;
  }

  return (
    <section id="ongoing-projects" className="home-section home-ongoing py-20 sm:py-28 lg:py-36 border-t border-ink/10" aria-labelledby="ongoing-heading">
      <div className="home-shell mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <div className="mb-12">
          <p className="eyebrow text-gold-ink">Section 6 · Active Sites</p>
          <h2 id="ongoing-heading" className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink mt-3">Ongoing Projects</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {verifiedOngoingProjects.map((project) => (
            <div key={project.title} className="rounded-xl border border-ink/10 p-6 bg-white/70">
              <h3 className="font-display text-xl text-ink">{project.title}</h3>
              <p className="text-xs text-gold-ink uppercase font-semibold mt-1">{project.location}</p>
              <p className="text-sm text-ink/75 mt-3">{project.scope}</p>
              {project.progress && <p className="text-xs text-ink/60 mt-2">Progress: {project.progress}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
