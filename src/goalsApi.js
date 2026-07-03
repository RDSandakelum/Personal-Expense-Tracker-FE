import { post } from "./apiClient";

export async function addFundsToGoal(goalId, amount, accountId) {
  try {
    const data = await post("/goals/add-funds", {
      goalId,
      amount,
      accountId,
    });
    return data ?? {};
  } catch (error) {
    console.error("Error adding funds to goal:", error);
    throw error;
  }
}
