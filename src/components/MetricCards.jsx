import React from "react";

export function MetricCards({ summaryCards }) {
  return (
    <section className="summary-grid" aria-label="Summary metrics">
      {summaryCards.map((card) => (
        <article className="metric-card" key={card.label}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
          <small className={card.tone}>{card.delta}</small>
        </article>
      ))}
    </section>
  );
}