import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { fetchCategories } from "../categoriesApi";
import { getOrDefault } from "../apiClient";
import { fetchAccounts } from "../accountsApi";

export function NewTransactionPanel({ isSaving, onAddTransaction }) {
  const [form, setForm] = useState({
    type: "Debit",
    categoryId: "",
    accountId: "",
    subcategoryId: "",
    amount: "",
    note: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const [data, accountData] = await Promise.all([
          fetchCategories(),
          fetchAccounts()
        ]);
        setCategories(data);
        setAccounts(accountData);
        if (data.length > 0) {
          setForm((current) => ({
            ...current,
            categoryId: data[0].id,
            subcategoryId: data[0].subcategories?.[0]?.id ?? "",
            accountId: accountData[0]?.id ?? "",
          }));
          setSubcategories(data[0].subcategories ?? []);
        }
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const updateForm = (field, value) => {
    setForm((current) => {
      const updated = { ...current, [field]: value };
      if (field === "categoryId") {
        const selectedCategory = categories.find((c) => c.id === value);
        updated.subcategoryId = selectedCategory?.subcategories?.[0]?.id ?? "";
        setSubcategories(selectedCategory?.subcategories ?? []);
      }
      return updated;
    });
  };

  const handleSubmit = async (event) => {
  event.preventDefault();
  const numericAmount = Number(form.amount);

  // 1. Double check validation
  if (!numericAmount || numericAmount <= 0 || !form.categoryId || !form.subcategoryId || !form.accountId) {
    console.warn("Frontend validation failed. Something is blank.");
    return;
  }

  // 2. Build the exact payload object matching your Go Struct tags
  const payload = {
    type: form.type,
    accountId: form.accountId,
    categoryId: form.categoryId,
    subcategoryId: form.subcategoryId,
    amount: numericAmount,
    note: form.note,
    date: `${form.date}T00:00:00Z`, // Formats cleanly into Go's time.Time
  };

  // 3. CRITICAL: Pass the 'payload' variable directly into onAddTransaction!
  const wasSaved = await onAddTransaction(payload);

  if (wasSaved) {
    const firstCategory = categories[0];
    setForm((current) => ({
      ...current,
      amount: "",
      note: "",
      date: new Date().toISOString().slice(0, 10),
      accountId: accounts[0]?.id ?? "",
      categoryId: firstCategory?.id ?? "",
      subcategoryId: firstCategory?.subcategories?.[0]?.id ?? "",
    }));
    setSubcategories(firstCategory?.subcategories ?? []);
  }
};

  return (
    <article className="panel transaction-form-panel">
      <div className="panel-heading compact">
        <div>
          <p className="eyebrow">Create</p>
          <h2>New transaction</h2>
        </div>
      </div>

      {loadingCategories && <p className="inline-message">Loading categories...</p>}

      {!loadingCategories && (
        <form className="transaction-form" onSubmit={handleSubmit}>
          <label>
            <span>Type</span>
            <select disabled={isSaving} value={form.type} onChange={(event) => updateForm("type", event.target.value)}>
              <option value="Debit">Debit</option>
              <option value="Credit">Credit</option>
            </select>
          </label>

          <label>
            <span>Account</span>
            <select disabled={isSaving} value={form.accountId} onChange={(event) => updateForm("accountId", event.target.value)}>
              <option value="">Select account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Category</span>
            <select disabled={isSaving} value={form.categoryId} onChange={(event) => updateForm("categoryId", event.target.value)}>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Sub category</span>
            <select disabled={isSaving} value={form.subcategoryId} onChange={(event) => updateForm("subcategoryId", event.target.value)}>
              <option value="">Select subcategory</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Amount</span>
            <input
              min="0"
              placeholder="0.00"
              step="0.01"
              type="number"
              value={form.amount}
              disabled={isSaving}
              onChange={(event) => updateForm("amount", event.target.value)}
            />
          </label>

          <label>
            <span>Date</span>
            <input
              type="date"
              value={form.date}
              disabled={isSaving}
              onChange={(event) => updateForm("date", event.target.value)}
            />
          </label>

          <label>
            <span>Note</span>
            <input
              type="text"
              placeholder="Add a note..."
              value={form.note}
              disabled={isSaving}
              onChange={(event) => updateForm("note", event.target.value)}
            />
          </label>

          <button className="submit-button" disabled={isSaving} type="submit">
            <Plus size={17} />
            <span>{isSaving ? "Saving..." : "Add transaction"}</span>
          </button>
        </form>
      )}
    </article>
  );
}