# Personal Expense Tracker - Frontend Setup & API Documentation

## 📦 Project Overview

This is a fully functional React expense tracking application with features for:
- ✅ Transaction management (create, view, update, delete)
- ✅ Category and subcategory based budgeting
- ✅ Account balance tracking with multiple account types
- ✅ Savings goals with fund transfer capability
- ✅ Month-based filtering for all data
- ✅ Responsive UI with light/dark theme support
- ✅ All data dynamically fetched from backend API

## 📋 Documentation Files

### For Backend Developers:

1. **COMPLETE_API_GUIDE.md** (22KB) - START HERE
   - Complete endpoint reference with examples
   - All request/response formats
   - Path and query parameters
   - Error handling
   - Testing guide

2. **API_QUICK_REFERENCE.md** (12KB)
   - Quick lookup for all endpoints
   - Curl command examples
   - Common parameters
   - Status codes reference

3. **API_DOCUMENTATION.md** (20KB)
   - Detailed endpoint specifications
   - Request/response schemas
   - Data types and formats
   - Rate limiting info

4. **BACKEND_INTEGRATION_GUIDE.md** (10KB)
   - How frontend calls the API
   - Integration patterns
   - Authorization flow
   - Testing checklist

### For Frontend Developers:

5. **IMPLEMENTATION_SUMMARY.md** (7KB)
   - What was implemented
   - New components created
   - Files modified
   - Build status

## 🎯 Key Requirements Met

### ✅ Category Management
- User can see each category with subcategories
- Displays allocated amount for the month
- Displays current spend for the month
- Can navigate between months
- Categories fetched from backend (id, name)
- Responsive breakdown view

### ✅ Transaction Entry
- Form to enter new transactions
- Select category → subcategory (dependent dropdown)
- Enter amount and note
- Select type (CREDIT/DEBIT)
- Select transaction date
- Submit sends: `categoryId`, `subcategoryId`, `amount`, `note`, `type`, `transactionDate`

### ✅ Transaction Viewing
- View all transactions for current month
- Navigate between months
- Shows category/subcategory breakdown
- Displays transaction details
- Pagination support

### ✅ Account Management
- View all accounts
- Display spendable balance
- Display savings balance
- Show total balance
- Card-based responsive layout

### ✅ Goals Management
- View savings goals with progress
- Show current saved vs target
- Show percentage funded
- Add funds from account to goal
- Inline form for adding funds
- Account selector dropdown

### ✅ Responsive Design
- Mobile optimized
- Tablet optimized
- Desktop optimized
- Light/dark theme support
- Current theme integrated

## 🚀 Quick Start

### Frontend Setup
```bash
cd "Personal Expense Tracker FE"
npm install
npm run dev      # Development server
npm run build    # Production build
```

### Environment Variables
```
VITE_API_BASE_URL=http://localhost:8080
```

### Build Status
✅ Successfully builds with no errors
- Bundle size: 630.68 kB (JS)
- Gzip: 187.42 kB (JS)

## 🔗 API Endpoints Overview

All endpoints include userId in path (except login):

```
POST   /auth/login                                    # Login
GET    /users/:userId/summary-cards                  # Dashboard cards
GET    /users/:userId/monthly-trend                  # Cash flow chart
GET    /users/:userId/category-breakdown             # Pie chart
GET    /users/:userId/budgets                        # Budgets list
GET    /users/:userId/goals                          # Goals list
GET    /users/:userId/transactions                   # Transactions
GET    /users/:userId/settings                       # User settings
GET    /users/:userId/categories                     # Categories dropdown
GET    /users/:userId/category-breakdown?y=X&m=Y    # Month breakdown
GET    /users/:userId/accounts                       # Accounts list
GET    /users/:userId/transactions?y=X&m=Y           # Month transactions
POST   /users/:userId/transactions                   # Create transaction
PUT    /users/:userId/transactions/:id               # Update transaction
DELETE /users/:userId/transactions/:id               # Delete transaction
POST   /users/:userId/goals/add-funds                # Transfer to goal
POST   /users/:userId/goals                          # Create goal
PUT    /users/:userId/goals/:id                      # Update goal
DELETE /users/:userId/goals/:id                      # Delete goal
```

See **COMPLETE_API_GUIDE.md** for full details.

## 📂 Project Structure

```
src/
├── components/
│   ├── AccountsPanel.jsx          # NEW - Account balances
│   ├── CategoriesPanel.jsx        # NEW - Category breakdown
│   ├── NewTransactionPanel.jsx    # UPDATED - Dynamic categories
│   ├── TransactionsPanel.jsx      # UPDATED - Month filtering
│   ├── GoalsPanel.jsx             # UPDATED - Add funds feature
│   ├── BudgetPanel.jsx
│   ├── CashFlowPanel.jsx
│   ├── SpendingMixPanel.jsx
│   ├── MetricCards.jsx
│   ├── Sidebar.jsx
│   ├── Topbar.jsx
│   ├── LoginPage.jsx
│   ├── SettingsPanel.jsx
│   └── MonthlyProgressPanel.jsx
├── accountsApi.js                 # NEW - Account & transaction API
├── categoriesApi.js               # NEW - Category API
├── goalsApi.js                    # NEW - Goals API
├── transactionsApi.js             # UPDATED
├── dashboardApi.js                # UPDATED
├── authApi.js
├── apiClient.js                   # UPDATED - Added PUT, DELETE, getUserId
├── App.jsx                        # UPDATED
├── styles.css                     # UPDATED - 400+ lines added
└── main.jsx
```

## 🛠 API Implementation Checklist

### Backend Implementation Required:

**Authentication**
- [ ] POST /auth/login
- [ ] Validate email/password
- [ ] Return JWT token with 24-hour expiry
- [ ] Return user object with id, email, name

**Dashboard**
- [ ] GET /users/:userId/summary-cards
- [ ] GET /users/:userId/monthly-trend
- [ ] GET /users/:userId/category-breakdown
- [ ] GET /users/:userId/budgets
- [ ] GET /users/:userId/goals
- [ ] GET /users/:userId/transactions
- [ ] GET /users/:userId/settings

**Categories**
- [ ] GET /users/:userId/categories (with subcategories)
- [ ] GET /users/:userId/category-breakdown?year=YYYY&month=MM

**Accounts**
- [ ] GET /users/:userId/accounts

**Transactions**
- [ ] GET /users/:userId/transactions?year=YYYY&month=MM&limit=50&offset=0
- [ ] POST /users/:userId/transactions
- [ ] PUT /users/:userId/transactions/:transactionId
- [ ] DELETE /users/:userId/transactions/:transactionId

**Goals**
- [ ] POST /users/:userId/goals/add-funds
- [ ] POST /users/:userId/goals
- [ ] PUT /users/:userId/goals/:goalId
- [ ] DELETE /users/:userId/goals/:goalId

## 🔐 Authorization Pattern

All authenticated endpoints must:
1. Accept `Authorization: Bearer {token}` header
2. Extract userId from path parameter (e.g., `/users/user-123/...`)
3. Validate token and verify userId from token matches path userId
4. Return 403 Forbidden if mismatch
5. Return 401 Unauthorized if no token or invalid

## 📊 Data Models

### Transaction
```javascript
{
  id: "txn-123",
  categoryId: "cat-1",
  category: "Food & Dining",
  subcategoryId: "subcat-1",
  subCategory: "Groceries",
  amount: -85.50,
  note: "Weekly groceries",
  type: "DEBIT",
  transactionDate: "2024-07-02T10:30:00Z",
  merchant: "Whole Foods",
  accountId: "acc-1",
  status: "completed",
  date: "Jul 02",
  createdAt: "2024-07-02T10:30:00Z",
  updatedAt: "2024-07-02T10:30:00Z"
}
```

### Account
```javascript
{
  id: "acc-1",
  name: "Checking Account",
  type: "checking",
  bank: "Bank of America",
  spendableBalance: 5000.00,
  savingsBalance: 0.00,
  totalBalance: 5000.00,
  currency: "USD",
  lastUpdated: "2024-07-02T14:30:00Z"
}
```

### Goal
```javascript
{
  id: "goal-1",
  name: "Vacation Fund",
  target: 5000,
  saved: 2500,
  current: 2500,
  deadline: "2024-12-31T00:00:00Z",
  priority: "high",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-07-02T15:00:00Z"
}
```

### Category
```javascript
{
  id: "cat-1",
  name: "Food & Dining",
  type: "expense",
  icon: "Utensils",
  color: "#ff6b6b",
  subcategories: [
    {
      id: "subcat-1",
      name: "Groceries",
      allocated: 300,
      icon: "ShoppingCart"
    }
  ]
}
```

## 🎨 Theme Colors

The application uses CSS custom properties for theming:

**Light Theme**:
```css
--bg: #eef2f7
--surface: #ffffff
--surface-soft: #f8fafc
--text: #172033
--muted: #667085
--line: #d9e0ea
--accent: #2563eb
```

**Dark Theme**:
```css
--bg: #0d111a
--surface: #151b26
--surface-soft: #1d2532
--text: #f3f6fb
--muted: #a3adbd
--line: #2d3646
--accent: #60a5fa
```

## 🔄 Frontend API Call Pattern

```javascript
import { getUserId } from "./apiClient";

const userId = getUserId();

// Pattern: /users/${userId}/endpoint
const response = await get(`/users/${userId}/categories`);
```

## ✅ Validation Rules

**Transaction Creation**:
- categoryId must exist
- subcategoryId must belong to category
- amount must be > 0
- type must be "DEBIT" or "CREDIT"
- transactionDate must be valid date

**Add Funds to Goal**:
- goalId must exist
- accountId must exist
- amount must be > 0
- amount must be <= account balance
- goalId must belong to user

## 📈 Testing Workflow

1. **Start Frontend**
   ```bash
   npm run dev
   ```

2. **Start Backend** (port 8080)
   ```bash
   # Your backend server
   ```

3. **Login**
   - Use email and password from backend
   - Token stored automatically

4. **Test Features**
   - View dashboard
   - Create transaction
   - View transactions by month
   - Add funds to goal
   - View accounts

## 🐛 Common Issues

### "Unauthorized" on protected endpoints
- Ensure backend validates `Authorization: Bearer {token}` header
- Check token expiry (expiresAt)

### "Forbidden" on protected endpoints
- Ensure userId in path matches userId from JWT token
- Backend must validate: `req.params.userId === req.user.id`

### "Category not found"
- Ensure categoryId exists in backend
- Check subcategoryId belongs to category

### Transaction creation fails
- Validate all required fields present
- Check categoryId and subcategoryId exist
- Verify amount > 0

### Month filtering not working
- Ensure year parameter is 4-digit (e.g., 2024)
- Ensure month parameter is 1-12
- Check backend returns data for that month

## 📞 Support

For questions about:
- **Frontend Implementation**: See IMPLEMENTATION_SUMMARY.md
- **API Specifications**: See COMPLETE_API_GUIDE.md
- **Quick API Lookup**: See API_QUICK_REFERENCE.md
- **Backend Integration**: See BACKEND_INTEGRATION_GUIDE.md

## 🎉 Ready for Development!

The frontend is fully implemented and ready to integrate with your backend. Use the documentation files to implement the required endpoints, and both frontend and backend will work seamlessly together.

**Next Steps**:
1. Read COMPLETE_API_GUIDE.md
2. Implement all endpoints
3. Start frontend development server
4. Test integration with curl or Postman
5. Deploy!
