import React from "react";
import { WalletCards } from "lucide-react";

export function Sidebar({ activePage, setActivePage, navItems }) {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brand">
        <div className="brand-mark">
          <WalletCards size={24} />
        </div>
        <div>
          <strong>Expense Tracker</strong>
          <span>Personal finance</span>
        </div>
      </div>

      <nav className="nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              className={activePage === item.id ? "nav-item active" : "nav-item"}
              key={item.id}
              onClick={() => setActivePage(item.id)}
              type="button"
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}