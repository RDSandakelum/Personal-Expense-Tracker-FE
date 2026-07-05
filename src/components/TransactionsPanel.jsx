import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency } from "../utils/format";
import { fetchTransactionsByMonth } from "../accountsApi";
import { normalizeTransaction } from "../transactionsApi";

export function TransactionsPanel({ compact = false, status, transactions: initialTransactions, onMonthChange }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactions, setTransactions] = useState(initialTransactions ?? []);
  const [loading, setLoading] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  // Load transactions for selected month if not compact
  useEffect(() => {
    if (compact) return;

    const loadTransactions = async () => {
      setLoading(true);
      try {
        const data = await fetchTransactionsByMonth(year, month);
        const normalized = (data.transactions ?? data).map(normalizeTransaction);
        setTransactions(normalized);
        if (onMonthChange) {
          onMonthChange(year, month, normalized);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [year, month, compact, onMonthChange]);

  // Use initial transactions in compact mode
  useEffect(() => {
    if (compact && initialTransactions) {
      setTransactions(initialTransactions);
    }
  }, [compact, initialTransactions]);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });

  return (
    <article className={compact ? "panel transactions-panel" : "panel wide-panel transactions-panel-full"}>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Recent</p>
          <h2>Transactions</h2>
        </div>
        {!compact && (
          <div className="month-selector">
            <button onClick={handlePreviousMonth} className="ghost-button" type="button">
              <ChevronLeft size={18} />
            </button>
            <span className="current-month">{monthName}</span>
            <button onClick={handleNextMonth} className="ghost-button" type="button">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
        {compact && <button className="ghost-button" type="button">View all</button>}
      </div>

      {status?.error && <p className="inline-message error-message">{status.error}</p>}
      {(status?.isLoading || loading) && <p className="inline-message">Loading transactions...</p>}

      <div className="transaction-list">
        {!(status?.isLoading || loading) && transactions.length === 0 && (
          <p className="empty-state">No transactions found{!compact && " for this month"}. Add one from the Transactions page.</p>
        )}

        {transactions.map((transaction) => (
          <div className="transaction-row" key={transaction.id ?? `${transaction.merchant}-${transaction.date}`}>
            <div>
              <strong>{transaction.merchant}</strong>
              <span>
                {transaction.category}
                {transaction.subCategory ? ` / ${transaction.subCategory}` : ""} - {transaction.date}
              </span>
            </div>
            <span className="status">{transaction.type ?? (transaction.amount > 0 ? "CREDIT" : "DEBIT")}</span>
            <strong className={transaction.type === "CREDIT" ?"amount positive" : "amount negative"}>
              {transaction.type === "CREDIT" ? "+" : "-"}
              {formatCurrency(Math.abs(transaction.amount))}
            </strong>
          </div>
        ))}
      </div>
    </article>
  );
}