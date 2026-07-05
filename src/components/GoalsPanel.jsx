import React, { useState } from "react";
import { Play } from "lucide-react";
import { formatCurrency } from "../utils/format";

export function GoalsPanel({ goals= [], status }) {
  // Track user typing input per goal
  const [monthlyInputs, setMonthlyInputs] = useState({});
  // Track the actual evaluated completion date strings per goal
  const [calculatedDates, setCalculatedDates] = useState({});

  const handleInputChange = (goalId, value) => {
    setMonthlyInputs((prev) => ({
      ...prev,
      [goalId]: value,
    }));
  };

  const handleCalculate = (e, goalId, saved, target) => {
    // Prevent form submission reloads if wrapped inside a form template layout
    e.preventDefault();
    
    const userInput = monthlyInputs[goalId];
    const monthlyContribution = parseFloat(userInput);

    if (!monthlyContribution || monthlyContribution <= 0) {
      setCalculatedDates((prev) => ({ ...prev, [goalId]: "—" }));
      return;
    }

    const remaining = target - saved;
    if (remaining <= 0) {
      setCalculatedDates((prev) => ({ ...prev, [goalId]: "Completed" }));
      return;
    }

    const monthsRequired = Math.ceil(remaining / monthlyContribution);
    const completionDate = new Date();
    
    // Projections start counting forward from next month onwards
    completionDate.setMonth(completionDate.getMonth() + monthsRequired);

    const year = completionDate.getFullYear();
    const monthName = completionDate.toLocaleString("default", { month: "long" });
    
    setCalculatedDates((prev) => ({
      ...prev,
      [goalId]: `${year} ${monthName}`,
    }));
  };

  return (
    <article className="panel goals-panel">
      {/* Kept your structural heading alignment block intact */}
      <div className="panel-heading compact" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p className="eyebrow">Goals</p>
          <h2>Savings progress</h2>
        </div>

        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", paddingBottom: "4px" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.7, width: "185px", textAlign: "left" }}>
            Monthly Plan
          </span>
          <span style={{ fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.7, width: "130px", textAlign: "left" }}>
            Est. Completion
          </span>
        </div>
      </div>

      {status?.error && <p className="inline-message error-message">{status.error}</p>}
      {status?.isLoading && <p className="inline-message">Loading goals...</p>}

      {!status?.isLoading && goals.length === 0 && (
        <p className="empty-state">No goals found.</p>
      )}

      <div className="goals-list">
  {goals.map((goal) => {
    const currentSaved = goal.saved ?? goal.current ?? 0;
    const targetAmount = goal.target_amount ?? 1;
    const progress = Math.min(Math.round((currentSaved / targetAmount) * 100), 100);
    
    const currentInput = monthlyInputs[goal.id] || "";
    const computedResult = calculatedDates[goal.id] || "—";

    return (
      <div className="goal-item" key={goal.id ?? goal.name} style={{ marginBottom: "1.5rem" }}>
        
        {/* CHANGED: Swapped gap to 0.75rem and allowed a cleaner wrap break */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          
          {/* Left side: Goal Text information */}
          {/* CHANGED: Removed minWidth restriction so it scales down natively */}
          <div className="goal-header" style={{ flex: "1 1 auto" }}>
            <div>
              <strong>{goal.name}</strong>
              <span style={{ marginLeft: "8px", display: "inline-block" }}>{progress}% funded</span>
            </div>
          </div>

          {/* Right side alignment column */}
          {/* CHANGED: Added flexWrap: "wrap" so the date drops nicely below the input on narrow screens */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", minWidth: "200px" }}>
            
            <form 
              className="transaction-form" 
              onSubmit={(e) => handleCalculate(e, goal.id, currentSaved, targetAmount)}
              style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0, padding: 0 }}
            >
              {/* CHANGED: Reduced from 120px to 90px to prevent spilling out on mobile */}
              <div style={{ width: "90px" }}>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0.00"
                  value={currentInput}
                  onChange={(e) => handleInputChange(goal.id, e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              
              <button 
                className="submit-button" 
                disabled={!currentInput} 
                type="submit"
                title="Calculate Target Date"
              >
                <Play size={14} fill={currentInput ? "currentColor" : "none"} />
              </button>
            </form>

            {/* Calculated Completion Month Indicator */}
            {/* CHANGED: Set to auto width with a small min-width so text doesn't overflow container borders */}
            <div style={{ minWidth: "100px", width: "auto", fontWeight: computedResult !== "—" ? "600" : "400", fontSize: "0.95rem" }}>
              {computedResult}
            </div>
          </div>

        </div>

        {/* Native UI Progress bar */}
        <div className="progress-track" aria-label={`${goal.name} ${progress}% funded`} style={{ marginTop: "8px" }}>
          <span style={{ width: `${progress}%` }} />
        </div>

        <small style={{ display: "block", marginTop: "4px" }}>
          {formatCurrency(currentSaved)} of {formatCurrency(targetAmount)}
        </small>
      </div>
    );
  })}
</div>
    </article>
  );
}