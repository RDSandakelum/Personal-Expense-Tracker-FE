# Complete API Documentation & Implementation Guide
## Personal Expense Tracker Frontend - Backend Integration

---

## 📋 Table of Contents

1. API Endpoints Reference
2. Data Models & Response Formats
3. Backend Integration Instructions
4. Path & Query Parameter Examples
5. Error Handling
6. Authentication Flow
7. Frontend-Backend Communication Pattern

---

## 🔗 API Endpoints Reference

### Base URL
```
http://localhost:8080
```

### Authentication Header (All endpoints except /auth/login)
```
Authorization: Bearer {jwt_token}
```

---

## 1️⃣ Authentication (No userId required)

### POST /auth/login
**Public endpoint - no auth required**

```
POST /auth/login
Content-Type: application/json

REQUEST BODY:
{
  "email": "user@example.com",
  "password": "password123"
}

RESPONSE (200 OK):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": 1719948518000,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}

ERROR (401 Unauthorized):
{
  "message": "Invalid credentials",
  "error": "authentication_failed"
}
```

**Store Response**:
- Save `token` in localStorage as session
- Save `expiresAt` to validate token expiry
- Save `user.id` to use as userId in all subsequent requests

---

## 2️⃣ Dashboard Data Endpoints

All these endpoints are called on app load to populate the dashboard.

### GET /users/:userId/summary-cards
**Purpose**: Dashboard metric cards (Income, Expenses, Balance, etc.)

```
GET /users/user-123/summary-cards
Authorization: Bearer {token}

RESPONSE (200 OK):
[
  {
    "id": "card-income",
    "title": "Total Income",
    "value": 5000,
    "currency": "USD",
    "change": 12.5,
    "changeType": "increase",
    "icon": "TrendingUp"
  },
  {
    "id": "card-expenses",
    "title": "Total Expenses",
    "value": 3200,
    "currency": "USD",
    "change": -8.3,
    "changeType": "decrease",
    "icon": "TrendingDown"
  },
  {
    "id": "card-balance",
    "title": "Current Balance",
    "value": 15000,
    "currency": "USD",
    "change": 0,
    "changeType": "stable",
    "icon": "Wallet"
  },
  {
    "id": "card-budgets",
    "title": "Budget Used",
    "value": 45,
    "currency": "%",
    "change": 5,
    "changeType": "increase",
    "icon": "PieChart"
  }
]
```

### GET /users/:userId/monthly-trend
**Purpose**: Monthly income vs expenses for cash flow chart

```
GET /users/user-123/monthly-trend
Authorization: Bearer {token}

RESPONSE (200 OK):
[
  {
    "month": "Jan",
    "income": 5000,
    "expenses": 3200
  },
  {
    "month": "Feb",
    "income": 5500,
    "expenses": 3400
  },
  {
    "month": "Mar",
    "income": 4800,
    "expenses": 3100
  },
  {
    "month": "Apr",
    "income": 5200,
    "expenses": 3300
  },
  {
    "month": "May",
    "income": 5400,
    "expenses": 3500
  },
  {
    "month": "Jun",
    "income": 5600,
    "expenses": 3200
  }
]
```

### GET /users/:userId/category-breakdown
**Purpose**: Category breakdown for pie chart (current month)

```
GET /users/user-123/category-breakdown
Authorization: Bearer {token}

RESPONSE (200 OK):
[
  {
    "id": "cat-food",
    "name": "Food & Dining",
    "value": 850,
    "percentage": 26.6,
    "color": "#ff6b6b"
  },
  {
    "id": "cat-transport",
    "name": "Transportation",
    "value": 400,
    "percentage": 12.5,
    "color": "#4ecdc4"
  },
  {
    "id": "cat-entertainment",
    "name": "Entertainment",
    "value": 300,
    "percentage": 9.4,
    "color": "#45b7d1"
  },
  {
    "id": "cat-utilities",
    "name": "Utilities",
    "value": 200,
    "percentage": 6.3,
    "color": "#96ceb4"
  },
  {
    "id": "cat-healthcare",
    "name": "Healthcare",
    "value": 150,
    "percentage": 4.7,
    "color": "#ffeaa7"
  }
]
```

### GET /users/:userId/budgets
**Purpose**: All budgets for current month

```
GET /users/user-123/budgets
Authorization: Bearer {token}

RESPONSE (200 OK):
[
  {
    "id": "budget-1",
    "name": "Food & Dining",
    "limit": 800,
    "spent": 650,
    "remaining": 150,
    "categoryId": "cat-1",
    "percentage": 81
  },
  {
    "id": "budget-2",
    "name": "Transportation",
    "limit": 500,
    "spent": 450,
    "remaining": 50,
    "categoryId": "cat-2",
    "percentage": 90
  },
  {
    "id": "budget-3",
    "name": "Entertainment",
    "limit": 300,
    "spent": 300,
    "remaining": 0,
    "categoryId": "cat-3",
    "percentage": 100
  }
]
```

### GET /users/:userId/goals
**Purpose**: All savings goals

```
GET /users/user-123/goals
Authorization: Bearer {token}

RESPONSE (200 OK):
[
  {
    "id": "goal-1",
    "name": "Vacation Fund",
    "target": 5000,
    "saved": 2500,
    "current": 2500,
    "deadline": "2024-12-31T00:00:00Z",
    "priority": "high",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-07-02T15:00:00Z"
  },
  {
    "id": "goal-2",
    "name": "Emergency Fund",
    "target": 10000,
    "saved": 7500,
    "current": 7500,
    "deadline": "2025-06-30T00:00:00Z",
    "priority": "medium",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-07-01T12:00:00Z"
  }
]
```

### GET /users/:userId/transactions
**Purpose**: Recent transactions (default current month)

```
GET /users/user-123/transactions
Authorization: Bearer {token}

RESPONSE (200 OK):
{
  "transactions": [
    {
      "id": "txn-123",
      "categoryId": "cat-1",
      "category": "Food & Dining",
      "subcategoryId": "subcat-1",
      "subCategory": "Groceries",
      "amount": 85.50,
      "note": "Weekly groceries at Whole Foods",
      "type": "DEBIT",
      "transactionDate": "2024-07-02T10:30:00Z",
      "merchant": "Whole Foods Market",
      "accountId": "acc-1",
      "accountName": "Checking Account",
      "status": "completed",
      "date": "Jul 02",
      "createdAt": "2024-07-02T10:30:00Z",
      "updatedAt": "2024-07-02T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

### GET /users/:userId/settings
**Purpose**: User settings and preferences

```
GET /users/user-123/settings
Authorization: Bearer {token}

RESPONSE (200 OK):
{
  "currency": "USD",
  "defaultPeriod": "monthly",
  "timezone": "UTC",
  "theme": "light",
  "notifications": {
    "budgetAlerts": true,
    "goalReminders": true,
    "weeklyReport": false
  },
  "accounts": [
    {
      "id": "acc-1",
      "name": "Primary Checking",
      "type": "checking"
    },
    {
      "id": "acc-2",
      "name": "Savings",
      "type": "savings"
    }
  ]
}
```

---

## 3️⃣ Categories Endpoints

### GET /users/:userId/categories
**Purpose**: Get all categories with subcategories (for form dropdowns)

```
GET /users/user-123/categories
Authorization: Bearer {token}

RESPONSE (200 OK):
[
  {
    "id": "cat-1",
    "name": "Food & Dining",
    "type": "expense",
    "icon": "Utensils",
    "color": "#ff6b6b",
    "subcategories": [
      {
        "id": "subcat-1",
        "name": "Groceries",
        "allocated": 300,
        "icon": "ShoppingCart"
      },
      {
        "id": "subcat-2",
        "name": "Restaurants",
        "allocated": 150,
        "icon": "UtensilsCrossed"
      },
      {
        "id": "subcat-3",
        "name": "Coffee Shops",
        "allocated": 80,
        "icon": "Coffee"
      }
    ]
  },
  {
    "id": "cat-2",
    "name": "Transportation",
    "type": "expense",
    "icon": "Car",
    "color": "#4ecdc4",
    "subcategories": [
      {
        "id": "subcat-4",
        "name": "Gas",
        "allocated": 200,
        "icon": "Fuel"
      },
      {
        "id": "subcat-5",
        "name": "Public Transit",
        "allocated": 100,
        "icon": "Bus"
      }
    ]
  },
  {
    "id": "cat-3",
    "name": "Income",
    "type": "income",
    "icon": "DollarSign",
    "color": "#51cf66",
    "subcategories": [
      {
        "id": "subcat-7",
        "name": "Salary",
        "allocated": 0,
        "icon": "Briefcase"
      },
      {
        "id": "subcat-8",
        "name": "Freelance",
        "allocated": 0,
        "icon": "Code"
      }
    ]
  }
]
```

### GET /users/:userId/category-breakdown?year={year}&month={month}
**Purpose**: Get category breakdown with spending for specific month

```
GET /users/user-123/category-breakdown?year=2024&month=7
Authorization: Bearer {token}

QUERY PARAMETERS:
- year: 2024 (required, 4-digit format)
- month: 7 (required, 1-12)

RESPONSE (200 OK):
[
  {
    "id": "cat-1",
    "name": "Food & Dining",
    "allocated": 530,
    "spent": 450,
    "type": "expense",
    "icon": "Utensils",
    "color": "#ff6b6b",
    "subcategories": [
      {
        "id": "subcat-1",
        "name": "Groceries",
        "allocated": 300,
        "spent": 280,
        "icon": "ShoppingCart"
      },
      {
        "id": "subcat-2",
        "name": "Restaurants",
        "allocated": 150,
        "spent": 120,
        "icon": "UtensilsCrossed"
      },
      {
        "id": "subcat-3",
        "name": "Coffee Shops",
        "allocated": 80,
        "spent": 50,
        "icon": "Coffee"
      }
    ]
  },
  {
    "id": "cat-2",
    "name": "Transportation",
    "allocated": 350,
    "spent": 420,
    "type": "expense",
    "icon": "Car",
    "color": "#4ecdc4",
    "subcategories": [
      {
        "id": "subcat-4",
        "name": "Gas",
        "allocated": 200,
        "spent": 250,
        "icon": "Fuel"
      },
      {
        "id": "subcat-5",
        "name": "Public Transit",
        "allocated": 100,
        "spent": 100,
        "icon": "Bus"
      }
    ]
  }
]
```

---

## 4️⃣ Accounts Endpoints

### GET /users/:userId/accounts
**Purpose**: Get all user accounts with their balances

```
GET /users/user-123/accounts
Authorization: Bearer {token}

RESPONSE (200 OK):
[
  {
    "id": "acc-1",
    "name": "Checking Account",
    "type": "checking",
    "bank": "Bank of America",
    "accountNumber": "****1234",
    "spendableBalance": 5000.00,
    "savingsBalance": 0.00,
    "totalBalance": 5000.00,
    "currency": "USD",
    "lastUpdated": "2024-07-02T14:30:00Z"
  },
  {
    "id": "acc-2",
    "name": "Savings Account",
    "type": "savings",
    "bank": "Bank of America",
    "accountNumber": "****5678",
    "spendableBalance": 0.00,
    "savingsBalance": 15000.00,
    "totalBalance": 15000.00,
    "currency": "USD",
    "lastUpdated": "2024-07-02T14:30:00Z"
  },
  {
    "id": "acc-3",
    "name": "Credit Card",
    "type": "credit",
    "bank": "Chase",
    "accountNumber": "****9012",
    "spendableBalance": 3000.00,
    "savingsBalance": 0.00,
    "totalBalance": 3000.00,
    "creditLimit": 10000.00,
    "availableCredit": 3000.00,
    "currency": "USD",
    "lastUpdated": "2024-07-02T14:30:00Z"
  }
]
```

---

## 5️⃣ Transactions Endpoints

### GET /users/:userId/transactions?year={year}&month={month}&limit=50&offset=0
**Purpose**: Get transactions for specific month (with pagination)

```
GET /users/user-123/transactions?year=2024&month=7&limit=50&offset=0
Authorization: Bearer {token}

QUERY PARAMETERS (all optional):
- year: 2024 (defaults to current year if not provided)
- month: 7 (defaults to current month if not provided, 1-12)
- limit: 50 (1-100, default 50)
- offset: 0 (default 0)

RESPONSE (200 OK):
{
  "transactions": [
    {
      "id": "txn-1",
      "categoryId": "cat-1",
      "category": "Food & Dining",
      "subcategoryId": "subcat-1",
      "subCategory": "Groceries",
      "amount": -85.50,
      "note": "Weekly groceries",
      "type": "DEBIT",
      "transactionDate": "2024-07-02T10:30:00Z",
      "merchant": "Whole Foods Market",
      "accountId": "acc-1",
      "accountName": "Checking Account",
      "status": "completed",
      "date": "Jul 02",
      "createdAt": "2024-07-02T10:30:00Z",
      "updatedAt": "2024-07-02T10:30:00Z"
    },
    {
      "id": "txn-2",
      "categoryId": "cat-3",
      "category": "Income",
      "subcategoryId": "subcat-7",
      "subCategory": "Salary",
      "amount": 4000.00,
      "note": "Monthly salary",
      "type": "CREDIT",
      "transactionDate": "2024-07-01T00:00:00Z",
      "merchant": "Employer Inc.",
      "accountId": "acc-1",
      "accountName": "Checking Account",
      "status": "completed",
      "date": "Jul 01",
      "createdAt": "2024-07-01T00:00:00Z",
      "updatedAt": "2024-07-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

### POST /users/:userId/transactions
**Purpose**: Create a new transaction

```
POST /users/user-123/transactions
Authorization: Bearer {token}
Content-Type: application/json

REQUEST BODY:
{
  "categoryId": "cat-1",          // required - must exist
  "subcategoryId": "subcat-1",    // required - must belong to category
  "amount": 85.50,                // required - positive number only
  "note": "Weekly groceries",     // optional
  "type": "DEBIT",                // required - "DEBIT" or "CREDIT"
  "transactionDate": "2024-07-02",// required - YYYY-MM-DD format
  "accountId": "acc-1",           // optional - defaults to primary
  "merchant": "Whole Foods"       // optional
}

RESPONSE (201 Created):
{
  "transaction": {
    "id": "txn-new-123",
    "categoryId": "cat-1",
    "category": "Food & Dining",
    "subcategoryId": "subcat-1",
    "subCategory": "Groceries",
    "amount": -85.50,
    "note": "Weekly groceries",
    "type": "DEBIT",
    "transactionDate": "2024-07-02T10:30:00Z",
    "merchant": "Whole Foods",
    "accountId": "acc-1",
    "accountName": "Checking Account",
    "status": "completed",
    "date": "Jul 02",
    "createdAt": "2024-07-02T10:30:00Z",
    "updatedAt": "2024-07-02T10:30:00Z"
  }
}

ERROR (400 Bad Request):
{
  "message": "Invalid category or subcategory",
  "error": "validation_error",
  "fields": {
    "categoryId": "Category not found",
    "subcategoryId": "Subcategory does not belong to this category"
  }
}

ERROR (400 Bad Request - Invalid Amount):
{
  "message": "Amount must be greater than 0",
  "error": "validation_error"
}
```

### PUT /users/:userId/transactions/:transactionId
**Purpose**: Update an existing transaction

```
PUT /users/user-123/transactions/txn-123
Authorization: Bearer {token}
Content-Type: application/json

REQUEST BODY: (same as POST)
{
  "categoryId": "cat-1",
  "subcategoryId": "subcat-2",
  "amount": 95.00,
  "note": "Updated groceries",
  "type": "DEBIT",
  "transactionDate": "2024-07-02",
  "accountId": "acc-1",
  "merchant": "Whole Foods"
}

RESPONSE (200 OK):
{
  "transaction": { ...updated transaction }
}
```

### DELETE /users/:userId/transactions/:transactionId
**Purpose**: Delete a transaction

```
DELETE /users/user-123/transactions/txn-123
Authorization: Bearer {token}

RESPONSE (204 No Content):
(empty body)
```

---

## 6️⃣ Goals Endpoints

### POST /users/:userId/goals/add-funds
**Purpose**: Transfer funds from account to a savings goal

```
POST /users/user-123/goals/add-funds
Authorization: Bearer {token}
Content-Type: application/json

REQUEST BODY:
{
  "goalId": "goal-1",      // required - must exist
  "accountId": "acc-1",    // required - must have sufficient balance
  "amount": 500.00         // required - positive number, <= account balance
}

RESPONSE (200 OK):
{
  "goal": {
    "id": "goal-1",
    "name": "Vacation Fund",
    "target": 5000,
    "saved": 3000,         // updated
    "current": 3000,       // updated
    "deadline": "2024-12-31T00:00:00Z",
    "priority": "high",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-07-02T15:00:00Z"
  },
  "transfer": {
    "id": "transfer-123",
    "from": "acc-1",
    "to": "goal-1",
    "amount": 500.00,
    "date": "2024-07-02T15:00:00Z",
    "status": "completed"
  }
}

ERROR (400 Bad Request):
{
  "message": "Insufficient funds in account",
  "error": "insufficient_balance"
}

ERROR (404 Not Found):
{
  "message": "Goal not found",
  "error": "goal_not_found"
}

ERROR (404 Not Found):
{
  "message": "Account not found",
  "error": "account_not_found"
}
```

### POST /users/:userId/goals
**Purpose**: Create a new savings goal

```
POST /users/user-123/goals
Authorization: Bearer {token}
Content-Type: application/json

REQUEST BODY:
{
  "name": "House Down Payment",   // required
  "target": 50000,                // required - positive number
  "deadline": "2025-12-31",       // required - ISO8601 date
  "priority": "high",             // optional - high, medium, low
  "description": "Save for..."    // optional
}

RESPONSE (201 Created):
{
  "goal": {
    "id": "goal-new-123",
    "name": "House Down Payment",
    "target": 50000,
    "saved": 0,
    "current": 0,
    "deadline": "2025-12-31T00:00:00Z",
    "priority": "high",
    "description": "Save for...",
    "createdAt": "2024-07-02T15:00:00Z",
    "updatedAt": "2024-07-02T15:00:00Z"
  }
}
```

---

## 7️⃣ Error Handling

All error responses follow this format:

```json
{
  "message": "Human-readable error description",
  "error": "error_code_in_snake_case",
  "statusCode": 400,
  "timestamp": "2024-07-02T15:00:00Z",
  "fields": {
    "fieldName": "error for this specific field"
  }
}
```

### HTTP Status Codes

| Code | Meaning | When to Use |
|------|---------|------------|
| 200 | OK | Successful GET/PUT request |
| 201 | Created | Successful POST creating resource |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid parameters or validation failed |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | User lacks permission for resource |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry or conflict |
| 500 | Server Error | Internal server error |

### Common Error Codes

- `authentication_failed` - Invalid login credentials
- `invalid_token` - Token is invalid or expired
- `validation_error` - Request validation failed
- `insufficient_balance` - Not enough funds for operation
- `not_found` - Resource doesn't exist
- `unauthorized_access` - User not allowed to access resource
- `duplicate_entry` - Record already exists
- `category_not_found` - Category doesn't exist
- `goal_not_found` - Goal doesn't exist
- `account_not_found` - Account doesn't exist

---

## 📚 Frontend Integration Files

These are the files that make API calls:

| File | Purpose | Calls |
|------|---------|-------|
| `src/authApi.js` | Authentication | POST /auth/login |
| `src/dashboardApi.js` | Load dashboard | 8 parallel GET requests |
| `src/categoriesApi.js` | Categories | GET /categories, GET /category-breakdown?year=X&month=Y |
| `src/accountsApi.js` | Accounts & Transactions | GET /accounts, GET /transactions?year=X&month=Y |
| `src/transactionsApi.js` | Create transactions | POST /transactions |
| `src/goalsApi.js` | Goal operations | POST /goals/add-funds |

---

## 🎯 Implementation Checklist for Backend

- [ ] Implement POST /auth/login endpoint
- [ ] Validate token and implement userId path parameter
- [ ] Create GET /users/:userId/summary-cards
- [ ] Create GET /users/:userId/monthly-trend
- [ ] Create GET /users/:userId/category-breakdown (with/without query params)
- [ ] Create GET /users/:userId/budgets
- [ ] Create GET /users/:userId/goals
- [ ] Create GET /users/:userId/transactions (with query params)
- [ ] Create GET /users/:userId/settings
- [ ] Create GET /users/:userId/categories
- [ ] Create GET /users/:userId/accounts
- [ ] Create POST /users/:userId/transactions
- [ ] Create PUT /users/:userId/transactions/:transactionId
- [ ] Create DELETE /users/:userId/transactions/:transactionId
- [ ] Create POST /users/:userId/goals/add-funds
- [ ] Create POST /users/:userId/goals
- [ ] Create PUT /users/:userId/goals/:goalId
- [ ] Create DELETE /users/:userId/goals/:goalId
- [ ] Validate all request bodies
- [ ] Return consistent error responses
- [ ] Implement proper HTTP status codes
- [ ] Add pagination for list endpoints
- [ ] Validate userId from path matches token userId
- [ ] Use ISO 8601 for all timestamps
- [ ] Test with provided examples

---

## 🚀 Testing Guide

### 1. Login Test
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### 2. Get Categories Test
```bash
curl -X GET http://localhost:8080/users/user-123/categories \
  -H "Authorization: Bearer {token}"
```

### 3. Create Transaction Test
```bash
curl -X POST http://localhost:8080/users/user-123/transactions \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId":"cat-1",
    "subcategoryId":"subcat-1",
    "amount":85.50,
    "note":"Groceries",
    "type":"DEBIT",
    "transactionDate":"2024-07-02",
    "accountId":"acc-1"
  }'
```

---

## 📝 Notes

1. Always include userId in the path for authenticated endpoints
2. Validate that userId in path matches userId from JWT token
3. Use ISO 8601 format (UTC) for all timestamps
4. Return amounts as decimal numbers (cents for USD)
5. Implement rate limiting: 100 requests per minute per user
6. Include pagination metadata in list responses
7. Return appropriate HTTP status codes
8. Send Authorization header with all authenticated requests
9. Validate all request parameters before processing
10. Check account balance before allowing fund transfers
