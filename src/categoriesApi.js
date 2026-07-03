import { get, post } from "./apiClient";

export async function fetchCategories() {
  try {
    const data = await get("/categories");
    return data?.categories ?? data ?? [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function fetchCategoryBreakdownByMonth(year, month) {
  try {
    const data = await get(`/categories/breakdown?year=${year}&month=${month}`);
    return data?.categories ?? data ?? [];
  } catch (error) {
    console.error("Error fetching category breakdown:", error);
    return [];
  }
}
