# Personal Expense Tracker - API Documentation

## Overview
All endpoints (except login) require `userId` as a path parameter. Include userId in the path as `/users/:userId/endpoint`.

---

## Authentication

### POST /auth/login
**Description**: Authenticate user and get session token

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "token": "jwt_token_here",
  "expiresAt": 1719948518000,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "message": "Invalid credentials",
  "error": "authentication_failed"
}
```

---

## Dashboard Data

### GET /users/:userId/summary-cards
**Description**: Get summary metric cards for dashboard

**Path Parameters**:
- `userId` (string, required)

**Query Parameters**: None

**Response** (200 OK):
```json
[
  {
    "id": "card-1",
    "title": "Total Income",
    "value": 5000,
    "currency": "USD",
    "change": 12.5,
    "changeType": "increase",
    "icon": "TrendingUp"
  },
  {
    "id": "card-2",
    "title": "Total Expenses",
    "value": 3200,
    "currency": "USD",
    "change": -8.3,
    "changeType": "decrease",
    "icon": "TrendingDown"
  }
]
```

---

### GET /users/:userId/monthly-trend
**Description**: Get monthly trend data for cash flow chart

**Path Parameters**:
- `userId` (string, required)

**Query Parameters**: None

**Response** (200 OK):
```json
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
  }
]
```

---

### GET /users/:userId/category-breakdown
**Description**: Get category breakdown for current month (pie chart)

**Path Parameters**:
- `userId` (string, required)

**Query Parameters**: None

**Response** (200 OK):
```json
[
  {
    "id": "cat-1",
    "name": "Food & Dining",
    "value": 800,
    "percentage": 25,
    "color": "#ff6b6b"
  },
  {
    "id": "cat-2",
    "name": "Transportation",
    "value": 400,
    "percentage": 12.5,
    "color": "#4ecdc4"
  },
  {
    "id": "cat-3",
    "name": "Entertainment",
    "value": 300,
    "percentage": 9,
    "color": "#45b7d1"
  }
]
```

---

### GET /users/:userId/budgets
**Description**: Get all budgets for current month

**Path Parameters**:
- `userId` (string, required)

**Query Parameters**: None

**Response** (200 OK):
```json
[
  {
    "id": "budget-1",
    "name": "Food",
    "limit": 800,
    "spent": 650,
    "remaining": 150,
    "categoryId": "cat-1"
  },
  {
    "id": "budget-2",
    "name": "Transportation",
    "limit": 500,
    "spent": 450,
    "remaining": 50,
    "categoryId": "cat-2"
  }
]
```

---

### GET /users/:userId/goals
**Description**: Get all savings goals

**Path Parameters**:
- `userId` (string, required)

**Query Parameters**: None

**Response** (200 OK):
```json
[
  {
    "id": "goal-1",
    "name": "Vacation Fund",
    "target": 5000,
    "saved": 2500,
    "current": 2500,
    "deadline": "2024-12-31",
    "priority": "high",
    "createdAt": "2024-01-15T10:00:00Z"
  },
  {
    "id": "goal-2",
    "name": "Emergency Fund",
    "target": 10000,
    "saved": 7500,
    "current": 7500,
    "deadline": "2025-06-30",
    "priority": "medium",
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

---

### GET /users/:userId/settings
**Description**: Get user settings

**Path Parameters**:
- `userId` (string, required)

**Query Parameters**: None

**Response** (200 OK):
```json
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

## Categories Management

### GET /users/:userId/categories
**Description**: Get all categories with subcategories

**Path Parameters**:
- `userId` (string, required)

**Query Parameters**: None

**Response** (200 OK):
```json
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
      },
      {
        "id": "subcat-6",
        "name": "Parking",
        "allocated": 50,
        "icon": "ParkingCircle"
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
      },
      {
        "id": "subcat-9",
        "name": "Investment Returns",
        "allocated": 0,
        "icon": "TrendingUp"
      }
    ]
  }
]
```

---

### GET /users/:userId/category-breakdown?year={year}&month={month}
**Description**: Get category breakdown for specific month with allocations and spending

**Path Parameters**:
- `userId` (string, required)

**Query Parameters**:
- `year` (number, required): 4-digit year (e.g., 2024)
- `month` (number, required): 1-12 month number

**Response** (200 OK):
```json
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
      },
      {
        "id": "subcat-6",
        "name": "Parking",
        "allocated": 50,
        "spent": 70,
        "icon": "ParkingCircle"
      }
    ]
  }
]
```

---

## Accounts Management

### GET /users/:userId/accounts
**Description**: Get all user accounts with balances

**Path Parameters**:
- `userId` (string, required)

**Query Parameters**: None

**Response** (200 OK):
```json
[
  {
    "id": "acc-1",
    "name": "Checking Account",
    "type": "checking",
    "bank": "Bank of America",
    "accountNumber": "****1234",
    "spendableBalance": 5000,
    "savingsBalance": 0,
    "totalBalance": 5000,
    "currency": "USD",
    "lastUpdated": "2024-07-02T14:30:00Z"
  },
  {
    "id": "acc-2",
    "name": "Savings Account",
    "type": "savings",
    "bank": "Bank of America",
    "accountNumber": "****5678",
    "spendableBalance": 0,
    "savingsBalance": 15000,
    "totalBalance": 15000,
    "currency": "USD",
    "lastUpdated": "2024-07-02T14:30:00Z"
  },
  {
    "id": "acc-3",
    "name": "Credit Card",
    "type": "credit",
    "bank": "Chase",
    "accountNumber": "****9012",
    "spendableBalance": 3000,
    "savingsBalance": 0,
    "totalBalance": 3000,
    "currency": "USD",
    "creditLimit": 10000,
    "availableCredit": 3000,
    "lastUpdated": "2024-07-02T14:30:00Z"
  }
]
```

---

## Transactions Management

### GET /users/:userId/transactions
**Description**: Get all transactions (default current month)

**Path Parameters**:
- `userId` (string, required)

**Query Parameters**:
- `year` (number, optional): 4-digit year (defaults to current year)
- `month` (number, optional): 1-12 month number (defaults to current month)
- `limit` (number, optional): Max results per page (default: 50)
- `offset` (number, optional): Pagination offset (default: 0)

**Response** (200 OK):
```json
{
  "transactions": [
    {
      "id": "txn-1",
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
    },
    {
      "id": "txn-2",
      "categoryId": "cat-3",
      "category": "Income",
      "subcategoryId": "subcat-7",
      "subCategory": "Salary",
      "amount": 4000,
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
    "total": 2,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

---

### POST /users/:userId/transactions
**Description**: Create a new transaction

**Path Parameters**:
- `userId` (string, required)

**Request Body**:
```json
{
  "categoryId": "cat-1",
  "subcategoryId": "subcat-1",
  "amount": 85.50,
  "note": "Weekly groceries at Whole Foods",
  "type": "DEBIT",
  "transactionDate": "2024-07-02",
  "accountId": "acc-1",
  "merchant": "Whole Foods Market"
}
```

**Response** (201 Created):
```json
{
  "transaction": {
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
}
```

**Error Response** (400 Bad Request):
```json
{
  "message": "Invalid category or subcategory",
  "error": "validation_error",
  "fields": {
    "categoryId": "Category not found",
    "subcategoryId": "Subcategory not found for this category"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "message": "Invalid amount",
  "error": "validation_error"
}
```

---

### GET /users/:userId/transactions/:transactionId
**Description**: Get a specific transaction

**Path Parameters**:
- `userId` (string, required)
- `transactionId` (string, required)

**Query Parameters**: None

**Response** (200 OK):
```json
{
  "transaction": {
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
}
```

---

### PUT /users/:userId/transactions/:transactionId
**Description**: Update a transaction

**Path Parameters**:
- `userId` (string, required)
- `transactionId` (string, required)

**Request Body**:
```json
{
  "categoryId": "cat-1",
  "subcategoryId": "subcat-2",
  "amount": 95.00,
  "note": "Updated note",
  "type": "DEBIT",
  "transactionDate": "2024-07-02",
  "accountId": "acc-1",
  "merchant": "Whole Foods Market"
}
```

**Response** (200 OK):
```json
{
  "transaction": {
    "id": "txn-123",
    "categoryId": "cat-1",
    "category": "Food & Dining",
    "subcategoryId": "subcat-2",
    "subCategory": "Restaurants",
    "amount": 95.00,
    "note": "Updated note",
    "type": "DEBIT",
    "transactionDate": "2024-07-02T10:30:00Z",
    "merchant": "Whole Foods Market",
    "accountId": "acc-1",
    "accountName": "Checking Account",
    "status": "completed",
    "date": "Jul 02",
    "createdAt": "2024-07-02T10:30:00Z",
    "updatedAt": "2024-07-02T11:00:00Z"
  }
}
```

---

### DELETE /users/:userId/transactions/:transactionId
**Description**: Delete a transaction

**Path Parameters**:
- `userId` (string, required)
- `transactionId` (string, required)

**Query Parameters**: None

**Response** (204 No Content):
```
(empty body)
```

---

## Goals Management

### POST /users/:userId/goals/add-funds
**Description**: Add funds from an account to a savings goal

**Path Parameters**:
- `userId` (string, required)

**Request Body**:
```json
{
  "goalId": "goal-1",
  "accountId": "acc-1",
  "amount": 500
}
```

**Response** (200 OK):
```json
{
  "goal": {
    "id": "goal-1",
    "name": "Vacation Fund",
    "target": 5000,
    "saved": 3000,
    "current": 3000,
    "deadline": "2024-12-31",
    "priority": "high",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-07-02T15:00:00Z"
  },
  "transfer": {
    "id": "transfer-123",
    "from": "acc-1",
    "to": "goal-1",
    "amount": 500,
    "date": "2024-07-02T15:00:00Z",
    "status": "completed"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "message": "Insufficient funds in account",
  "error": "insufficient_balance"
}
```

**Error Response** (404 Not Found):
```json
{
  "message": "Goal not found",
  "error": "goal_not_found"
}
```

---

### POST /users/:userId/goals
**Description**: Create a new savings goal

**Path Parameters**:
- `userId` (string, required)

**Request Body**:
```json
{
  "name": "New Goal",
  "target": 2000,
  "deadline": "2024-12-31",
  "priority": "medium",
  "description": "Goal description"
}
```

**Response** (201 Created):
```json
{
  "goal": {
    "id": "goal-3",
    "name": "New Goal",
    "target": 2000,
    "saved": 0,
    "current": 0,
    "deadline": "2024-12-31",
    "priority": "medium",
    "description": "Goal description",
    "createdAt": "2024-07-02T15:00:00Z",
    "updatedAt": "2024-07-02T15:00:00Z"
  }
}
```

---

### PUT /users/:userId/goals/:goalId
**Description**: Update a savings goal

**Path Parameters**:
- `userId` (string, required)
- `goalId` (string, required)

**Request Body**:
```json
{
  "name": "Updated Goal Name",
  "target": 3000,
  "deadline": "2025-01-01",
  "priority": "high"
}
```

**Response** (200 OK):
```json
{
  "goal": {
    "id": "goal-1",
    "name": "Updated Goal Name",
    "target": 3000,
    "saved": 3000,
    "current": 3000,
    "deadline": "2025-01-01",
    "priority": "high",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-07-02T15:30:00Z"
  }
}
```

---

### DELETE /users/:userId/goals/:goalId
**Description**: Delete a savings goal

**Path Parameters**:
- `userId` (string, required)
- `goalId` (string, required)

**Query Parameters**: None

**Response** (204 No Content):
```
(empty body)
```

---

## Error Handling

All error responses follow this format:

### Standard Error Response
```json
{
  "message": "Human-readable error message",
  "error": "error_code",
  "statusCode": 400,
  "timestamp": "2024-07-02T15:00:00Z"
}
```

### Common HTTP Status Codes
- `200 OK` - Successful GET/PUT request
- `201 Created` - Successful POST request creating resource
- `204 No Content` - Successful DELETE request
- `400 Bad Request` - Invalid request parameters or body
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User doesn't have permission for resource
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate entry)
- `500 Internal Server Error` - Server error

---

## Authentication Header

All endpoints (except login) require this header:

```
Authorization: Bearer {jwt_token}
```

---

## Rate Limiting

- 100 requests per minute per user
- Headers returned:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 85
  X-RateLimit-Reset: 1656779400
  ```

---

## Pagination

For paginated endpoints:

**Query Parameters**:
- `limit` (number, optional): 1-100, default 50
- `offset` (number, optional): default 0

**Response includes**:
```json
{
  "data": [...],
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

---

## Data Types

### Amount Fields
- Type: number (decimal)
- Format: Up to 2 decimal places
- Always in base currency unit (cents for USD, etc.)

### Date/DateTime Fields
- Format: ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)
- Timezone: UTC

### IDs
- Type: string
- Format: unique identifiers (can be UUID, alphanumeric, etc.)

### Currency
- Type: string
- Format: ISO 4217 (USD, EUR, GBP, etc.)

---

## Example Request/Response Flow

### 1. Login
```
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": 1719948518000,
  "user": {
    "id": "user-123",
    "email": "user@example.com"
  }
}
```

### 2. Get Categories (with token)
```
GET /users/user-123/categories
Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response: [categories array]
```

### 3. Create Transaction
```
POST /users/user-123/transactions
Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
{
  "categoryId": "cat-1",
  "subcategoryId": "subcat-1",
  "amount": 85.50,
  "note": "Groceries",
  "type": "DEBIT",
  "transactionDate": "2024-07-02",
  "accountId": "acc-1"
}

Response: {transaction object}
```

### 4. Add Funds to Goal
```
POST /users/user-123/goals/add-funds
Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
{
  "goalId": "goal-1",
  "accountId": "acc-1",
  "amount": 500
}

Response: {goal object, transfer object}
```
