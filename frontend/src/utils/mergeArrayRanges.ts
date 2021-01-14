import "ts-array-ext/min";
import "ts-array-ext/max";
import "ts-array-ext/sortByAttr";

interface Range<T> {
  id: string | number;
  start: T;
  end: T;
}

export const mergeArrayRanges = <T extends Range<number>>(
  ranges: T[],
  newRange: T,
  shouldBeNext: (prev: number) => number = x => x + 1
): T[] => {
  const validRange = shouldBeNext(newRange.start) <= newRange.end;

  if (!validRange) throw Error("Not a valid new range");

  // case 1, newRange is fully within an existing range.
  const case1 = ranges.some(range => newRange.start >= range.start && newRange.end <= range.end);
  if (case1) return ranges;

  const lowerJoins = ranges.filter(
    range =>
      shouldBeNext(range.end) == range.start ||
      range.start == shouldBeNext(range.start) ||
      (newRange.start >= range.start && newRange.start <= range.end)
  );

  const upperJoins = ranges.filter(
    range =>
      shouldBeNext(range.end) == range.end ||
      range.start == shouldBeNext(range.end) ||
      (newRange.end >= range.start && newRange.end <= range.end)
  );

  const lowestVal = lowerJoins.min(x => x.start);
  const highestVal = upperJoins.max(x => x.end);

  const filtered = ranges.filter(
    range => lowerJoins.every(l => l.id !== range.id) && upperJoins.every(l => l.id !== range.id)
  );

  filtered.push({
    id: lowestVal?.id ?? newRange.id,
    start: lowestVal?.start ?? newRange.start,
    end: highestVal?.end ?? newRange.end
  } as T);

  return filtered.sortByAttr(x => x.start);
};
