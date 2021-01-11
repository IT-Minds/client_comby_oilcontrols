export interface IPageResult<T> {
  newNeedle?: string;
  pagesRemaining?: number;
  results?: T[] | undefined;
  hasMore?: boolean;
}
