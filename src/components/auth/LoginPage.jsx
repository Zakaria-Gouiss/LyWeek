import { useState } from "react";

import lyLight from "../../assets/lyweek-light.jpg";

function LoginPage({ onLogin, loading, error, onSwitchToRegister }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
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
    onLogin(form);
  }

  return (
    <section className="login-shell">
      <div className="login-card">
        <div className="login-branding">
          <img src={lyLight} alt="LyWeek logo" className="login-logo" />
        </div>

        <div className="login-copy">
          <p className="login-kicker">LyWeek</p>
          <h1>Welcome back</h1>
          <p className="login-subtitle">Sign in to view your week planner.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
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
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <button
            type="button"
            className="auth-toggle-link"
            onClick={onSwitchToRegister}
            disabled={loading}
          >
            Need an account? Register
          </button>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;
