export const FORMATS = ["book", "manga", "audiobook", "ebook", "document"] as const;
export type Format = (typeof FORMATS)[number];

export const UNIT_TYPES = ["pages", "chapters", "minutes", "percent"] as const;
export type UnitType = (typeof UNIT_TYPES)[number];

export const STATUSES = ["to_read", "reading", "finished", "abandoned"] as const;
export type Status = (typeof STATUSES)[number];

export const PRIORITIES = ["high", "medium", "low"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const SELECTION_MODES = ["vote", "raffle", "curator"] as const;
export type SelectionMode = (typeof SELECTION_MODES)[number];

export const formatMeta: Record<
  Format,
  { label: string; unit: UnitType; unitLabel: string; unitSingular: string }
> = {
  book: { label: "Livro", unit: "pages", unitLabel: "páginas", unitSingular: "página" },
  manga: { label: "Mangá / Novel", unit: "chapters", unitLabel: "capítulos", unitSingular: "capítulo" },
  audiobook: { label: "Audiolivro", unit: "minutes", unitLabel: "minutos", unitSingular: "minuto" },
  ebook: { label: "E-book", unit: "percent", unitLabel: "%", unitSingular: "%" },
  document: { label: "Documento", unit: "percent", unitLabel: "%", unitSingular: "%" },
};

export const statusMeta: Record<Status, { label: string }> = {
  to_read: { label: "A ler" },
  reading: { label: "Lendo" },
  finished: { label: "Lido" },
  abandoned: { label: "Pausado" },
};

export const priorityMeta: Record<Priority, { label: string }> = {
  high: { label: "Alta" },
  medium: { label: "Média" },
  low: { label: "Baixa" },
};

export const selectionMeta: Record<SelectionMode, { label: string; hint: string }> = {
  vote: { label: "Votação", hint: "Os membros votam nas obras indicadas." },
  raffle: { label: "Sorteio", hint: "O sistema escolhe ao acaso entre as indicações." },
  curator: { label: "Curadoria", hint: "O administrador define a próxima leitura." },
};

export function unitForFormat(format: Format): UnitType {
  return formatMeta[format].unit;
}

export function progressRatio(progress: number, total: number, ongoing: boolean) {
  if (ongoing) return null;
  if (total <= 0) return 0;
  return Math.min(1, Math.max(0, progress / total));
}

export function progressLabel(
  progress: number,
  total: number,
  unit: UnitType,
  ongoing: boolean,
) {
  if (unit === "percent") return `${Math.round(progress)}%`;
  if (unit === "minutes") {
    const h = Math.floor(progress / 60);
    const m = progress % 60;
    const consumed = h > 0 ? `${h}h ${m}min` : `${m} min`;
    if (ongoing || total <= 0) return consumed;
    const th = Math.floor(total / 60);
    const tm = total % 60;
    const cap = th > 0 ? `${th}h ${tm}min` : `${tm} min`;
    return `${consumed} / ${cap}`;
  }
  const labels: Record<UnitType, string> = {
    pages: "pág.",
    chapters: "cap.",
    minutes: "min",
    percent: "%",
  };
  if (ongoing || total <= 0) return `${progress} ${labels[unit]}`;
  return `${progress} / ${total} ${labels[unit]}`;
}

export function percentOf(progress: number, total: number, ongoing: boolean) {
  if (ongoing) return null;
  if (total <= 0) return 0;
  return Math.round(Math.min(100, Math.max(0, (progress / total) * 100)));
}
