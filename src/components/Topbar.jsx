import React from "react";
import { Bell, LogOut, Moon, Search, Sun } from "lucide-react";

export function Topbar({ currentPage, darkMode, onLogout, setDarkMode }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{currentPage.eyebrow}</p>
        <h1>{currentPage.title}</h1>
      </div>

      <div className="topbar-actions">
        <label className="search" aria-label="Search transactions">
          <Search size={17} />
          <input placeholder="Search" />
        </label>
        <button className="icon-button" aria-label="Notifications" type="button">
          <Bell size={18} />
        </button>
        <button className="icon-button" aria-label="Log out" onClick={onLogout} type="button">
          <LogOut size={18} />
        </button>
        <button
          className="theme-toggle"
          type="button"
          aria-label="Toggle dark mode"
          onClick={() => setDarkMode((value) => !value)}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span>{darkMode ? "Light" : "Dark"}</span>
        </button>
      </div>
    </header>
  );
}
