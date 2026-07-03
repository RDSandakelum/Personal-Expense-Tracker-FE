# 🚀 Quick Start - Backend & Frontend Integration

## Start Both Servers

### Terminal 1 - Start Backend
```bash
cd "C:\Users\dinus\Desktop\Local Disk\Projects\expense-tracker-be"
go run main.go
```

Expected output:
```
[GIN-debug] Loaded HTML Templates (0):
[GIN-debug] Loaded HTML Templates (0): 
[GIN-debug] GET    /api/users/:userId/summary-cards --> ...
[GIN-debug] GET    /api/users/:userId/monthly-trend --> ...
...
[GIN-debug] Listening and serving HTTP on :8080
```

### Terminal 2 - Start Frontend Dev Server
```bash
cd "C:\Users\dinus\Documents\Personal Expense Tracker FE"
npm run dev
```

Then open: `http://localhost:5173`

---

## Data Flow

```
Frontend (http://localhost:5173)
    ↓ (API calls with Authorization header)
    ↓
Backend (http://localhost:8080)
    ↓ (Returns dummy data as JSON)
    ↓
Frontend (Displays data on UI)
```

---

## Testing the Integration

### 1. Open Browser DevTools (F12)
Go to **Console** tab

### 2. Login
- Use any email/password (dummy auth accepts all)
- Should see console log: `[API] POST http://localhost:8080/api/auth/login`

### 3. After Login
You should see API calls like:
```
[API] GET http://localhost:8080/api/users/some-uuid/summary-cards
[API] GET http://localhost:8080/api/users/some-uuid/monthly-trend
[API] GET http://localhost:8080/api/users/some-uuid/categories
[API] GET http://localhost:8080/api/users/some-uuid/accounts
[API] GET http://localhost:8080/api/users/some-uuid/goals
[API] GET http://localhost:8080/api/users/some-uuid/transactions
```

### 4. Check Network Tab
- Go to **Network** tab in DevTools
- Refresh page and login again
- Click on any API request
- **Response** tab should show dummy data with proper structure

---

## Common Issues & Fixes

### ❌ "Failed to fetch" or CORS error

**Cause:** Backend not running or wrong port

**Fix:**
1. Ensure backend is running on port 8080: `go run main.go`
2. Check `VITE_API_BASE_URL` in `.env` is `http://localhost:8080`
3. Restart frontend: `npm run dev`

---

### ❌ No authorization header sent

**Cause:** Token not saved after login

**Fix:**
1. Check browser console for errors during login
2. Open DevTools → Application tab → LocalStorage
3. Look for key: `expense_tracker_session`
4. Should contain token and user data

---

### ❌ Authorization header is `Bearer undefined`

**Cause:** Token not in localStorage

**Fix:**
1. Login again
2. Check if `expense_tracker_session` appears in localStorage
3. Token should be a long JWT string starting with `eyJ`

---

### ❌ Data shows on Network tab but not on UI

**Cause:** Frontend components not extracting data correctly

**Fix:**
1. Check browser console for any JavaScript errors
2. Verify API response structure matches component expectations
3. All fixes already applied in this session (see FIXES_APPLIED.md)

---

### ❌ Backend crashes or doesn't start

**Cause:** Port 8080 already in use or dependency issue

**Fix:**
```bash
# Kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Then restart backend
go run main.go
```

---

## Expected UI State After Login

✅ **Dashboard Tab:**
- Summary cards showing income/expenses/balance
- Monthly trend chart
- Category breakdown
- Budget allocation

✅ **Categories Tab:**
- 6 categories listed
- Each with subcategories
- Month selector working
- Allocated vs spent amounts

✅ **Accounts Tab:**
- 3 accounts showing
- Spendable and savings balances

✅ **Transactions Tab:**
- 9 dummy transactions
- Sortable by date/category
- Create transaction button working

✅ **Goals Tab:**
- 4 savings goals
- Progress bars showing
- Add funds button working

---

## API Response Examples

All backend endpoints now return properly structured dummy data.

**Example: GET /api/users/{userId}/accounts**
```json
{
  "accounts": [
    {
      "id": "uuid-1",
      "name": "Primary Checking",
      "type": "checking",
      "spendable_balance": 5250.75,
      "savings_balance": 0.00,
      "currency": "USD",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-07-02T00:00:00Z"
    }
  ]
}
```

**Example: GET /api/users/{userId}/summary-cards**
```json
{
  "total_income": 4500.00,
  "total_expenses": 1097.50,
  "net_balance": 3402.50,
  "remaining_budget": 402.50,
  "available_funds": 5250.75,
  "savings_balance": 37500.50
}
```

---

## Final Checklist

Before reporting issues:

- [ ] Backend running on 8080 (check: `curl http://localhost:8080/api/auth/login`)
- [ ] Frontend running on 5173 (check: can access `http://localhost:5173`)
- [ ] `.env` file exists with `VITE_API_BASE_URL=http://localhost:8080`
- [ ] Cleared browser cache/localStorage
- [ ] No console errors in DevTools
- [ ] Login successful (token appears in localStorage)
- [ ] Network tab shows 200 responses from backend
- [ ] Response bodies contain dummy data

✅ **All systems go!** Data should now flow from backend → frontend → UI
