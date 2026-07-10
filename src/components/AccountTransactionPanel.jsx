import React, { useEffect, useState } from "react";
import { formatCurrency } from "../utils/format";
import { fetchAccountTransfers } from "../accountsApi";

export function AccountTransactionPanel() {
  const [loading, setLoading] = useState(false);
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    const loadTransfers = async () => {
      setLoading(true);

      try {
        const data = await fetchAccountTransfers();
        setTransfers(data.transfers ?? data);
      } finally {
        setLoading(false);
      }
    };

    loadTransfers();
  }, []);

  return (
    <article className="panel wide-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">History</p>
          <h2>Transfer History</h2>
        </div>
      </div>

      {loading && (
        <p className="inline-message">Loading transfers...</p>
      )}

      {!loading && transfers.length === 0 && (
        <p className="empty-state">
          No transfer history found.
        </p>
      )}

      <div className="transaction-list">
        {transfers.map((transfer, index) => {
          // Account to Account Transfer
          if (transfer.type === "ACCOUNT") {
            return (
              <div className="transaction-row" key={index}>
                <div>
                  <strong>
                    {transfer.from_account_name} → {transfer.to_account_name}
                  </strong>
                  <span>{transfer.date}</span>
                </div>

                <span className="status">Account Transfer</span>

                <strong className="amount">
                  {formatCurrency(transfer.amount)}
                </strong>
              </div>
            );
          }

          // Savings Transfer
          const saved = transfer.direction === "Saved";

          return (
            <div className="transaction-row" key={index}>
              <div>
                <strong>{transfer.goal_name}</strong>
                <span>
                  {transfer.account_name} • {transfer.date}
                </span>
              </div>

              <span className={`status ${saved ? "positive" : "negative"}`}>
                {transfer.direction}
              </span>

              <strong className={`amount ${saved ? "positive" : "negative"}`}>
                {saved ? "+" : "-"}
                {formatCurrency(transfer.amount)}
              </strong>
            </div>
          );
        })}
      </div>
    </article>
  );
}