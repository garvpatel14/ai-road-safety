# SafeRoad AI Backend

Real authentication backend with PostgreSQL, PostGIS, and Express.

## Setup Instructions

### 1. Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- PostGIS extension for PostgreSQL

### 2. Install Dependencies
```bash
cd server
npm install
```

### 3. Configure Environment
The `.env` file is already configured with database credentials:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=garvpatel@14
DB_NAME=saferoad_db
JWT_SECRET=saferoad_ai_super_secret_jwt_key_2026
NODE_ENV=development
```

### 4. Initialize Database
```bash
npm run init-db
```
This creates the database, tables, and seeds initial data including admin accounts.

### 5. Create/Update Admin Accounts
```bash
npm run create-admins
```
This creates or updates admin accounts for Garv and Mihir.

### 6. Start Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server runs on `http://localhost:5000`

## Admin Credentials

### Garv Patel (Admin)
- **Email:** `garv@saferoad.ai`
- **Password:** `garv@admin2026`
- **Role:** admin

### Mihir Shah (Admin)
- **Email:** `mihir@saferoad.ai`
- **Password:** `mihir@admin2026`
- **Role:** admin

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "garv@saferoad.ai",
  "password": "garv@admin2026"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "USR-GARV",
    "name": "Garv Patel",
    "email": "garv@saferoad.ai",
    "role": "admin",
    "status": "Active"
  }
}
```

#### Get Profile (Protected)
```
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

### Protected Routes
All protected routes require the `Authorization: Bearer <token>` header.

Admin-only routes require the user to have `role: 'admin'`.

## Database Schema

### Users Table
- `id` - Unique user identifier
- `name` - User's full name
- `email` - Unique email address
- `password` - Bcrypt hashed password
- `role` - User role ('user' or 'admin')
- `status` - Account status
- `reports_submitted` - Number of reports submitted
- `avatar` - Profile picture URL
- `created_at` - Account creation timestamp

### Other Tables
- `damage_reports` - Road damage reports with PostGIS geometry
- `rqi_segments` - Road Quality Index segments with LineString geometry
- `work_orders` - Repair work orders
- `verification_queue` - Reports pending verification
- `notifications` - User notifications
- `gps_telemetry_logs` - GPS tracking data
- `report_comments` - Comments on reports

## Security Features

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ Protected routes with authentication middleware
- ✅ Admin-only routes with role-based access control
- ✅ SQL injection prevention with parameterized queries
- ✅ Environment variables for sensitive data

## Testing Authentication

### Using cURL

**Login as Garv:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"garv@saferoad.ai","password":"garv@admin2026"}'
```

**Register New User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

**Get Profile:**
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify credentials in `.env` file
- Check if database exists: `psql -U postgres -l`

### PostGIS Extension Not Found
- Install PostGIS: `sudo apt-get install postgresql-postgis` (Linux)
- Or download from [PostGIS website](https://postgis.net/install/)

### Port Already in Use
- Change `PORT` in `.env` file
- Or stop the process using port 5000: `lsof -ti:5000 | xargs kill`

## Development Notes

- The backend is fully functional with real database operations
- All routes use proper error handling
- JWT tokens are validated on protected routes
- Admin middleware restricts access to admin-only endpoints
- PostGIS enables spatial queries for map features
