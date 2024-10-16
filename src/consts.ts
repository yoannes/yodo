import { IconType } from "@components";

export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const MONTH = DAY * 30;

export const MOBILE_BREAKPOINT = 768;

export const Collections = {
  Users: "Users",
  Tasks: "Tasks",
} as const;

export const menuItems: { icon: IconType; value: string }[] = [
  { icon: "list", value: "list" },
  { icon: "activity", value: "reports" },
];

// Texts
export const textBrandEmphasis = "text-tremor-brand-emphasis dark:text-dark-tremor-brand-emphasis";
export const textContentEmphasis =
  "text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis";
export const textContent = "text-tremor-content dark:text-dark-tremor-content";
export const textContentSubtle = "text-tremor-content-subtle dark:text-dark-tremor-content-subtle";
export const textContentStrong = "text-tremor-content-strong dark:text-dark-tremor-content-strong";

// Borders
export const borderColor = "border-tremor-border dark:border-dark-tremor-border";

// Backgrounds
export const bgColor = "bg-tremor-background dark:bg-dark-tremor-background";
export const bgSubtle = "bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle";
export const bgBrandSubtle = "bg-tremor-brand-subtle dark:bg-dark-tremor-brand-subtle";
export const bgBrandFaint = "bg-tremor-brand-faint dark:bg-dark-tremor-brand-faint";
export const bgBrandMuted = "bg-tremor-brand-muted dark:bg-dark-tremor-brand-muted";
export const bgGreenColor = "bg-green";
export const bgRedColor = "bg-red";

export const greenColor = "emerald-500";
export const redColor = "rose-700";
export const hoverBgMuted =
  "hover:bg-tremor-background-muted hover:dark:bg-dark-tremor-background-muted";

export const focusInput = [
  // base
  "focus:ring-2",
  // ring color
  "focus:ring-blue-200 focus:dark:ring-blue-700/30",
  // border color
  "focus:border-cyan-600 focus:dark:border-cyan-600",
];

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-blue-500 dark:outline-blue-500",
];

export const hasErrorInput = [
  // base
  "ring-2",
  // border color
  "border-red-500 dark:border-red-700",
  // ring color
  "ring-red-200 dark:ring-red-700/30",
];
