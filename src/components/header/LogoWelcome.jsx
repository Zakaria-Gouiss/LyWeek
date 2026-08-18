import lyLight from "../../assets/lyweek-light.jpg";
import lyDark from "../../assets/lyweek-dark.jpg";

function LogoWelcome({ userName, darkMode, setDarkMode, onLogout }) {
  return (
    <>
      <section className="logo-and-welcome">
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
        <h2 className="welcome">Welcome back, {userName}</h2>
        <button type="button" className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </section>
    </>
  );
}

export default LogoWelcome;
