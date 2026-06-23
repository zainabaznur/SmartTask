import type { Tugas } from "./types";

/**
 * Earliest Deadline First (EDF) sort.
 * Server-side ORDER BY deadline ASC is the primary sort.
 * This utility is a client-side safety net for re-renders.
 */
export function sortByEDF(tasks: Tugas[]): Tugas[] {
  return [...tasks].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );
}
