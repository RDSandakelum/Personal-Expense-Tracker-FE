import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { fetchCategories } from "../categoriesApi";
import { getOrDefault } from "../apiClient";
import { fetchAccounts } from "../accountsApi";

export function AccountTransferPanel({goals, onTransfer }) {
    const [form, setForm] = useState({
        type: "Sp2Sv",
        amount: "",
        note: "",
        goal: "",
        date: new Date().toISOString().slice(0, 10),
      });

    const [goalFieldActive, setGoalFieldActive] = useState(true);

    const updateForm = (field, value) => {
        setForm((current) => {
        const updated = { ...current, [field]: value };
        if (field === "type") {
           if (updated.type === "Sv2Sp" || updated.type === "Sp2Sv") {
                setGoalFieldActive(true);
           }else {
                setGoalFieldActive(false);
           }
        }
        return updated;
    });
  };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const numericAmount = Number(form.amount);

  // 1. Double check validation
        if (!numericAmount || numericAmount <= 0 ) {
            console.warn("Frontend validation failed. Something is blank.");
            return;
        }

  // 2. Build the exact payload object matching your Go Struct tags
        const payload = {
            type: form.type,
            goal: form.goal ? form.goal : null,
            amount: numericAmount,
            note: form.note,
            date: `${form.date}T00:00:00Z`, // Formats cleanly into Go's time.Time
        };

        console.log("Passing this clean payload to handler:", payload);

        // 3. CRITICAL: Pass the 'payload' variable directly into onTransfer!
        const wasSaved = await onTransfer(payload);

        if (wasSaved) {
            setForm((current) => ({
            ...current,
            amount: "",
            note: "",
            date: new Date().toISOString().slice(0, 10),
            }));
        }
    };
return (
    <article className="panel transaction-form-panel">
      <div className="panel-heading compact">
        <div>
          <p className="eyebrow">Create</p>
          <h2>Transfers</h2>
        </div>
      </div>

      {(
        <form className="transaction-form" onSubmit={handleSubmit}>
          <label>
            <span>Type</span>
            <select value={form.type} onChange={(event) => updateForm("type", event.target.value)}>
              <option value="Sp2Sv">Spendings to Savings</option>
              <option value="Sv2Sp">Savings to Spendings</option>
              <option value="C2T">Capital to Tax</option>
              <option value="T2C">Tax to Capital</option>
            </select>
          </label>

         {goalFieldActive && (
            <label>
              <span>Goal</span>
              <select value={form.goal} onChange={(event) => updateForm("goal", event.target.value)}>
                <option value="">Select Goal</option>
                {goals.map((goal)=> (
                  <option key={goal.id} value={goal.id}>
                    {goal.name}
                </option>
              ))}
            </select>
          </label>)}

          <label>
            <span>Amount</span>
            <input
              min="0"
              placeholder="0.00"
              step="0.01"
              type="number"
              value={form.amount}
              onChange={(event) => updateForm("amount", event.target.value)}
            />
          </label>

          <label>
            <span>Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(event) => updateForm("date", event.target.value)}
            />
          </label>

          <label>
            <span>Note</span>
            <input
              type="text"
              placeholder="Add a note..."
              value={form.note}
              onChange={(event) => updateForm("note", event.target.value)}
            />
          </label>

          <button className="submit-button" type="submit">
            <Plus size={17} />
            <span>Transfer</span>
          </button>
        </form>
      )}
    </article>
  );
}