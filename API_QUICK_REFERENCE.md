# API Quick Reference - Personal Expense Tracker

## Format
```
METHOD /users/:userId/endpoint [?query-params]
Authorization: Bearer {token}
```

**Note**: Login endpoint has NO userId

---

## Authentication Endpoints

### Login (NO userId)
```
POST /auth/login
Content-Type: application/json

REQUEST:
{
  "email": "string",
  "password": "string"
}

RESPONSE (200):
{
  "token": "string (JWT)",
  "expiresAt": number (milliseconds),
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}

ERROR (401):
{
  "message": "Invalid credentials",
  "error": "authentication_failed"
}
```

---

## Dashboard Endpoints

### Summary Cards
```
GET /users/:userId/summary-cards

RESPONSE (200):
[
  {
    "id": "string",
    "title": "string",
    "value": number,
    "currency": "string (USD, EUR, etc)",
    "change": number,
    "changeType": "increase" | "decrease",
    "icon": "string (lucide icon name)"
  }
]
```

### Monthly Trend (Cash Flow)
```
GET /users/:userId/monthly-trend

RESPONSE (200):
[
  {
    "month": "string (Jan, Feb, ...)",
    "income": number,
    "expenses": number
  }
]
```

### Category Breakdown (Current Month Pie Chart)
```
GET /users/:userId/category-breakdown

RESPONSE (200):
[
  {
    "id": "string",
    "name": "string",
    "value": number,
    "percentage": number,
    "color": "string (hex #rrggbb)"
  }
]
```

### Budgets (Current Month)
```
GET /users/:userId/budgets

RESPONSE (200):
[
  {
    "id": "string",
    "name": "string",
    "limit": number,
    "spent": number,
    "remaining": number,
    "categoryId": "string"
  }
]
```

### Goals
```
GET /users/:userId/goals

RESPONSE (200):
[
  {
    "id": "string",
    "name": "string",
    "target": number,
    "saved": number,
    "current": number,
    "deadline": "string (ISO8601)",
    "priority": "high" | "medium" | "low",
    "createdAt": "string (ISO8601)"
  }
]
```

### Settings
```
GET /users/:userId/settings

RESPONSE (200):
{
  "currency": "string (USD, EUR, etc)",
  "defaultPeriod": "string (monthly, yearly, etc)",
  "timezone": "string (UTC, EST, etc)",
  "theme": "light" | "dark",
  "notifications": {
    "budgetAlerts": boolean,
    "goalReminders": boolean,
    "weeklyReport": boolean
  },
  "accounts": [
    {
      "id": "string",
      "name": "string",
      "type": "string"
    }
  ]
}
```

---

## Categories Endpoints

### Get All Categories
```
GET /users/:userId/categories

RESPONSE (200):
[
  {
    "id": "string",
    "name": "string",
    "type": "expense" | "income",
    "icon": "string (lucide icon name)",
    "color": "string (hex #rrggbb)",
    "subcategories": [
      {
        "id": "string",
        "name": "string",
        "allocated": number,
        "icon": "string"
      }
    ]
  }
]
```

### Get Category Breakdown by Month
```
GET /users/:userId/category-breakdown?year=YYYY&month=MM

QUERY PARAMS:
- year: number (required) - 4-digit year (e.g., 2024)
- month: number (required) - 1-12

RESPONSE (200):
[
  {
    "id": "string",
    "name": "string",
    "allocated": number,
    "spent": number,
    "type": "expense" | "income",
    "icon": "string",
    "color": "string",
    "subcategories": [
      {
        "id": "string",
        "name": "string",
        "allocated": number,
        "spent": number,
        "icon": "string"
      }
    ]
  }
]
```

---

## Accounts Endpoints

### Get All Accounts
```
GET /users/:userId/accounts

RESPONSE (200):
[
  {
    "id": "string",
    "name": "string",
    "type": "checking" | "savings" | "credit",
    "bank": "string",
    "accountNumber": "string (masked)",
    "spendableBalance": number,
    "savingsBalance": number,
    "totalBalance": number,
    "currency": "string (USD, EUR, etc)",
    "creditLimit": number (optional, for credit accounts),
    "availableCredit": number (optional),
    "lastUpdated": "string (ISO8601)"
  }
]
```

---

## Transactions Endpoints

### Get Transactions by Month
```
GET /users/:userId/transactions?year=YYYY&month=MM&limit=50&offset=0

QUERY PARAMS:
- year: number (optional) - defaults to current year
- month: number (optional) - defaults to current month (1-12)
- limit: number (optional) - 1-100, default 50
- offset: number (optional) - default 0

RESPONSE (200):
{
  "transactions": [
    {
      "id": "string",
      "categoryId": "string",
      "category": "string",
      "subcategoryId": "string",
      "subCategory": "string",
      "amount": number,
      "note": "string",
      "type": "DEBIT" | "CREDIT",
      "transactionDate": "string (ISO8601)",
      "merchant": "string",
      "accountId": "string",
      "accountName": "string",
      "status": "completed" | "pending",
      "date": "string (formatted, e.g., 'Jul 02')",
      "createdAt": "string (ISO8601)",
      "updatedAt": "string (ISO8601)"
    }
  ],
  "pagination": {
    "total": number,
    "limit": number,
    "offset": number,
    "hasMore": boolean
  }
}
```

### Get Single Transaction
```
GET /users/:userId/transactions/:transactionId

RESPONSE (200):
{
  "transaction": { ...transaction object }
}
```

### Create Transaction
```
POST /users/:userId/transactions
Content-Type: application/json

REQUEST:
{
  "categoryId": "string (required)",
  "subcategoryId": "string (required)",
  "amount": number (required, > 0),
  "note": "string (optional)",
  "type": "DEBIT" | "CREDIT" (required),
  "transactionDate": "string (YYYY-MM-DD, required)",
  "accountId": "string (optional)",
  "merchant": "string (optional)"
}

RESPONSE (201):
{
  "transaction": { ...transaction object }
}

ERROR (400):
{
  "message": "Invalid category or subcategory",
  "error": "validation_error",
  "fields": {
    "categoryId": "string",
    "subcategoryId": "string"
  }
}
```

### Update Transaction
```
PUT /users/:userId/transactions/:transactionId
Content-Type: application/json

REQUEST:
{
  "categoryId": "string",
  "subcategoryId": "string",
  "amount": number,
  "note": "string",
  "type": "DEBIT" | "CREDIT",
  "transactionDate": "string (YYYY-MM-DD)",
  "accountId": "string",
  "merchant": "string"
}

RESPONSE (200):
{
  "transaction": { ...updated transaction object }
}
```

### Delete Transaction
```
DELETE /users/:userId/transactions/:transactionId

RESPONSE (204): No Content
```

---

## Goals Endpoints

### Add Funds to Goal
```
POST /users/:userId/goals/add-funds
Content-Type: application/json

REQUEST:
{
  "goalId": "string (required)",
  "accountId": "string (required)",
  "amount": number (required, > 0)
}

RESPONSE (200):
{
  "goal": {
    "id": "string",
    "name": "string",
    "target": number,
    "saved": number,
    "current": number,
    "deadline": "string (ISO8601)",
    "priority": "high" | "medium" | "low",
    "createdAt": "string (ISO8601)",
    "updatedAt": "string (ISO8601)"
  },
  "transfer": {
    "id": "string",
    "from": "string (accountId)",
    "to": "string (goalId)",
    "amount": number,
    "date": "string (ISO8601)",
    "status": "completed"
  }
}

ERROR (400):
{
  "message": "Insufficient funds in account",
  "error": "insufficient_balance"
}

ERROR (404):
{
  "message": "Goal not found",
  "error": "goal_not_found"
}
```

### Create Goal
```
POST /users/:userId/goals
Content-Type: application/json

REQUEST:
{
  "name": "string (required)",
  "target": number (required, > 0),
  "deadline": "string (ISO8601, required)",
  "priority": "high" | "medium" | "low" (optional),
  "description": "string (optional)"
}

RESPONSE (201):
{
  "goal": {
    "id": "string",
    "name": "string",
    "target": number,
    "saved": 0,
    "current": 0,
    "deadline": "string (ISO8601)",
    "priority": "string",
    "description": "string",
    "createdAt": "string (ISO8601)",
    "updatedAt": "string (ISO8601)"
  }
}
```

### Update Goal
```
PUT /users/:userId/goals/:goalId
Content-Type: application/json

REQUEST:
{
  "name": "string (optional)",
  "target": number (optional),
  "deadline": "string (ISO8601, optional)",
  "priority": "high" | "medium" | "low" (optional)
}

RESPONSE (200):
{
  "goal": { ...updated goal object }
}
```

### Delete Goal
```
DELETE /users/:userId/goals/:goalId

RESPONSE (204): No Content
```

---

## HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET/PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | User lacks permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry |
| 500 | Server Error | Internal error |

---

## Error Response Format

All errors follow this format:
```json
{
  "message": "Human-readable message",
  "error": "error_code",
  "statusCode": number,
  "timestamp": "string (ISO8601)",
  "fields": { "fieldName": "error for this field" }  // optional
}
```

---

## Common Date Formats

- **ISO 8601 DateTime**: `2024-07-02T15:30:45Z`
- **ISO 8601 Date**: `2024-07-02`
- **Formatted Date** (in responses): `Jul 02`

---

## Authorization Header

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Send with all authenticated requests (all except login).

---

## Common Query Parameters

### Pagination
- `limit`: 1-100 (default: 50)
- `offset`: default 0

### Filtering by Month
- `year`: 4-digit year (e.g., 2024)
- `month`: 1-12

### Example:
```
GET /users/user-123/transactions?year=2024&month=7&limit=50&offset=0
```

---

## Rate Limiting

All responses include:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 1656779400
```

Limit: 100 requests per minute per user

---

## Frontend API Files Reference

| File | Purpose |
|------|---------|
| `authApi.js` | Login and authentication |
| `dashboardApi.js` | Load all dashboard data |
| `categoriesApi.js` | Fetch categories |
| `accountsApi.js` | Fetch accounts and transactions |
| `transactionsApi.js` | Create transactions |
| `goalsApi.js` | Add funds to goals |

---

## Example Usage in Frontend

```javascript
// Login
const session = await loginUser({ email, password });

// Load dashboard
const dashData = await fetchDashboardData();

// Get categories
const categories = await fetchCategories();

// Create transaction
await createTransaction({
  categoryId: "cat-1",
  subcategoryId: "subcat-1",
  amount: 85.50,
  note: "Groceries",
  type: "DEBIT",
  transactionDate: "2024-07-02",
  accountId: "acc-1"
});

// Add funds to goal
await addFundsToGoal("goal-1", 500, "acc-1");
```

---

## Important Notes

1. All authenticated endpoints require userId in the path
2. Token validation should verify userId matches path parameter
3. All money amounts are in the base currency unit
4. All dates/times are in ISO 8601 format (UTC)
5. Implement proper pagination for list endpoints
6. Return appropriate HTTP status codes
7. Include consistent error messages with error codes
8. Validate categoryId and subcategoryId before creating transactions
9. Check account balance before allowing fund transfers
10. Update timestamps on entity modifications
