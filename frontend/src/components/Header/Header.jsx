import { useState, useEffect } from "react";
// import { useThemeContext } from "contexts/theme/themeProvider";
import { useThemeContext } from "contexts/theme/themeProvider";
import { Cpu, Compass, Sun, Terminal, Moon } from "lucide-react";
import { ScanSquare } from "lucide-react";
import "./Header.scss";

const Header = ({ newScan }) => {
  const [scrolled, setScrolled] = useState(false);
  const { setTheme, theme } = useThemeContext();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  console.log("scrolled: ", scrolled);

  return (
    <header
      className={`header ${scrolled ? "header--scroll" : ""}`}
      id="app-header"
    >
      <div className="header-container container">
        <div className="header-container__logo-section">
          {/* <div className="header-container__header-logo" aria-hidden="true">
            <Cpu className="header-container__logo-icon" />
          </div> */}
          <div className="header-container__header-brand">
            <h1 className="header-container__header-title">
              <span className="header-container__pix">Pix</span>
              <span className="header-container__scan">Scan</span>
            </h1>
          </div>
        </div>
        <nav
          className="header-container__nav-section"
          area-label="Main Navigation"
        >
          <a href="#uploader-box" className="header-container__nav-link">
            <Compass size={16} />
            <span>Workspace</span>
          </a>

          <button
            type="button"
            onClick={newScan}
            className="header-container__nav-link"
          >
            <ScanSquare size={16} />
            <span>New Scan</span>
          </button>
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
