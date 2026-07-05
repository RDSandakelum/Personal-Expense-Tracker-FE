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

const toApiTransfer = (transfer) => ({
  goalId: transfer.goal,
  amount: transfer.amount,
  note: transfer.note,
  type: transfer.type,
  date: transfer.date,
});

export async function createTransfer(transfer) {
  console.log("this is called 2")
  const data = (await post("/accounts/transfer", toApiTransfer(transfer))) ?? {};
  return true
}

