import React, { useState } from "react";
import { Lock, LogIn, Mail, WalletCards } from "lucide-react";

export function LoginPage({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ error: "", isLoading: false });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ error: "", isLoading: true });

    try {
      await onLogin(credentials);
    } catch (error) {
      setStatus({ error: error.message, isLoading: false });
    }
  };

  const updateField = (field) => (event) => {
    setCredentials((currentCredentials) => ({
      ...currentCredentials,
      [field]: event.target.value,
    }));
  };

  return (
    <main className="login-page">
      <section className="login-shell" aria-label="Login">
        <div className="login-panel">
          <div className="login-brand">
            <div className="brand-mark">
              <WalletCards size={24} />
            </div>
            <div>
              <strong>Expense Tracker</strong>
              <span>Personal finance</span>
            </div>
          </div>

          <div className="login-heading">
            <p className="eyebrow">Welcome back</p>
            <h1>Log in</h1>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              <span>Email</span>
              <div className="input-wrap">
                <Mail size={18} />
                <input
                  autoComplete="email"
                  disabled={status.isLoading}
                  onChange={updateField("email")}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={credentials.email}
                />
              </div>
            </label>

            <label>
              <span>Password</span>
              <div className="input-wrap">
                <Lock size={18} />
                <input
                  autoComplete="current-password"
                  disabled={status.isLoading}
                  onChange={updateField("password")}
                  placeholder="Enter password"
                  required
                  type="password"
                  value={credentials.password}
                />
              </div>
            </label>

            {status.error && <p className="inline-message error-message">{status.error}</p>}

            <button className="submit-button login-button" disabled={status.isLoading} type="submit">
              <LogIn size={18} />
              <span>{status.isLoading ? "Logging in..." : "Log in"}</span>
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
