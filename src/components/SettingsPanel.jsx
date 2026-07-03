import React from "react";
import { Moon, Sun } from "lucide-react";

export function SettingsPanel({ darkMode, settings, setDarkMode }) {
  const { accounts = [], currency = "", defaultPeriod = "" } = settings ?? {};

  return (
    <section className="settings-grid">
      <article className="panel settings-panel">
        <div className="panel-heading compact">
          <div>
            <p className="eyebrow">Display</p>
            <h2>Theme</h2>
          </div>
        </div>
        <button className="setting-row" type="button" onClick={() => setDarkMode((value) => !value)}>
          <span>{darkMode ? "Dark mode is on" : "Dark mode is off"}</span>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="setting-row static-row">
          <span>Currency</span>
          <strong>{currency || "Not set"}</strong>
        </div>
        <div className="setting-row static-row">
          <span>Default period</span>
          <strong>{defaultPeriod || "Not set"}</strong>
        </div>
      </article>

      <article className="panel settings-panel">
        <div className="panel-heading compact">
          <div>
            <p className="eyebrow">Accounts</p>
            <h2>Connected cards</h2>
          </div>
        </div>
        {accounts.length === 0 && <p className="empty-state">No connected accounts found.</p>}
        {accounts.map((account) => (
          <div className="setting-row static-row" key={account.id ?? account.name}>
            <span>{account.name}</span>
            <strong>{account.balanceLabel ?? account.balance}</strong>
          </div>
        ))}
      </article>
    </section>
  );
}
