export type RevealKind = "image" | "eyebrow" | "heading" | "copy" | "card" | "control" | "accent";
export type RevealDirection = "up" | "down" | "left" | "right" | "none";
type RevealOptions = { kind?: RevealKind; direction?: RevealDirection; delayMs?: number };
type ImageRevealOptions = Omit<RevealOptions, "kind"> & { rounded?: boolean };

export function SectionReveal() {
  return { "data-scroll-section": "" } as const;
}

export function RevealItem({
  kind = "copy",
  direction = "up",
  delayMs,
}: RevealOptions = {}) {
  return {
    "data-scroll-reveal": kind,
    "data-reveal-direction": direction,
    ...(delayMs === undefined ? {} : { "data-reveal-delay": delayMs }),
  } as const;
}

export function ImageReveal(options: ImageRevealOptions = {}) {
  return {
    ...RevealItem({ ...options, kind: "image", direction: options.direction ?? "left" }),
    "data-reveal-shape": options.rounded === false ? "square" : "rounded",
  } as const;
}

export function StaggerGroup({ intervalMs }: { intervalMs?: number } = {}) {
  return {
    "data-scroll-stagger": "",
    ...(intervalMs === undefined ? {} : { "data-stagger-interval": intervalMs }),
  } as const;
}

export function shouldUseStaticReveals(reducedMotion: boolean, intersectionObserverAvailable: boolean) {
  return reducedMotion || !intersectionObserverAvailable;
}
