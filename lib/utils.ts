import type { SelectOption } from "@/types";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const PAGE_SIZE = 10;

export function paginate<T>(items: T[], page: number, pageSize = PAGE_SIZE): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function totalPages(count: number, pageSize = PAGE_SIZE): number {
  return Math.max(1, Math.ceil(count / pageSize));
}

const YEAR_START = 2012;

export function getYearOptions(): SelectOption[] {
  const currentYear = new Date().getFullYear();
  const years: SelectOption[] = [];

  for (let year = currentYear; year >= YEAR_START; year--) {
    years.push({ value: String(year), label: String(year) });
  }

  return years;
}
