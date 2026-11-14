import "./header.css";

function ThemeToggle({ darkMode, setDarkMode }) {
  const label = darkMode ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setDarkMode((previousMode) => !previousMode)}
      aria-label={label}
      title={label}
    >
      {darkMode ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
          <path d="M20.9 13.1A8.5 8.5 0 0 1 10.9 3.1 8.8 8.8 0 1 0 20.9 13.1Z" />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;
