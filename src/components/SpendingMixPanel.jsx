import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "../utils/format";

export function SpendingMixPanel({ categoryBreakdown }) {
  return (
    <article className="panel">
      <div className="panel-heading compact">
        <div>
          <p className="eyebrow">Categories</p>
          <h2>Spending mix</h2>
        </div>
      </div>
      <div className="donut-wrap">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={58} outerRadius={86} paddingAngle={3}>
              {categoryBreakdown.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
        <div className="legend-list">
          {categoryBreakdown.map((category) => (
            <div className="legend-row" key={category.name}>
              <span style={{ backgroundColor: category.color }} />
              <p>{category.name}</p>
              <strong>{formatCurrency(category.value)}</strong>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}