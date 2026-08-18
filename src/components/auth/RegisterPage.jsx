import { useState } from "react";

import lyLight from "../../assets/lyweek-light.jpg";
import lyDark from "../../assets/lyweek-dark.jpg";

function RegisterPage({
  onRegister,
  loading,
  error,
  onSwitchToLogin,
  darkMode,
  setDarkMode,
}) {
  const [semesterName, setSemesterName] = useState("");
  const [semesterStartDate, setSemesterStartDate] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      return;
    }

    onRegister({
      name: form.name,
      email: form.email,
      password: form.password,
      semesterName,
      semesterStartDate,
    });
  }

  return (
    <section className="login-shell">
      <div className="login-card">
        <div className="login-branding">
          <button
            type="button"
            className="login-logo-button"
            onClick={() => setDarkMode((previousMode) => !previousMode)}
            aria-label="Toggle dark mode"
          >
            <img
              src={darkMode ? lyDark : lyLight}
              alt="LyWeek logo"
              className="login-logo"
            />
          </button>
        </div>

        <div className="login-copy">
          <p className="login-kicker">LyWeek</p>
          <h1>Create account</h1>
          <p className="login-subtitle">
            Register to start planning your semester!
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="register-name">Name</label>
            <input
              id="register-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your first name"
              autoComplete="name"
              required
            />
          </div>
          <div className="form-row form-row-two">
            <div className="form-group">
              <label htmlFor="semester-name">Semester Name</label>
              <select
                id="semester-name"
                value={semesterName}
                onChange={(e) => setSemesterName(e.target.value)}
                required
              >
                <option value="">Select a semester</option>
                <option value="Fall">Fall</option>
                <option value="Winter">Winter</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="semester-start-date">Semester Start Date</label>
              <input
                id="semester-start-date"
                type="date"
                value={semesterStartDate}
                onChange={(e) => setSemesterStartDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Choose a password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-confirm-password">Confirm password</label>
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          {form.password &&
            form.confirmPassword &&
            form.password !== form.confirmPassword && (
              <p className="login-error">Passwords do not match.</p>
            )}

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>

          <button
            type="button"
            className="auth-toggle-link"
            onClick={onSwitchToLogin}
            disabled={loading}
          >
            Already have an account? Sign in
          </button>
        </form>
      </div>
    </section>
  );
}

export default RegisterPage;
