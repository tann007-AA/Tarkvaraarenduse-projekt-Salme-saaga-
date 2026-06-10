# Quick Start: Testing Authentication

## Prerequisites

✅ Node.js installed
✅ Backend and frontend dependencies installed
✅ Database configured and running

## Start Everything

### Terminal 1: Backend
```bash
cd apps/backend
npm run start:dev
```

### Terminal 2: Frontend
```bash
cd apps/frontend
npm run dev
```

## Test Flow (7 Minutes)

### 1️⃣ Register New User (1 min)
1. Open browser → `http://localhost:5173`
2. Click **"Play"** button
3. Click **"Register"** tab
4. Fill in:
   - Email: `viking@test.com`
   - Username: `vikingwarrior`
   - Full Name: `Erik the Red`
   - Password: `password123`
   - Confirm: `password123`
5. Click **"Create Account"**
6. ✅ Should redirect to game intro

### 2️⃣ Test Logout (30 sec)
1. Return to main menu
2. Look for username in top-right corner
3. Click the red **logout** icon
4. ✅ Should be logged out

### 3️⃣ Test Login (1 min)
1. Click **"Play"** button again
2. Click **"Sign In"** tab
3. Enter:
   - Email: `viking@test.com`
   - Password: `password123`
   - ✅ Check **"Remember me"**
4. Click **"Sign In"**
5. ✅ Should be logged in

### 4️⃣ Test Session Persistence (1 min)
1. Close browser completely
2. Reopen browser → `http://localhost:5173`
3. ✅ Should still be logged in (auto-login)

### 5️⃣ Test School Mode (1 min)
1. Logout if logged in
2. Click **"Play"** button
3. Click **"School"** tab
4. Enter:
   - Viking Name: `Ragnar`
   - Room Code: `ROOM123` (optional)
5. Click **"Start Playing"**
6. ✅ Should start game without authentication

### 6️⃣ Test API Endpoints (1 min)
Open browser DevTools → Network tab:
- ✅ See `POST /auth/login` on login
- ✅ See `GET /auth/me` on app load
- ✅ See `POST /auth/logout` on logout
- ✅ NO API calls in School mode

## Verify in Database

Check that user was created:
```bash
# PostgreSQL
psql -d your_database -c "SELECT email, username, name FROM users;"

# Or use Prisma Studio
cd apps/backend
npx prisma studio
```

## Common Issues

| Problem | Solution |
|---------|----------|
| Backend won't start | Check if port 3000 is available |
| Frontend won't start | Run `npm install` in apps/frontend |
| CORS error | Verify backend CORS is enabled |
| Login fails | Check backend logs for errors |
| User not showing | Check browser localStorage |

## API Endpoints Available

```bash
# Register
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "username": "testuser",
  "name": "Test User",
  "password": "password123"
}

# Login
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "rememberMe": true
}

# Get current user (requires token)
GET http://localhost:3000/auth/me
Authorization: Bearer <your-access-token>

# Logout (requires token)
POST http://localhost:3000/auth/logout
Authorization: Bearer <your-access-token>
```

## Browser DevTools Checklist

### localStorage (Application → Storage → Local Storage)
Should contain:
- ✅ `accessToken`: JWT string
- ✅ `refreshToken`: JWT string

### Network Requests
Should see:
- ✅ `POST /auth/register` → Status 201
- ✅ `POST /auth/login` → Status 200
- ✅ `GET /auth/me` → Status 200
- ✅ `POST /auth/logout` → Status 200

### Console
Should NOT see:
- ❌ CORS errors
- ❌ Network errors
- ❌ Authentication errors

## API Documentation

Full API docs available at:
```
http://localhost:3000/docs
```

## Success Indicators

✅ User can register
✅ User can login
✅ User can logout
✅ User info displays in UI
✅ Sessions persist across browser restarts
✅ No console errors
✅ Network requests succeed

## Next Steps

Once basic auth works:
1. Test with multiple users
2. Test password validation
3. Test duplicate email handling
4. Test token expiration
5. Add game save integration
6. Add score tracking

## Need Help?

1. Check `AUTHENTICATION_GUIDE.md` for detailed info
2. Check `AUTH_FLOW.md` for visual diagrams
3. Check `apps/frontend/AUTH_SETUP.md` for technical details
4. Check backend logs for API errors
5. Check browser console for frontend errors

## Screenshots Locations

Example of what you should see:

**Main Menu with User:**
- Username badge in top-right
- Logout button next to username

**Login Modal:**
- Two tabs: "Sign In" and "Register"
- Email, password fields (Sign In)
- Email, username, name, password fields (Register)
- Error messages if something fails

**After Successful Login:**
- Redirected to game intro screen
- Username visible in main menu
