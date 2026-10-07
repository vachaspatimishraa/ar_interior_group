export type SequenceMode = "desktop" | "mobile";

export function getSequenceMode(viewportWidth: number): SequenceMode {
  return viewportWidth <= 767 ? "mobile" : "desktop";
}

export function shouldUseStaticExperience(prefersReducedMotion: boolean, saveData: boolean): boolean {
  return prefersReducedMotion || saveData;
}

export function getFrameIndex(progress: number, frameCount: number): number {
  if (!Number.isInteger(frameCount) || frameCount < 1) return 0;
  const boundedProgress = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  return Math.round(boundedProgress * (frameCount - 1));
}

export function getFrameNeighborhood(center: number, frameCount: number): number[] {
  if (!Number.isInteger(frameCount) || frameCount < 1) return [];
  const boundedCenter = Math.max(0, Math.min(frameCount - 1, Math.trunc(center)));
  return [0, 1, -1, 2, -2, 3, -3]
    .map((offset) => boundedCenter + offset)
    .filter((index) => index >= 0 && index < frameCount);
}
