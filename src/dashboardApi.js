import { getOrDefault } from "./apiClient";
import { normalizeTransaction } from "./transactionsApi";
import { fetchAccounts } from "./accountsApi";

const emptyDashboardData = {
  summaryCards: [],
  monthlyTrend: [],
  categoryBreakdown: [],
  transactions: [],
  budgets: [],
  goals: [],
  accounts: [],
  settings: {
    currency: "",
    defaultPeriod: "",
    accounts: [],
  },
};

function transformSummaryCards(data) {
  if (!data) return [];
  
  const summary = data;
  return [
    {
      label: "Total Income",
      value: `$${(summary.total_income || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
      delta: "+4.5%",
      tone: "positive",
    },
    {
      label: "Total Expenses",
      value: `$${(summary.total_expenses || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
      delta: "-2.3%",
      tone: "negative",
    },
    {
      label: "Net Balance",
      value: `$${(summary.net_balance || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
      delta: "+12.5%",
      tone: "positive",
    },
    {
      label: "Available Funds",
      value: `$${(summary.available_funds || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
      delta: "+0.0%",
      tone: "neutral",
    },
  ];
}

function transformCategoryBreakdown(data) {
  if (!data || !Array.isArray(data)) return [];
  
  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
  
  return data.map((category, index) => ({
    name: category.category,
    value: category.spent || 0,
    color: colors[index % colors.length],
  }));
}

function transformBudgets(data) {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map((item) => ({
    name: item.category || item.name,
    limit: item.allocated || item.limit || 0,
    spent: item.spent || 0,
  }));
}

function transformMonthlyTrend(data) {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map((item) => ({
    month: item.month,
    income: item.income || 0,
    expenses: item.expenses || 0,
    balance: item.balance || 0,
    savings: item.balance || item.savings || 0,
  }));
}

export async function fetchDashboardData(year, month) {
  // If year or month aren't passed, fall back to current time values
  const queryYear = year || new Date().getFullYear();
  const queryMonth = month || (new Date().getMonth() + 1);

  const [
    summaryCards,
    monthlyTrend,
    categoryBreakdown, // Target route query payload update
    transactions,
    budgets,
    goals,
    accounts,
    settings,
  ] = await Promise.all([
    getOrDefault("/summary-cards", {}),
    getOrDefault("/monthly-trend", {}),
    // Append your target query parameters here
    getOrDefault(`/category-breakdown?year=${queryYear}&month=${queryMonth}`, {}),
    getOrDefault("/transactions", []),
    getOrDefault("/budgets", {}),
    getOrDefault("/goals", {}),
    fetchAccounts(),
    getOrDefault("/settings", emptyDashboardData.settings),
  ]);

  return {
    ...emptyDashboardData,
    summaryCards: transformSummaryCards(summaryCards),
    monthlyTrend: transformMonthlyTrend(monthlyTrend?.trends ?? monthlyTrend ?? []),
    categoryBreakdown: transformCategoryBreakdown(categoryBreakdown?.categories ?? categoryBreakdown ?? []),
    transactions: ((transactions?.transactions ?? transactions) ?? []).map(normalizeTransaction),
    budgets: transformBudgets(budgets?.budgets ?? budgets ?? []),
    goals: (goals?.goals ?? goals) ?? [],
    accounts: (accounts?.accounts ?? accounts) ?? [],
    settings: {
      ...emptyDashboardData.settings,
      ...settings,
    },
  };
}

