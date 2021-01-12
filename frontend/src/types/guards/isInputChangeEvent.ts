import { ChangeEvent } from "react";

export function isInputChangeEvent(
  e: ChangeEvent<HTMLElement>
): e is ChangeEvent<HTMLInputElement> {
  return (e as ChangeEvent<HTMLInputElement>).target.checked !== undefined;
}
