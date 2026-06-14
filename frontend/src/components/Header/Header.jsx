import React from "react";
// import { useThemeContext } from "contexts/theme/themeProvider";
import { useThemeContext } from "contexts/theme/themeProvider";
import { Cpu, Compass, Sun, Terminal, Moon } from "lucide-react";
import "./Header.scss";

const Header = () => {
  const { setTheme, theme } = useThemeContext();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <header className="header" id="app-header">
      <div className="header-container container">
        <div className="header-container__logo-section">
          <div className="header-container__header-logo" aria-hidden="true">
            <Cpu className="header-container__logo-icon" />
          </div>
          <div className="header-container__header-brand">
            <h1 className="header-container__header-title">Image-To-Text</h1>
          </div>
        </div>
        <nav
          className="header-container__nav-section"
          area-label="Main Navigation"
        >
          <a href="#uploader-box" className="header-container__nav-link active">
            <Compass size={16} />
            <span>Workspace</span>
          </a>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer" // use when using target="_blank" for security purposes
            className="header-container__nav-link"
          >
            <Terminal size={16} />
            <span>Developer API</span>
          </a>
          <button
            type="button"
            className="header-container__toggle-btn"
            onClick={toggleTheme}
          >
            {isDark ? (
              <Sun
                size={17}
                className="header-container__theme-icon sun header-container__animate-pop"
              />
            ) : (
              <Moon
                size={17}
                className="header-container__theme-icon moon header-container__animate-pop"
              />
            )}

            <span className="header-container__toggle-label">
              {isDark ? "Light" : "Dark"}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
