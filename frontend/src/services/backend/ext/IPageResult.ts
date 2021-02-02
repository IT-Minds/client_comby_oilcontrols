export interface IPageResult<T, U> {
  newNeedle?: U;
  pagesRemaining?: number;
  results?: T[] | undefined;
  hasMore?: boolean;
}

export const emptyPageResult = <T = unknown, U = unknown>(): IPageResult<T, U> => {
  return {
    pagesRemaining: 0,
    results: [],
    hasMore: false
  };
};
