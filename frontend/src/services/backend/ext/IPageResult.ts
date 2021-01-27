export interface IPageResult<T, U> {
  newNeedle?: U;
  pagesRemaining?: number;
  results?: T[] | undefined;
  hasMore?: boolean;
}
