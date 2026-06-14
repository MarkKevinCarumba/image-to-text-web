import { createContext, useContext } from "react";
// import { useTheme } from "hooks/theme/useTheme";
import { useTheme } from "hooks/theme/useTheme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const themeState = useTheme();

  console.log("themeState");

  return (
    <ThemeContext.Provider value={themeState}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
