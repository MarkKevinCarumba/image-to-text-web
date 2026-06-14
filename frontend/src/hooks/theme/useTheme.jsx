import { useEffect, useState, useCallback, useLayoutEffect } from "react";

const STORAGE_KEY = "theme";

const getSystemTheme = () => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const resolveTheme = (theme) => (theme === "system" ? getSystemTheme() : theme);

export const useTheme = () => {
  // Lazy initialization to read from localStorage only once on mount
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) || "system";
    }
    return "system";
  });

  // Apply theme to DOM
  const applyTheme = useCallback((themeValue) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", resolveTheme(themeValue));
  }, []);

  // Sync theme changes to both DOM and localStorage automatically
  useLayoutEffect(() => {
    applyTheme(theme);
    if (theme === "system") {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme, applyTheme]);

  // Listen to system theme changes (only if system mode)
  useLayoutEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");

    media.addEventListener("change", handler);

    return () => media.removeEventListener("change", handler);
  }, [theme, applyTheme]);

  return {
    theme,
    setTheme: (value) => setTheme(value),
  };
};
