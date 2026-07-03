import React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarDays } from "lucide-react";
import { formatCurrency } from "../utils/format";

export function CashFlowPanel({ monthlyTrend }) {
  return (
    <article className="panel trend-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Cash flow</p>
          <h2>Income vs expenses</h2>
        </div>
        <button className="ghost-button" type="button">
          <CalendarDays size={16} />
          <span>6 months</span>
        </button>
      </div>
      <div className="chart-frame">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyTrend}>
            <defs>
              <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#db2777" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#db2777" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Area type="monotone" dataKey="income" stroke="#2563eb" fill="url(#income)" strokeWidth={3} />
            <Area type="monotone" dataKey="expenses" stroke="#db2777" fill="url(#expenses)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}