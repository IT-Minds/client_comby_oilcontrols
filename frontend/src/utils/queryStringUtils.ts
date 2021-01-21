export const queryToArr = (query: string | string[]): string[] => {
  if (Array.isArray(query)) return query as string[];
  return [query as string];
};

export const queryToString = (query: string | string[]): string => {
  if (Array.isArray(query)) throw "Query is an array";
  return query as string;
};
