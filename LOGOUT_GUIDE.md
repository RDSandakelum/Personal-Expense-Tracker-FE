# 🔐 Logout & Session Clearing Guide

## ✅ What's Already Implemented

The logout functionality is **fully built into the app**:

### 1. **Logout Button** (Top Right Corner)
- Located in the Topbar next to notifications
- Click the **LogOut icon** (↪️) to logout
- Clears session immediately and redirects to login

### 2. **Clear Session Function** 
- `clearStoredSession()` in `authApi.js`
- Removes `expense_tracker_session` from localStorage
- Dispatches auth event to update UI

### 3. **Logout Handler**
- In `App.jsx` line 90-96
- Clears session, resets dashboard data
- Returns to login page

---

## 🧹 Clear Browser Token (Manual)

If you need to manually clear the token:

### Option 1: Browser DevTools
1. Open DevTools: **F12**
2. Go to **Application** tab
3. Click **Local Storage**
4. Find `http://localhost:5173`
5. Look for key: `expense_tracker_session`
6. **Right-click → Delete**
7. Refresh page: **F5**

### Option 2: Browser Console
```javascript
// Paste this in DevTools Console (F12) and press Enter:
localStorage.removeItem("expense_tracker_session");
location.reload();
```

### Option 3: Clear All Storage
```javascript
// Clear everything and reload
localStorage.clear();
location.reload();
```

---

## 🔄 Login Flow After Clear

1. **Clear token** (using any method above)
2. **Page reloads** and shows **Login Page**
3. **Enter any credentials** (dummy auth accepts all):
   - Email: `user@example.com`
   - Password: `anything`
4. **Click Login**
5. New token generated and saved to localStorage
6. Redirected to Dashboard with fresh data

---

## 🚪 Using the Logout Button

### After You're Logged In:
1. Look at **top-right corner** of screen
2. Click the **LogOut icon** (arrow icon)
3. **Session cleared** automatically
4. **Redirected to login page**
5. Ready to login again with new credentials

### What Happens:
- ✅ Session removed from localStorage
- ✅ Dashboard data cleared
- ✅ UI resets to login page
- ✅ All components unmount cleanly

---

## 🔍 Verify Session State

### Check if Token Exists:
```javascript
// Open DevTools Console and run:
JSON.parse(localStorage.getItem("expense_tracker_session"));
```

**Expected Output:**
- **Before Login:** `null`
- **After Login:** 
```javascript
{
  email: "user@example.com",
  token: "eyJhbGciOiJIUzI1NiIs...",
  user: { id: "uuid-string", email: "user@example.com", name: "John Doe" },
  expiresAt: 1751900000000
}
```

### Check Token Age:
```javascript
// Open DevTools Console and run:
const session = JSON.parse(localStorage.getItem("expense_tracker_session"));
const now = Date.now();
const expiresIn = Math.round((session.expiresAt - now) / 1000 / 60 / 60 / 24);
console.log(`Token expires in ${expiresIn} days`);
```

---

## 🎯 Quick Checklist

### To Test Logout Flow:

- [ ] App is running and logged in
- [ ] Dashboard data is visible
- [ ] Click LogOut button (top-right)
- [ ] UI immediately shows Login Page
- [ ] localStorage is cleared (verify in DevTools)
- [ ] Enter login credentials again
- [ ] New token is generated
- [ ] Dashboard loads with fresh data

### To Test Manual Clear:

- [ ] Open DevTools (F12)
- [ ] Go to Application → Local Storage
- [ ] Delete `expense_tracker_session`
- [ ] Refresh page (F5)
- [ ] Login page appears
- [ ] Login works normally

---

## 📝 Session Details

**Session Key:** `expense_tracker_session`  
**Session Duration:** 100 days (from creation)  
**Storage:** Browser localStorage  
**Auto-Expiry:** Yes (removed on next check if expired)  
**Logout Method:** Manual click on LogOut button  

---

## 💡 Tips

- ⏰ Token expires in **100 days** from login
- 🔄 Logout can be triggered from **any page** in the app
- 🔐 Token only sent to **authenticated endpoints** (`/api/users/:userId/...`)
- 📱 Works on **desktop, tablet, mobile**
- 🌙 Logout button visible in both **light and dark mode**

**Ready to test? Try clicking the LogOut button now!** 🚀
