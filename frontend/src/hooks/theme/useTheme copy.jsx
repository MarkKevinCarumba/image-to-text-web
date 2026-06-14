import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

const getSystemTheme = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme:dark)").matches
    ? "dark"
    : "light";

const resolveTheme = (theme) => (theme === "system" ? getSystemTheme() : theme);

export const useTheme = () => {
  const [theme, setTheme] = useState("system");

  // Apply theme to DOM
  const applyTheme = (themeValue) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", resolveTheme(themeValue));
  };

  // Init (runs once)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) || "system";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  // Listen to system theme changes (only if system mode)
  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme:dark)");

    const handler = () => applyTheme("system");

    media.addEventListener("change", handler); // runs even after useEffect finished, Call this function every time system theme changes.

    return () => media.removeEventListener("change", handler);
  }, [theme]);

  return {
    theme,
    setLight: () => setTheme("light"),
    setDark: () => setTheme("dark"),
  };
};
