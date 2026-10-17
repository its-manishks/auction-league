/** Categories offered in player forms (unchanged from the original app). */
export const PLAYER_CATEGORIES: string[] = ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'];

/** CSS class for a category chip, e.g. "All-Rounder" -> "cat-all-rounder". */
export function categoryClass(category?: string | null): string {
  const slug = (category || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  return slug ? `cat cat-${slug}` : 'cat';
}

export interface PurseInfo {
  spent: number;
  max: number;
  left: number;
  percent: number;     // 0-100, width of the meter
  state: '' | 'is-tight' | 'is-full';
}

/** Budget meter maths shared by the admin and organizer screens. */
export function purseInfo(spent: number | undefined | null, max: number | undefined | null): PurseInfo {
  const s = Number(spent) || 0;
  const m = Number(max) || 0;
  const percent = m > 0 ? Math.min(100, Math.max(0, (s / m) * 100)) : (s > 0 ? 100 : 0);
  const state = percent >= 100 ? 'is-full' : percent >= 80 ? 'is-tight' : '';
  return { spent: s, max: m, left: m - s, percent, state };
}

/** First letter for avatar circles. */
export function initial(name?: string | null): string {
  return ((name || '').trim().charAt(0) || '?').toUpperCase();
}

/** Toggles Bootstrap's body scroll lock while a modal is open. */
export function setBodyScrollLock(locked: boolean): void {
  try {
    document.body.classList.toggle('modal-open', locked);
  } catch {
    /* no document */
  }
}
