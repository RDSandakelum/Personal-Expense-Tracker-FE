import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { formatCurrency } from "../utils/format";
import { fetchCategoryBreakdownByMonth } from "../categoriesApi";

export function CategoriesPanel() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchCategoryBreakdownByMonth(year, month);
        setCategories(data);
      } catch (error) {
        console.error("Failed to load category breakdowns:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [year, month]);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Handler for custom native HTML input picker changes
  const handleDateInput = (e) => {
    const val = e.target.value; // Expected layout string: "YYYY-MM"
    if (!val) return;

    const [chosenYear, chosenMonth] = val.split("-");
    // JavaScript dates index months starting from 0 (January), so subtract 1
    setCurrentDate(new Date(parseInt(chosenYear, 10), parseInt(chosenMonth, 10) - 1, 1));
  };

  // Generate string match token value format required by `<input type="month">` -> "YYYY-MM"
  const inputStringValue = `${year}-${String(month).padStart(2, "0")}`;

  return (
    <article className="panel categories-panel wide-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Planning</p>
          <h2>Budget by Category</h2>
        </div>
        
        <div className="month-selector" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Step Back Control Button */}
          <button onClick={handlePreviousMonth} className="ghost-button" type="button">
            <ChevronLeft size={18} />
          </button>
          
          {/* Native HTML Quick-Picker Wrapper Block */}
          <div className="picker-wrapper" style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
            <input 
              type="month" 
              value={inputStringValue}
              onChange={handleDateInput}
              className="month-picker-input"
              style={{
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.95rem",
                padding: "6px 12px",
                border: "1px solid var(--border-color, #e2e8f0)",
                borderRadius: "6px",
                fontFamily: "inherit"
              }}
            />
          </div>

          {/* Step Forward Control Button */}
          <button onClick={handleNextMonth} className="ghost-button" type="button">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {loading && <p className="inline-message">Loading category data...</p>}

      {!loading && categories.length === 0 && (
        <p className="empty-state">No category data for this month.</p>
      )}

      {!loading && categories.length > 0 && (
        <div className="categories-list">
          {categories.map((category) => {
            const totalAllocated = (category.subcategories ?? []).reduce((sum, sub) => sum + (sub.allocated ?? 0), 0);
            const totalSpent = (category.subcategories ?? []).reduce((sum, sub) => sum + (sub.spent ?? 0), 0);
            const categorySpentPercent = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

            return (
              <div className="category-block" key={category.id}>
                <div className="category-header">
                  <div>
                    <strong>{category.name}</strong>
                    <span className="category-meta">
                      {formatCurrency(totalSpent)} of {formatCurrency(totalAllocated)}
                    </span>
                  </div>
                  <span className={`category-percent ${categorySpentPercent > 100 ? "over-budget" : ""}`}>
                    {categorySpentPercent}%
                  </span>
                </div>

                <div className="category-progress">
                  <div className="progress-track" style={{ width: "100%" }}>
                    <span
                      className={`progress-fill ${categorySpentPercent > 100 ? "over-budget" : ""}`}
                      style={{ width: `${Math.min(categorySpentPercent, 100)}%` }}
                    />
                  </div>
                </div>

                {(category.subcategories ?? []).length > 0 && (
                  <div className="subcategories">
                    {category.subcategories.map((subcategory) => {
                      const subSpentPercent = (subcategory.allocated ?? 0) > 0 ? Math.round((subcategory.spent / subcategory.allocated) * 100) : 0;

                      return (
                        <div className="subcategory-item" key={subcategory.id}>
                          <div className="subcategory-info">
                            <span>{subcategory.name}</span>
                            <span className="amount">
                              {formatCurrency(subcategory.spent ?? 0)} / {formatCurrency(subcategory.allocated ?? 0)}
                            </span>
                          </div>
                          <span className={`subcategory-percent ${subSpentPercent > 100 ? "over-budget" : ""}`}>
                            {subSpentPercent}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}