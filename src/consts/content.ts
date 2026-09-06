export const WORK_CONTENT_STATUSES = ["under-review", "published"] as const;

export type WorkStatus = (typeof WORK_CONTENT_STATUSES)[number];

export const WORK_CONTENT_STATUS_LABELS: Record<WorkStatus, string> = {
  "under-review": "Under Review",
  published: "Published",
};

export const WORK_CONTENT_STATUS_OPTIONS = WORK_CONTENT_STATUSES.map((value) => ({
  value,
  label: WORK_CONTENT_STATUS_LABELS[value],
}));

export function workStatusLabel(status: string): string {
  return WORK_CONTENT_STATUS_LABELS[status as WorkStatus] ?? status;
}

export function formatDuration(totalMinutes: number): string {
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) return "";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr${hours > 1 ? "s" : ""}`;
  return `${hours} hr${hours > 1 ? "s" : ""} ${minutes} min`;
}
