import React from "react";

export function MetricCards({ summaryCards }) {
  return (
    <section 
      className="summary-grid" 
      aria-label="Summary metrics"
      // ✅ Center-aligns the grid content items or flex items within the viewport structure
      style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1rem" }}
    >
      {summaryCards.map((card) => (
        <article 
          className="metric-card" 
          key={card.label}
          // ✅ Centers the text values inside the individual cards themselves
          style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
        >
          <span>{card.label}</span>
          <strong>{card.value}</strong>
        </article>
      ))}
    </section>
  );
}