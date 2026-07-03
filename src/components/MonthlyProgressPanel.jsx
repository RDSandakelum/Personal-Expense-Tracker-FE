import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "../utils/format";

export function MonthlyProgressPanel({ monthlyTrend }) {
  return (
    <article className="panel wide-panel">
      <div className="panel-heading compact">
        <div>
          <p className="eyebrow">Savings</p>
          <h2>Monthly progress</h2>
        </div>
      </div>
      <div className="chart-frame small-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="savings" fill="#16a34a" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}