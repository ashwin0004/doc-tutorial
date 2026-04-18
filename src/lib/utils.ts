import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const COLORS = [
  "#D97706", // Orange
  "#059669", // Emerald
  "#7C3AED", // Violet
  "#DB2777", // Pink
  "#2563EB", // Blue
  "#DC2626", // Red
  "#16A34A", // Green
  "#9333EA", // Purple
  "#0891B2", // Cyan
  "#000000", // Black
];

export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length];
}
