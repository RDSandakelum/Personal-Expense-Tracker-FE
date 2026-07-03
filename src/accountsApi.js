import { get, post } from "./apiClient";

export async function fetchAccounts() {
  try {
    const data = await get("/accounts");
    return data?.accounts ?? data ?? [];
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return [];
  }
}

export async function fetchTransactionsByMonth(year, month) {
  try {
    const data = await get(`/transactions?year=${year}&month=${month}`);
    return data ?? [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}
