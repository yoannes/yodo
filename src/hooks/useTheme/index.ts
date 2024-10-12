import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useMemo } from "react";

let mounted = false;

export function useTheme() {
  const { theme, setTheme } = useNextTheme();

  useEffect(() => {
    if (mounted) return;
    mounted = true;
    if (!theme) {
      setTheme("light");
    }
  }, []);

  return useMemo(() => {
    return {
      theme,
      setTheme,
    };
  }, [setTheme, theme]);
}
