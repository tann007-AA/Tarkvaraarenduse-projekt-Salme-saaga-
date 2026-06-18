export type StoryIsland = 'rootsi' | 'gotland' | 'saaremaa';

export type HousePhase =
  | 'etapp1'
  | 'longhouse'
  | 'etapp2'
  | 'hnefatafl'
  | 'loop'
  | 'raidho'
  | 'done';

export interface StoryProgress {
  housePhase: HousePhase;
  currentStoryIsland?: StoryIsland;
  completedBeachIslands?: StoryIsland[];
  completedMarkers?: Record<string, number>;
}

const STORAGE_KEY = 'pell-story-progress';

export function loadStoryProgress(): StoryProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoryProgress;
  } catch {
    return null;
  }
}

export function saveStoryProgress(progress: StoryProgress) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage might be disabled/full
  }
}

export function patchStoryProgress(patch: Partial<StoryProgress>) {
  if (typeof window === 'undefined') return;
  try {
    const current = loadStoryProgress() || { housePhase: 'etapp1' };
    const updated = { ...current, ...patch };
    saveStoryProgress(updated);
  } catch {
    // ignore
  }
}

export function getIslandCheckpointCount(island: StoryIsland): number {
  if (typeof window === 'undefined') return 0;
  try {
    const current = loadStoryProgress();
    return current?.completedMarkers?.[island] ?? 0;
  } catch {
    return 0;
  }
}

export function updateIslandCheckpoint(island: StoryIsland, count: number) {
  if (typeof window === 'undefined') return;
  try {
    const current = loadStoryProgress() || { housePhase: 'etapp1' };
    const completedMarkers = { ...(current.completedMarkers ?? {}), [island]: count };
    saveStoryProgress({ ...current, completedMarkers });
  } catch {
    // ignore
  }
}

export function resetStoryProgress() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
