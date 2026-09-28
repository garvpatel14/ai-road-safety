# 🚀 SafeRoad AI Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Initialize Database
Make sure PostgreSQL is running, then:
```bash
npm run init-db
```

### 3. Create Admin Accounts
```bash
npm run create-admins
```

### 4. Start Backend Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## 🔑 Admin Login Credentials

### Garv Patel (Admin)
- **Email:** `garv@saferoad.ai`
- **Password:** `garv@admin2026`

### Mihir Shah (Admin)
- **Email:** `mihir@saferoad.ai`  
- **Password:** `mihir@admin2026`

## 🧪 Testing Authentication

### Option 1: Using the test script
```bash
cd server
node test-auth.js
```

### Option 2: Manual API testing

**Login as Garv:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"garv@saferoad.ai","password":"garv@admin2026"}'
```

**Login as Mihir:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mihir@saferoad.ai","password":"mihir@admin2026"}'
```

**Register New User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "password":"password123"
  }'
```

## 📡 Available API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/profile` - Get current user profile (requires auth)

### Reports
- `GET /api/reports` - Get all damage reports
- `POST /api/reports` - Create new report (requires auth)
- `GET /api/reports/:id` - Get specific report
- `PUT /api/reports/:id` - Update report (requires auth)
- `DELETE /api/reports/:id` - Delete report (requires auth)

### Admin (Admin role required)
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get system statistics

### Map
- `GET /api/map/reports` - Get reports for map display
- `GET /api/map/heatmap` - Get heatmap data
- `GET /api/map/rqi-segments` - Get road quality segments

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/trends` - Get trend data

## 🔒 Security Features

✅ **Password Hashing** - Bcrypt with 10 rounds  
✅ **JWT Authentication** - 7-day token expiration  
✅ **Role-Based Access** - Admin and user roles  
✅ **SQL Injection Prevention** - Parameterized queries  
✅ **CORS Enabled** - Secure cross-origin requests  
✅ **Environment Variables** - Sensitive data protection  

## 🗄️ Database Structure

The backend uses PostgreSQL with PostGIS extension for spatial data:

- **users** - User accounts with authentication
- **damage_reports** - Road damage reports with GPS coordinates
- **rqi_segments** - Road Quality Index segments
- **work_orders** - Repair work orders
- **verification_queue** - AI reports pending verification
- **notifications** - User notifications
- **gps_telemetry_logs** - GPS tracking data
- **report_comments** - Comments on reports

## 🛠️ Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check credentials in `server/.env`
- Verify database exists: `psql -U postgres -l`

### Port Already in Use
- Change `PORT` in `server/.env`
- Or kill process: `lsof -ti:5000 | xargs kill -9`

### PostGIS Extension Error
- Install PostGIS for your system
- Ubuntu: `sudo apt-get install postgresql-postgis`
- Mac: `brew install postgis`
- Windows: Download from postgis.net

## 📝 Environment Variables

Located in `server/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=garvpatel@14
DB_NAME=saferoad_db
JWT_SECRET=saferoad_ai_super_secret_jwt_key_2026
NODE_ENV=development
```

## 🎯 Next Steps

1. ✅ Backend is ready with real authentication
2. Update frontend to use real API endpoints
3. Test login/register functionality from UI
4. Configure environment variables for production
5. Set up HTTPS for production deployment

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PostGIS Documentation](https://postgis.net/documentation/)
- [JWT.io](https://jwt.io/) - JWT debugger
- [Bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
