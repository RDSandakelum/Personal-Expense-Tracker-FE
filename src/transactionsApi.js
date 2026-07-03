import { get, post } from "./apiClient";

export const normalizeTransaction = (row) => ({
  id: row.id,
  merchant: row.merchant,
  category: row.category,
  subCategory: row.subCategory ?? row.subcategory ?? row.sub_category,
  date: row.date ?? (row.transaction_date ? new Date(row.transaction_date).toLocaleDateString("en-US", { month: "short", day: "2-digit" }) : "Today"),
  amount: Number(row.amount),
  status: row.status,
  type: row.type,
  note: row.note,
});

const toApiTransaction = (transaction) => ({
  categoryId: transaction.categoryId,
  subcategoryId: transaction.subcategoryId,
  accountId: transaction.accountId,
  amount: transaction.amount,
  note: transaction.note,
  type: transaction.type,
  date: transaction.date,
});

export async function fetchTransactions() {
  const data = (await get("/transactions")) ?? [];
  const transactions = data.transactions ?? data;
  return Array.isArray(transactions) ? transactions.map(normalizeTransaction) : [];
}

export async function createTransaction(transaction) {
  const data = (await post("/transactions", toApiTransaction(transaction))) ?? {};

  return normalizeTransaction(data.transaction ?? data);
}

