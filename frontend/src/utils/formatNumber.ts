export const formatInputNumber = (n: string): string => {
  console.log(n);
  const commaMatch = n.match(/,/g);

  console.assert(commaMatch === null || commaMatch.length <= 1, "a lot of commas", commaMatch, n);

  const newn = n.replace(",", ".");

  const periodMatch = newn.match(/\./g);
  console.assert(
    periodMatch === null || periodMatch.length <= 1,
    "a lot of periods",
    periodMatch,
    newn
  );

  return newn;
};

export const parseInputToNumber = (n: string, round = 2): number =>
  isNaN(Number(n)) ? NaN : Math.round(Number.parseFloat(n) * 10 ** round) / 10 ** round;
