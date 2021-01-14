export const capitalize = (s: string): string => s[0].toUpperCase() + s.slice(1).toLowerCase();

export const capitalizeArr = (s: string[]): string[] => s.map(ss => capitalize(ss));

export const capitalizeAll = (s: string): string =>
  s
    .split(" ")
    .map(ss => capitalize(ss))
    .join(" ");
