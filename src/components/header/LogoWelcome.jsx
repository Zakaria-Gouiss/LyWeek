import "./header.css";
import lyLight from "../../assets/lyweek-light.jpg";
import lyDark from "../../assets/lyweek-dark.jpg";
import SettingsButton from "./SettingsButton.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

function LogoWelcome({
  userName,
  darkMode,
  setDarkMode,
  onOpenSettings,
  logoClickable = true,
  showSettingsButton = true,
  showThemeButton = true,
}) {
  return (
    <section className="logo-and-welcome">
      {logoClickable ? (
        <button
          type="button"
          className="logo-button"
          onClick={() => setDarkMode((prev) => !prev)}
          aria-label="Toggle dark mode"
        >
          <img
            className="logo"
            src={darkMode ? lyDark : lyLight}
            alt="LyWeek logo"
          />
        </button>
      ) : (
        <span className="logo-static">
          <img
            className="logo"
            src={darkMode ? lyDark : lyLight}
            alt="LyWeek logo"
          />
        </span>
      )}
      <h2 className="welcome">Welcome back, {userName}</h2>
      {(showThemeButton || (showSettingsButton && onOpenSettings)) && (
        <div className="header-controls">
          {showThemeButton && (
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          )}
          {showSettingsButton && onOpenSettings && (
            <SettingsButton onClick={onOpenSettings} />
          )}
        </div>
      )}
    </section>
  );
}

export default LogoWelcome;
