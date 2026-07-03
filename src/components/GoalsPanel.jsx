import React, { useState } from "react";
import { Plus } from "lucide-react";
import { formatCurrency } from "../utils/format";
import { addFundsToGoal } from "../goalsApi";

export function GoalsPanel({ goals, accounts, onGoalUpdate, status }) {
  const [addingFundsTo, setAddingFundsTo] = useState(null);
  const [fundForm, setFundForm] = useState({
    goalId: null,
    accountId: "",
    amount: "",
  });
  const [fundStatus, setFundStatus] = useState({ loading: false, error: "" });

  const handleAddFundsClick = (goalId) => {
    setAddingFundsTo(goalId);
    setFundForm({
      goalId,
      accountId: accounts?.[0]?.id ?? "",
      amount: "",
    });
    setFundStatus({ loading: false, error: "" });
  };

  const handleCloseFundForm = () => {
    setAddingFundsTo(null);
    setFundForm({ goalId: null, accountId: "", amount: "" });
  };

  const handleAddFunds = async (event) => {
    event.preventDefault();
    const amount = Number(fundForm.amount);

    if (!amount || amount <= 0 || !fundForm.accountId) {
      setFundStatus({ loading: false, error: "Please enter a valid amount and select an account" });
      return;
    }

    setFundStatus({ loading: true, error: "" });

    try {
      await addFundsToGoal(fundForm.goalId, amount, fundForm.accountId);
      handleCloseFundForm();
      if (onGoalUpdate) {
        onGoalUpdate();
      }
      setFundStatus({ loading: false, error: "" });
    } catch (error) {
      setFundStatus({ loading: false, error: error.message });
    }
  };

  return (
    <article className="panel goals-panel">
      <div className="panel-heading compact">
        <div>
          <p className="eyebrow">Goals</p>
          <h2>Savings progress</h2>
        </div>
      </div>

      {status?.error && <p className="inline-message error-message">{status.error}</p>}
      {status?.isLoading && <p className="inline-message">Loading goals...</p>}

      {!status?.isLoading && goals.length === 0 && (
        <p className="empty-state">No goals found.</p>
      )}

      <div className="goals-list">
        {goals.map((goal) => {
          const progress = Math.round(((goal.saved ?? goal.current ?? 0) / (goal.target ?? 1)) * 100);
          const isBeingEdited = addingFundsTo === goal.id;

          return (
            <div className="goal-item" key={goal.id ?? goal.name}>
              {isBeingEdited ? (
                <div className="goal-form">
                  <label>
                    <span>Account</span>
                    <select
                      value={fundForm.accountId}
                      onChange={(e) => setFundForm({ ...fundForm, accountId: e.target.value })}
                      disabled={fundStatus.loading}
                    >
                      <option value="">Select account</option>
                      {(accounts ?? []).map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Amount</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={fundForm.amount}
                      onChange={(e) => setFundForm({ ...fundForm, amount: e.target.value })}
                      disabled={fundStatus.loading}
                    />
                  </label>

                  {fundStatus.error && <p className="error-message small">{fundStatus.error}</p>}

                  <div className="form-actions">
                    <button
                      type="button"
                      className="submit-button small"
                      onClick={handleAddFunds}
                      disabled={fundStatus.loading}
                    >
                      {fundStatus.loading ? "Adding..." : "Add"}
                    </button>
                    <button
                      type="button"
                      className="ghost-button small"
                      onClick={handleCloseFundForm}
                      disabled={fundStatus.loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="goal-header">
                    <div>
                      <strong>{goal.name}</strong>
                      <span>{progress}% funded</span>
                    </div>
                    <button
                      type="button"
                      className="add-funds-btn"
                      onClick={() => handleAddFundsClick(goal.id)}
                      title="Add funds to this goal"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="progress-track" aria-label={`${goal.name} ${progress}% funded`}>
                    <span style={{ width: `${progress}%` }} />
                  </div>
                  <small>
                    {formatCurrency(goal.saved ?? goal.current ?? 0)} of {formatCurrency(goal.target ?? 0)}
                  </small>
                </>
              )}
            </div>
          );
        })}
      </div>
    </article>
  );
}