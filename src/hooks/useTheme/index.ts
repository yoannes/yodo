import { useTheme as useNextTheme } from "next-themes";
import { useMemo } from "react";

export function useTheme() {
  const { theme, setTheme, systemTheme } = useNextTheme();

  return useMemo(() => {
    return {
      theme,
      setTheme,
      systemTheme,
    };
  }, [setTheme, theme]);
}
