import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Home, CreditCard, PieChart as PieChartIcon, LineChart, Settings, Landmark, TargetIcon } from "lucide-react";

import { clearStoredSession, getStoredSession, loginUser } from "./authApi";
import { fetchDashboardData } from "./dashboardApi";
import { createTransaction } from "./transactionsApi";
import { createTransfer } from "./accountsApi";

// Core UI Components
import { LoginPage } from "./components/LoginPage";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { MetricCards } from "./components/MetricCards";
import { CashFlowPanel } from "./components/CashFlowPanel";
import { SpendingMixPanel } from "./components/SpendingMixPanel";
import { NewTransactionPanel } from "./components/NewTransactionPanel";
import { TransactionsPanel } from "./components/TransactionsPanel";
import { BudgetPanel } from "./components/BudgetPanel";
import { GoalsPanel } from "./components/GoalsPanel";
import { MonthlyProgressPanel } from "./components/MonthlyProgressPanel";
import { SettingsPanel } from "./components/SettingsPanel";
import { CategoriesPanel } from "./components/CategoriesPanel";
import { AccountsPanel } from "./components/AccountsPanel";
import { AccountTransferPanel } from "./components/AccountTransfer";
import { AccountTransactionPanel } from "./components/AccountTransactionPanel";

const navItems = [
  { id: "overview", label: "Overview", title: "Personal expense dashboard", eyebrow: "June snapshot", icon: Home },
  { id: "transactions", label: "Transactions", title: "Transactions", eyebrow: "Recent activity", icon: CreditCard },
  { id: "accounts", label: "Accounts", title: "Accounts", eyebrow: "Manage your accounts", icon: Landmark },
  { id: "budgets", label: "Budgets", title: "Budgets and goals", eyebrow: "Monthly planning", icon: PieChartIcon },
  {id: "goals", label: "Goals", title: "Current Goals", eyebrow:"Current Goals", icon: TargetIcon},
  { id: "reports", label: "Reports", title: "Reports", eyebrow: "Spending analysis", icon: LineChart },
  { id: "settings", label: "Settings", title: "Settings", eyebrow: "Preferences", icon: Settings },
];

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

function App() {
  const [session, setSession] = useState(() => getStoredSession());
  const [darkMode, setDarkMode] = useState(true);
  const [activePage, setActivePage] = useState("overview");
  const [dashboardData, setDashboardData] = useState(emptyDashboardData);
  const [transactionStatus, setTransactionStatus] = useState({
    error: "",
    isLoading: true,
    isSaving: false,
  });

  const { summaryCards, monthlyTrend, categoryBreakdown, transactions, budgets, goals, accounts, settings } = dashboardData;
  const totalBudget = useMemo(() => budgets.reduce((sum, budget) => sum + budget.limit, 0), [budgets]);
  const totalSpent = useMemo(() => budgets.reduce((sum, budget) => sum + budget.spent, 0), [budgets]);
  const currentPage = navItems.find((item) => item.id === activePage) ?? navItems[0];

  const loadDashboardData = useCallback(async () => {
    if (!session) {
      return;
    }

    setTransactionStatus((status) => ({ ...status, error: "", isLoading: true }));

    try {
      const data = await fetchDashboardData();
      setDashboardData(data);
      setTransactionStatus((status) => ({ ...status, error: "", isLoading: false }));
    } catch (error) {
      setTransactionStatus((status) => ({ ...status, error: error.message, isLoading: false }));
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      loadDashboardData();
    }
  }, [loadDashboardData]);

  const handleLogin = async (credentials) => {
    const nextSession = await loginUser(credentials);
    setSession(nextSession);
  };

  const handleLogout = () => {
    clearStoredSession();
    setSession(null);
    setDashboardData(emptyDashboardData);
    setActivePage("overview");
    setTransactionStatus({ error: "", isLoading: false, isSaving: false });
  };

  const handleAddTransaction = async (transaction) => {
    setTransactionStatus((status) => ({ ...status, error: "", isSaving: true }));

    try {
      const savedTransaction = await createTransaction(transaction);
      setDashboardData((data) => ({
        ...data,
        transactions: [savedTransaction, ...data.transactions],
      }));
      setTransactionStatus((status) => ({ ...status, isSaving: false }));
      loadDashboardData();
      return true;
    } catch (error) {
      setTransactionStatus((status) => ({ ...status, error: error.message, isSaving: false }));
      return false;
    }
  };

  const handleAccountTransfer = async (transfer) => {
    try {
      const savedTransfer = await createTransfer(transfer);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleGoalUpdate = () => {
    loadDashboardData();
  };

  if (!session) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <main className={darkMode ? "app app-dark" : "app"}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} navItems={navItems} />

      <section className="workspace">
        <Topbar currentPage={currentPage} darkMode={darkMode} onLogout={handleLogout} setDarkMode={setDarkMode} />

        {activePage === "overview" && (
          <>
            {transactionStatus.isLoading && <p className="inline-message">Loading dashboard data...</p>}
            {transactionStatus.error && <p className="inline-message error-message">{transactionStatus.error}</p>}
            <MetricCards summaryCards={summaryCards} />
            <section className="dashboard-grid">
              <AccountsPanel accounts={accounts} />
              {/* <CashFlowPanel monthlyTrend={monthlyTrend} /> */}
              <SpendingMixPanel categoryBreakdown={categoryBreakdown} />
              <TransactionsPanel compact status={transactionStatus} transactions={transactions} />
              {/* <BudgetPanel budgets={budgets} totalSpent={totalSpent} totalBudget={totalBudget} /> */}
            </section>
          </>
        )}

        {activePage === "transactions" && (
          <section className="single-grid">
            <NewTransactionPanel isSaving={transactionStatus.isSaving} onAddTransaction={handleAddTransaction} />
            <TransactionsPanel status={transactionStatus} transactions={transactions} />
          </section>
        )}
        {activePage === "accounts" && (
          <section className="single-grid">
            <AccountsPanel accounts={accounts} />
            <AccountTransferPanel goals={goals} onTransfer={handleAccountTransfer} />
            <AccountTransactionPanel />
          </section>
        )}
        {activePage === "budgets" && (
          <section className="dashboard-grid">
            <CategoriesPanel />
            {/* <BudgetPanel budgets={budgets} totalSpent={totalSpent} totalBudget={totalBudget} large />
            <SpendingMixPanel categoryBreakdown={categoryBreakdown} /> */}
          </section>
        )}

        {activePage==="goals" && (
          <section className="single-grid">
            <GoalsPanel goals={goals} status={transactionStatus} />
          </section>
        )}

        {activePage === "reports" && (
          <section className="dashboard-grid">
            <CashFlowPanel monthlyTrend={monthlyTrend} />
            <SpendingMixPanel categoryBreakdown={categoryBreakdown} />
            <MonthlyProgressPanel monthlyTrend={monthlyTrend} />
          </section>
        )}

        {activePage === "settings" && (
          <SettingsPanel darkMode={darkMode} settings={settings} setDarkMode={setDarkMode} />
        )}
      </section>
    </main>
  );
}

export default App;
