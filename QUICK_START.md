# 🚀 Quick Start Guide - SafeRoad AI

## Start the Application in 3 Steps

### Step 1: Setup Backend
```bash
cd server
npm install
npm run init-db
npm run create-admins
```

### Step 2: Verify Setup
```bash
npm run check-setup
```

You should see:
```
✅ Database connected successfully
✅ All required tables exist
✅ Garv admin account exists
✅ Mihir admin account exists
Setup Status: ✅ READY
```

### Step 3: Start Servers
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## 🔑 Login Credentials

### Garv (Admin)
- Email: `garv@saferoad.ai`
- Password: `garv@admin2026`

### Mihir (Admin)
- Email: `mihir@saferoad.ai`
- Password: `mihir@admin2026`

## ✅ Quick Test

Test authentication from command line:
```bash
cd server
npm run test-auth
```

Or test with cURL:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"garv@saferoad.ai","password":"garv@admin2026"}'
```

## 🌐 Access URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

## 🛠️ Troubleshooting

### Backend won't start?
```bash
# Check if PostgreSQL is running
psql -U postgres -l

# Verify database exists
npm run check-setup

# Reinitialize if needed
npm run init-db
```

### Can't login?
1. Check backend is running: `http://localhost:5000/api/health`
2. Verify credentials (see above)
3. Check browser console for errors
4. Run: `npm run check-setup`

### Port already in use?
```bash
# Change PORT in server/.env
PORT=5001

# Or kill existing process
lsof -ti:5000 | xargs kill -9
```

## 📚 Need More Help?

- **Full Setup Guide:** See `BACKEND_SETUP.md`
- **Implementation Details:** See `AUTHENTICATION_IMPLEMENTATION.md`
- **Backend Docs:** See `server/README.md`

## 🎯 What's Ready

✅ Real PostgreSQL database with PostGIS  
✅ Secure authentication (bcrypt + JWT)  
✅ Admin accounts for Garv and Mihir  
✅ Role-based access control  
✅ Full REST API endpoints  
✅ Frontend integrated with backend  
✅ Mock data fallback for offline dev  

Start coding! 🚀
