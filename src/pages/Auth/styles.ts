import { textContent } from "@consts";
import { cx } from "@utils";

export const classes = {
  root: cx("Auth", "w-screen", "h-screen"),
  body: cx("flex h-full"),
  title: cx("text-4xl-bold", "text-center", textContent),
  bodyLeft: cx("relative", "flex-center", "w-1/2", "bg-tremor-background-muted"),
  formContainer: cx("flex", "flex-col", "gap-8", "w-[80%]", "max-w-[424px]"),
  sso: cx("flex", "items-center", "gap-2", "py-[6px]"),
  footer: cx("text-zinc-400", "text", "flex", "items-center", "gap"),
  error: cx("text-red-500"),
};
