import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { formatCurrency } from "../utils/format";

export function BudgetPanel({ budgets, totalSpent, totalBudget, large = false }) {
  return (
    <article className={large ? "panel budget-panel wide-panel" : "panel budget-panel"}>
      <div className="panel-heading compact">
        <div>
          <p className="eyebrow">Budgets</p>
          <h2>Monthly limits</h2>
        </div>
      </div>
      <div className="budget-total">
        <strong>{formatCurrency(totalSpent)}</strong>
        <span>of {formatCurrency(totalBudget)} planned</span>
      </div>
      <ResponsiveContainer width="100%" height={large ? 260 : 170}>
        <BarChart data={budgets} layout="vertical" margin={{ top: 4, right: 8, bottom: 4, left: 16 }}>
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={74} />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Bar dataKey="limit" fill="var(--track)" radius={[8, 8, 8, 8]} barSize={12} />
          <Bar dataKey="spent" fill="#16a34a" radius={[8, 8, 8, 8]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </article>
  );
}