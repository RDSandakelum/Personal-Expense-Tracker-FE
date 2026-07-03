import React from "react";
import { CreditCard, TrendingUp } from "lucide-react";
import { formatCurrency } from "../utils/format";

export function AccountsPanel({ accounts }) {
  return (
    <article className="panel accounts-panel wide-panel">
      <div className="panel-heading compact">
        <div>
          <p className="eyebrow">Finance</p>
          <h2>Accounts & Balances</h2>
        </div>
      </div>

      {accounts.length === 0 && (
        <p className="empty-state">No accounts found.</p>
      )}

      <div className="accounts-grid">
        {accounts.map((account) => (
          <div className="account-card" key={account.id}>
            <div className="account-header">
              <div className="account-info">
                <strong>{account.name}</strong>
                <span className="account-type">{account.type}</span>
              </div>
              <CreditCard size={20} className="account-icon" />
            </div>

            <div className="balances-section">
              <div className="balance-item">
                <span className="balance-label">Spendable</span>
                <strong className="balance-amount positive">
                  {formatCurrency(account.spendable_balance ?? 0)}
                </strong>
              </div>

              {account.savings_balance !== undefined && (
                <div className="balance-item">
                  <span className="balance-label">Savings</span>
                  <strong className="balance-amount savings">
                    {formatCurrency(account.savings_balance ?? 0)}
                  </strong>
                </div>
              )}
            </div>

            {account.totalBalance !== undefined && (
              <div className="account-total">
                <span>Total Balance</span>
                <strong>
                  {formatCurrency(account.totalBalance)}
                </strong>
              </div>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
