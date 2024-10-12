import { type ClassValue } from "clsx";

export function cx(...args: ClassValue[]) {
  return args.filter(String).join(" ");
}
