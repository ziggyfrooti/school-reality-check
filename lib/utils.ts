import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return 'N/A';
  return num.toLocaleString();
}

export function formatPercent(num: number | null | undefined): string {
  if (num === null || num === undefined) return 'N/A';
  return `${num.toFixed(1)}%`;
}

export function formatCurrency(num: number | null | undefined): string {
  if (num === null || num === undefined) return 'N/A';
  return `$${num.toLocaleString()}`;
}
