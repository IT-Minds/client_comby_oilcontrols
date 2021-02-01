// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BasicDto {
  //
}

interface BasicIdDto extends BasicDto {
  id?: unknown;
}

export function isIdDto<T extends BasicDto, U extends BasicIdDto>(t: T | U): t is U {
  return (t as U).id !== null || (t as U).id !== undefined;
}
