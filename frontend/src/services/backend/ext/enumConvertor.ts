export const enumConvertor = <T>(enumType: unknown): Record<string, T> => {
  const filterAmount = Object.values(enumType).length / 2;
  const filtered = Object.entries(enumType).slice(filterAmount);

  console.log(filterAmount, filtered);
  const result = filtered.reduce<Record<string, T>>((acc, cur) => {
    acc[cur[0]] = cur[1];
    return acc;
  }, {});

  return result;
};
