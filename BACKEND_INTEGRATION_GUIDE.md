# Backend Integration Guide for Personal Expense Tracker

This guide shows how the frontend will call the API endpoints and what the backend should expect and return.

## Frontend API Call Pattern

All authenticated endpoints include userId in the path:

```javascript
// Pattern: /users/:userId/endpoint
GET /users/user-123/categories
GET /users/user-123/transactions
POST /users/user-123/goals/add-funds
```

## API Files Overview

### 1. categoriesApi.js
Used for category-related operations.

**File Location**: `src/categoriesApi.js`

```javascript
import { get, getUserId } from "./apiClient";

// Call pattern:
GET /users/${userId}/categories
GET /users/${userId}/category-breakdown?year=${year}&month=${month}
```

**Frontend Usage**:
```javascript
const categories = await fetchCategories();
const breakdown = await fetchCategoryBreakdownByMonth(2024, 7);
```

### 2. accountsApi.js
Used for account and transaction operations.

**File Location**: `src/accountsApi.js`

```javascript
import { get, getUserId } from "./apiClient";

// Call pattern:
GET /users/${userId}/accounts
GET /users/${userId}/transactions?year=${year}&month=${month}
```

**Frontend Usage**:
```javascript
const accounts = await fetchAccounts();
const transactions = await fetchTransactionsByMonth(2024, 7);
```

### 3. goalsApi.js
Used for savings goal operations.

**File Location**: `src/goalsApi.js`

```javascript
import { post } from "./apiClient";

// Call pattern:
POST /users/${userId}/goals/add-funds
```

**Frontend Usage**:
```javascript
await addFundsToGoal(goalId, amount, accountId);
```

### 4. transactionsApi.js
Used for transaction creation and normalization.

**File Location**: `src/transactionsApi.js`

```javascript
import { post } from "./apiClient";

// Call pattern:
POST /users/${userId}/transactions
```

**Frontend Usage**:
```javascript
await createTransaction(transaction);
```

### 5. dashboardApi.js
Used for dashboard data aggregation.

**File Location**: `src/dashboardApi.js`

Makes parallel requests to:
```
GET /users/${userId}/summary-cards
GET /users/${userId}/monthly-trend
GET /users/${userId}/category-breakdown
GET /users/${userId}/transactions
GET /users/${userId}/budgets
GET /users/${userId}/goals
GET /users/${userId}/accounts
GET /users/${userId}/settings
```

---

## Complete Frontend API Call Mapping

### Authentication (No userId required)

```javascript
// POST /auth/login
loginUser(credentials) {
  // Request: { email, password }
  // Response: { token, expiresAt, user: { id, email, name } }
}
```

---

### Dashboard Loading

```javascript
// GET /users/:userId/summary-cards
// GET /users/:userId/monthly-trend
// GET /users/:userId/category-breakdown
// GET /users/:userId/transactions
// GET /users/:userId/budgets
// GET /users/:userId/goals
// GET /users/:userId/accounts
// GET /users/:userId/settings

fetchDashboardData() {
  // Parallel requests for all dashboard data
  // Returns aggregated dashboard object
}
```

---

### Categories Management

```javascript
// GET /users/:userId/categories
fetchCategories() {
  // Response: [
  //   {
  //     id: string,
  //     name: string,
  //     type: "expense" | "income",
  //     icon: string,
  //     color: string,
  //     subcategories: [{ id, name, allocated }]
  //   }
  // ]
}

// GET /users/:userId/category-breakdown?year=2024&month=7
fetchCategoryBreakdownByMonth(year, month) {
  // Response: [
  //   {
  //     id: string,
  //     name: string,
  //     allocated: number,
  //     spent: number,
  //     subcategories: [{ id, name, allocated, spent }]
  //   }
  // ]
}
```

---

### Accounts Management

```javascript
// GET /users/:userId/accounts
fetchAccounts() {
  // Response: [
  //   {
  //     id: string,
  //     name: string,
  //     type: "checking" | "savings" | "credit",
  //     bank: string,
  //     spendableBalance: number,
  //     savingsBalance: number,
  //     totalBalance: number,
  //     currency: string
  //   }
  // ]
}
```

---

### Transactions Management

```javascript
// GET /users/:userId/transactions?year=2024&month=7
fetchTransactionsByMonth(year, month) {
  // Response: {
  //   transactions: [
  //     {
  //       id: string,
  //       categoryId: string,
  //       category: string,
  //       subcategoryId: string,
  //       subCategory: string,
  //       amount: number,
  //       note: string,
  //       type: "DEBIT" | "CREDIT",
  //       transactionDate: ISO8601,
  //       merchant: string,
  //       accountId: string,
  //       status: string,
  //       date: string (formatted),
  //       createdAt: ISO8601,
  //       updatedAt: ISO8601
  //     }
  //   ],
  //   pagination: { total, limit, offset, hasMore }
  // }
}

// POST /users/:userId/transactions
createTransaction(transaction) {
  // Request: {
  //   categoryId: string,
  //   subcategoryId: string,
  //   amount: number,
  //   note: string,
  //   type: "DEBIT" | "CREDIT",
  //   transactionDate: "YYYY-MM-DD",
  //   accountId?: string,
  //   merchant?: string
  // }
  // Response: {
  //   transaction: { ...normalized transaction }
  // }
}
```

---

### Goals Management

```javascript
// POST /users/:userId/goals/add-funds
addFundsToGoal(goalId, amount, accountId) {
  // Request: {
  //   goalId: string,
  //   amount: number,
  //   accountId: string
  // }
  // Response: {
  //   goal: {
  //     id: string,
  //     name: string,
  //     target: number,
  //     saved: number,
  //     deadline: ISO8601,
  //     priority: string,
  //     updatedAt: ISO8601
  //   },
  //   transfer: {
  //     id: string,
  //     from: string,
  //     to: string,
  //     amount: number,
  //     date: ISO8601,
  //     status: "completed"
  //   }
  // }
}
```

---

## How to Extract userId in Backend

When receiving requests, extract userId from the path:

```javascript
// Express.js example
app.get('/users/:userId/categories', (req, res) => {
  const userId = req.params.userId;
  // Use userId to fetch user-specific data
});

// Node.js URL pattern
// GET /users/user-123/categories
// req.params.userId = "user-123"
```

---

## Authorization Pattern

The frontend sends the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Backend verification pattern**:
```javascript
// Extract from header
const token = req.headers.authorization?.split(" ")[1];

// Verify token
const decoded = jwt.verify(token, SECRET);
const userId = decoded.user.id;

// Validate the userId in path matches the token's userId
if (req.params.userId !== userId) {
  return res.status(403).json({ error: "Forbidden" });
}
```

---

## Response Format Examples

### Success Response (200 OK)
```json
{
  "transaction": {
    "id": "txn-123",
    "categoryId": "cat-1",
    "amount": 85.50,
    ...
  }
}
```

### List Response (200 OK)
```json
{
  "transactions": [...],
  "pagination": {
    "total": 50,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

### Error Response
```json
{
  "message": "Human-readable error message",
  "error": "error_code",
  "statusCode": 400
}
```

---

## Testing the Frontend-Backend Integration

### 1. Test Login
```bash
POST http://localhost:8080/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Response
{
  "token": "jwt_token",
  "expiresAt": 1719948518000,
  "user": { "id": "user-123", "email": "user@example.com" }
}
```

### 2. Test Category Fetch
```bash
GET http://localhost:8080/users/user-123/categories
Authorization: Bearer jwt_token
```

### 3. Test Create Transaction
```bash
POST http://localhost:8080/users/user-123/transactions
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "categoryId": "cat-1",
  "subcategoryId": "subcat-1",
  "amount": 85.50,
  "note": "Groceries",
  "type": "DEBIT",
  "transactionDate": "2024-07-02",
  "accountId": "acc-1"
}
```

### 4. Test Add Funds to Goal
```bash
POST http://localhost:8080/users/user-123/goals/add-funds
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "goalId": "goal-1",
  "amount": 500,
  "accountId": "acc-1"
}
```

---

## Key Points for Backend Implementation

1. **Always include userId in the path** - Never rely on token alone for authorization
2. **Validate userId from path matches userId from token** - Prevent users from accessing other users' data
3. **Use ISO 8601 format for all dates** - Format: `2024-07-02T15:00:00Z`
4. **Return proper HTTP status codes** - 200, 201, 204, 400, 401, 403, 404, 500
5. **Include consistent error messages** - Always include `message` and `error` fields
6. **Implement pagination for list endpoints** - Include `pagination` metadata
7. **Use consistent field naming** - Match the field names shown in API_DOCUMENTATION.md
8. **Include timestamps** - `createdAt` and `updatedAt` for entities

---

## Environment Variables

Frontend expects:
```
VITE_API_BASE_URL=http://localhost:8080
```

Backend should run on port 8080 or use the configured URL.

---

## Common Issues and Solutions

### Issue: "Invalid credentials" on login
**Solution**: Ensure backend is returning correct response format with `token`, `expiresAt`, and `user` object

### Issue: "Unauthorized" on protected endpoints
**Solution**: Ensure token is being sent in `Authorization: Bearer {token}` format

### Issue: "Forbidden" on protected endpoints
**Solution**: Ensure userId in path matches userId in JWT token

### Issue: Transaction creation fails with validation error
**Solution**: Ensure categoryId and subcategoryId exist and subcategoryId belongs to the category

### Issue: Goal update doesn't refresh
**Solution**: Ensure API returns the updated goal object in response
