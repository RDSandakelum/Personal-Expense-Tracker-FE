# API ENDPOINTS - COMPLETE REFERENCE

## 🔐 Authentication (NO userId)
```
POST /auth/login
├── Body: { email, password }
└── Response: { token, expiresAt, user: { id, email, name } }
```

---

## 📊 Dashboard Data (Parallel Requests)
```
GET /users/:userId/summary-cards
├── Response: [{ id, title, value, currency, change, changeType, icon }]

GET /users/:userId/monthly-trend
├── Response: [{ month, income, expenses }]

GET /users/:userId/category-breakdown
├── Response: [{ id, name, value, percentage, color }]

GET /users/:userId/budgets
├── Response: [{ id, name, limit, spent, remaining, categoryId }]

GET /users/:userId/goals
├── Response: [{ id, name, target, saved, current, deadline, priority }]

GET /users/:userId/transactions
├── Query: ?year=YYYY&month=MM&limit=50&offset=0
└── Response: { transactions: [...], pagination: {...} }

GET /users/:userId/settings
└── Response: { currency, theme, notifications, accounts }
```

---

## 📂 Categories Management
```
GET /users/:userId/categories
├── Response: [{ 
│   id, name, type, icon, color,
│   subcategories: [{ id, name, allocated, icon }]
├── }]

GET /users/:userId/category-breakdown?year=YYYY&month=MM
├── Query: year (required), month (required, 1-12)
└── Response: [{ 
    id, name, allocated, spent, type, icon, color,
    subcategories: [{ id, name, allocated, spent }]
├── }]
```

---

## 💳 Accounts
```
GET /users/:userId/accounts
├── Response: [{
│   id, name, type (checking|savings|credit),
│   bank, accountNumber, spendableBalance, savingsBalance,
│   totalBalance, currency, creditLimit?, availableCredit?
├── }]
```

---

## 💰 Transactions
```
GET /users/:userId/transactions?year=YYYY&month=MM&limit=50&offset=0
├── Response: {
│   transactions: [{
│   │ id, categoryId, category, subcategoryId, subCategory,
│   │ amount, note, type (DEBIT|CREDIT),
│   │ transactionDate, merchant, accountId, accountName,
│   │ status, date, createdAt, updatedAt
│   ├── }],
│   pagination: { total, limit, offset, hasMore }
├── }

POST /users/:userId/transactions
├── Body: {
│   categoryId*, subcategoryId*, amount*, note,
│   type (DEBIT|CREDIT)*, transactionDate*, accountId, merchant
├── }
├── Response: { transaction: {...} }

PUT /users/:userId/transactions/:transactionId
├── Body: (same as POST)
└── Response: { transaction: {...} }

DELETE /users/:userId/transactions/:transactionId
└── Response: 204 No Content
```

---

## 🎯 Goals
```
POST /users/:userId/goals/add-funds
├── Body: { goalId*, accountId*, amount* }
└── Response: { 
    goal: {...updated goal},
    transfer: { id, from, to, amount, date, status }
├── }

POST /users/:userId/goals
├── Body: { name*, target*, deadline*, priority, description }
└── Response: { goal: {...} }

PUT /users/:userId/goals/:goalId
├── Body: { name, target, deadline, priority }
└── Response: { goal: {...} }

DELETE /users/:userId/goals/:goalId
└── Response: 204 No Content
```

---

## 📋 Field Definitions

### Common Fields
- `id`: String - Unique identifier
- `userId`: String - User owning the resource
- `createdAt`: ISO8601 - Creation timestamp
- `updatedAt`: ISO8601 - Last update timestamp
- `currency`: String - ISO 4217 code (USD, EUR, etc)

### Transaction Fields
- `categoryId`: String* - Must exist
- `subcategoryId`: String* - Must belong to category
- `amount`: Number* - Positive decimal, > 0
- `type`: String* - "DEBIT" or "CREDIT"
- `transactionDate`: String* - ISO8601 date
- `note`: String - Optional description
- `merchant`: String - Optional vendor name

### Category Fields
- `type`: String - "expense" or "income"
- `icon`: String - Lucide React icon name
- `color`: String - Hex color code (#rrggbb)
- `allocated`: Number - Budgeted amount

### Account Fields
- `type`: String - "checking", "savings", or "credit"
- `spendableBalance`: Number - Available to spend
- `savingsBalance`: Number - Restricted savings
- `totalBalance`: Number - Sum of both
- `creditLimit`: Number - For credit accounts

### Goal Fields
- `target`: Number* - Goal amount
- `saved`: Number - Current saved amount
- `current`: Number - Alias for saved
- `deadline`: ISO8601* - Target date
- `priority`: String - "high", "medium", or "low"

---

## 🔄 Request/Response Pattern

### Success Response (200/201)
```json
{
  "data": { ... } or [...],
  "pagination": { "total", "limit", "offset", "hasMore" }
}
```

### Error Response
```json
{
  "message": "Description",
  "error": "error_code",
  "statusCode": 400,
  "timestamp": "ISO8601",
  "fields": { "fieldName": "error" }
}
```

---

## 🎯 Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET/PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid data |
| 401 | Unauthorized | No/invalid token |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource missing |
| 409 | Conflict | Duplicate/conflict |
| 500 | Server Error | Server issue |

---

## 🔐 Authorization

### Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Validation
1. Check `Authorization` header exists
2. Extract token after "Bearer "
3. Verify token signature
4. Check expiry (expiresAt)
5. Extract userId from token
6. Validate userId matches path parameter
7. Return 403 if mismatch

---

## 📍 Query Parameters

### Pagination
- `limit`: 1-100 (default: 50)
- `offset`: 0+ (default: 0)

### Month Filtering
- `year`: 4-digit (e.g., 2024)
- `month`: 1-12

### Combined
```
GET /users/user-123/transactions?year=2024&month=7&limit=50&offset=0
```

---

## 🚀 Implementation Priorities

### Phase 1 (Required First)
1. ✅ POST /auth/login
2. ✅ GET /users/:userId/categories
3. ✅ GET /users/:userId/accounts
4. ✅ POST /users/:userId/transactions
5. ✅ GET /users/:userId/transactions

### Phase 2 (Dashboard)
6. ✅ GET /users/:userId/summary-cards
7. ✅ GET /users/:userId/monthly-trend
8. ✅ GET /users/:userId/category-breakdown
9. ✅ GET /users/:userId/budgets
10. ✅ GET /users/:userId/goals

### Phase 3 (Extended)
11. PUT /users/:userId/transactions/:id
12. DELETE /users/:userId/transactions/:id
13. POST /users/:userId/goals/add-funds
14. POST /users/:userId/goals
15. PUT/DELETE goals endpoints

---

## 🔗 Frontend API Files

| File | Endpoints Called |
|------|-----------------|
| authApi.js | POST /auth/login |
| categoriesApi.js | GET /categories, GET /category-breakdown?... |
| accountsApi.js | GET /accounts, GET /transactions?... |
| transactionsApi.js | POST /transactions |
| goalsApi.js | POST /goals/add-funds |
| dashboardApi.js | All 8 dashboard endpoints (parallel) |

---

## ✅ Backend Checklist

### Authentication
- [ ] Hash passwords (bcrypt)
- [ ] Generate JWT tokens
- [ ] Set 24-hour expiry
- [ ] Validate token on protected endpoints
- [ ] Verify userId matches path

### Data Validation
- [ ] Validate categoryId exists
- [ ] Validate subcategoryId belongs to category
- [ ] Validate amount > 0
- [ ] Validate dates in ISO8601
- [ ] Validate email format
- [ ] Validate required fields

### Response Format
- [ ] Return consistent error structure
- [ ] Include HTTP status codes
- [ ] Use ISO8601 for timestamps
- [ ] Include pagination metadata
- [ ] Timestamp all entities

### Business Logic
- [ ] Check account balance before transfer
- [ ] Update goal saved amount after transfer
- [ ] Calculate totals correctly
- [ ] Handle month-based filtering
- [ ] Support year/month parameters

### Security
- [ ] Validate userId from path
- [ ] Prevent data access across users
- [ ] Rate limit: 100 req/min per user
- [ ] Sanitize inputs
- [ ] Use HTTPS in production

---

## 📝 Notes for Backend

1. All amounts are in base currency units (cents for USD)
2. All dates must be ISO 8601 format (UTC)
3. IDs can be UUID or alphanumeric
4. Include createdAt and updatedAt for entities
5. Implement proper pagination for list endpoints
6. Validate all request parameters
7. Return appropriate HTTP status codes
8. Keep error messages user-friendly
9. Log all transactions for audit trail
10. Test with provided curl examples

---

## 🧪 Quick Test Examples

### Test 1: Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'
```

### Test 2: Get Categories
```bash
curl -X GET http://localhost:8080/users/user-123/categories \
  -H "Authorization: Bearer TOKEN_HERE"
```

### Test 3: Create Transaction
```bash
curl -X POST http://localhost:8080/users/user-123/transactions \
  -H "Authorization: Bearer TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId":"cat-1",
    "subcategoryId":"subcat-1",
    "amount":85.50,
    "note":"Groceries",
    "type":"DEBIT",
    "transactionDate":"2024-07-02"
  }'
```

### Test 4: Add Funds to Goal
```bash
curl -X POST http://localhost:8080/users/user-123/goals/add-funds \
  -H "Authorization: Bearer TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "goalId":"goal-1",
    "accountId":"acc-1",
    "amount":500
  }'
```

---

## 📞 Documentation References

- **Complete Guide**: COMPLETE_API_GUIDE.md
- **Quick Reference**: API_QUICK_REFERENCE.md
- **Implementation Details**: IMPLEMENTATION_SUMMARY.md
- **Backend Integration**: BACKEND_INTEGRATION_GUIDE.md
- **Full Specifications**: API_DOCUMENTATION.md

---

**Status**: ✅ Frontend Complete & Ready for Backend Integration
**Build**: ✅ Successful (630.68 kB)
**Version**: 1.0.0
