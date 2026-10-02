# 📡 SafeRoad AI API Documentation

Base URL: `http://localhost:5000/api`

## 🔐 Authentication Endpoints

### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "USR-1234",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "status": "Active",
    "reports_submitted": 0,
    "avatar": "https://..."
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "garv@saferoad.ai",
  "password": "garv@admin2026"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "USR-GARV",
    "name": "Garv Patel",
    "email": "garv@saferoad.ai",
    "role": "admin",
    "status": "Active",
    "reports_submitted": 127,
    "avatar": "https://..."
  }
}
```

**Error (400):**
```json
{
  "error": "Invalid email or password"
}
```

### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": "USR-GARV",
    "name": "Garv Patel",
    "email": "garv@saferoad.ai",
    "role": "admin",
    "status": "Active",
    "reports_submitted": 127,
    "avatar": "https://...",
    "created_at": "2026-01-15T10:30:00Z"
  }
}
```

## 🚨 Reports Endpoints

### Get All Reports
```http
GET /api/reports
Authorization: Bearer <token> (optional)
```

**Query Parameters:**
- `status` - Filter by status (Pending, Under Review, Scheduled, In Progress, Resolved)
- `severity` - Filter by severity (Low, Medium, High, Critical)
- `type` - Filter by type (Pothole, Crack, Accident, Repair, Erosion)
- `limit` - Number of results (default: 50)
- `offset` - Pagination offset

**Response (200):**
```json
{
  "reports": [
    {
      "id": "REP-1001",
      "type": "Pothole",
      "severity": "High",
      "status": "Pending",
      "description": "Deep pothole...",
      "location_name": "Main St & 4th Ave",
      "lat": 37.7749,
      "lng": -122.4194,
      "date": "2026-07-30",
      "time": "14:22",
      "image": "https://...",
      "reported_by": "Alex Morgan",
      "ai_confidence": "98%",
      "upvotes": 24,
      "priority_score": 88
    }
  ],
  "total": 150
}
```

### Create Report
```http
POST /api/reports
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "Pothole",
  "severity": "High",
  "description": "Large pothole causing damage",
  "location_name": "Main Street",
  "lat": 37.7749,
  "lng": -122.4194,
  "image": "data:image/jpeg;base64,..."
}
```

### Get Single Report
```http
GET /api/reports/:id
Authorization: Bearer <token> (optional)
```

### Update Report
```http
PUT /api/reports/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "In Progress",
  "severity": "Critical"
}
```

### Delete Report
```http
DELETE /api/reports/:id
Authorization: Bearer <token>
```

### Add Comment to Report
```http
POST /api/reports/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "This needs urgent attention!"
}
```

### Upvote Report
```http
POST /api/reports/:id/upvote
Authorization: Bearer <token>
```

## 🗺️ Map Endpoints

### Get Reports for Map
```http
GET /api/map/reports
```

**Query Parameters:**
- `bounds` - Map bounds (lat1,lng1,lat2,lng2)
- `severity` - Filter by severity
- `status` - Filter by status

**Response (200):**
```json
{
  "reports": [
    {
      "id": "REP-1001",
      "type": "Pothole",
      "severity": "High",
      "lat": 37.7749,
      "lng": -122.4194,
      "status": "Pending"
    }
  ]
}
```

### Get Heatmap Data
```http
GET /api/map/heatmap
```

**Response (200):**
```json
{
  "points": [
    {
      "lat": 37.7749,
      "lng": -122.4194,
      "intensity": 0.95
    }
  ]
}
```

### Get RQI Segments
```http
GET /api/map/rqi-segments
```

**Response (200):**
```json
{
  "segments": [
    {
      "id": "RQI-1",
      "name": "Downtown Market St Corridor",
      "rqi_score": 38,
      "status": "Poor",
      "coordinates": [
        [37.7749, -122.4194],
        [37.7780, -122.4120]
      ]
    }
  ]
}
```

## 👥 Admin Endpoints
*(Requires `role: admin`)*

### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "users": [
    {
      "id": "USR-GARV",
      "name": "Garv Patel",
      "email": "garv@saferoad.ai",
      "role": "admin",
      "status": "Active",
      "reports_submitted": 127,
      "created_at": "2026-01-15T10:30:00Z"
    }
  ],
  "total": 50
}
```

### Update User
```http
PUT /api/admin/users/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role": "admin",
  "status": "Active"
}
```

### Delete User
```http
DELETE /api/admin/users/:id
Authorization: Bearer <admin_token>
```

### Get System Statistics
```http
GET /api/admin/stats
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "total_users": 1250,
  "total_reports": 3420,
  "pending_reports": 87,
  "active_work_orders": 23,
  "reports_today": 45,
  "new_users_today": 12
}
```

## 📊 Analytics Endpoints

### Get Dashboard Statistics
```http
GET /api/analytics/dashboard
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "total_reports": 3420,
  "pending_reports": 87,
  "resolved_reports": 2890,
  "critical_reports": 12,
  "reports_by_type": {
    "Pothole": 1820,
    "Crack": 890,
    "Accident": 340,
    "Erosion": 370
  },
  "reports_by_severity": {
    "Low": 1200,
    "Medium": 1500,
    "High": 620,
    "Critical": 100
  }
}
```

### Get Trend Data
```http
GET /api/analytics/trends
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` - Time period (7days, 30days, 90days, 1year)
- `metric` - Metric to analyze (reports, severity, type)

**Response (200):**
```json
{
  "period": "30days",
  "data": [
    {
      "date": "2026-07-01",
      "count": 42
    },
    {
      "date": "2026-07-02",
      "count": 38
    }
  ]
}
```

## 🔔 Notifications Endpoints

### Get User Notifications
```http
GET /api/notifications
Authorization: Bearer <token>
```

**Query Parameters:**
- `read` - Filter by read status (true/false)
- `type` - Filter by type (system, warning, accident, repair)

**Response (200):**
```json
{
  "notifications": [
    {
      "id": "NOT-1",
      "title": "Repair Completed",
      "message": "Work crew completed asphalt patching...",
      "time": "10 mins ago",
      "type": "repair",
      "read": false,
      "created_at": "2026-07-30T14:00:00Z"
    }
  ],
  "unread_count": 5
}
```

### Mark Notification as Read
```http
PUT /api/notifications/:id/read
Authorization: Bearer <token>
```

## 🛠️ Work Orders Endpoints

### Get Work Orders
```http
GET /api/work-orders
Authorization: Bearer <token>
```

### Create Work Order
```http
POST /api/work-orders
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "report_id": "REP-1001",
  "title": "Emergency Pothole Patching",
  "crew_assigned": "Alpha Crew #4",
  "contractor": "Apex Infrastructure Ltd.",
  "estimated_cost": "$3,800",
  "start_date": "2026-08-12",
  "completion_target": "2026-08-14"
}
```

### Update Work Order Progress
```http
PUT /api/work-orders/:id/progress
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "progress_pct": 65,
  "status": "In Progress"
}
```

## 🔍 Verification Queue Endpoints
*(Admin only)*

### Get Verification Queue
```http
GET /api/verification/queue
Authorization: Bearer <admin_token>
```

### Update Verification Status
```http
PUT /api/verification/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "officer_status": "Verified",
  "inspection_notes": "Confirmed high severity..."
}
```

## 🏥 Health Check

### Server Health
```http
GET /api/health
```

**Response (200):**
```json
{
  "status": "online",
  "service": "SafeRoad AI Intelligence Platform API",
  "database": "PostgreSQL + PostGIS",
  "timestamp": "2026-07-30T14:30:00.000Z"
}
```

## 🔒 Authorization Headers

All protected endpoints require JWT token:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Admin endpoints additionally require `role: admin` in token payload.

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided, authorization denied"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied: Admin role required"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Server error during operation"
}
```

## 📝 Testing Examples

### cURL Examples

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"garv@saferoad.ai","password":"garv@admin2026"}'
```

**Get Reports:**
```bash
curl http://localhost:5000/api/reports?severity=High&limit=10
```

**Create Report (with token):**
```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "type":"Pothole",
    "severity":"High",
    "description":"Large pothole",
    "location_name":"Main St",
    "lat":37.7749,
    "lng":-122.4194
  }'
```

### JavaScript/Axios Examples

**Login:**
```javascript
const response = await axios.post('http://localhost:5000/api/auth/login', {
  email: 'garv@saferoad.ai',
  password: 'garv@admin2026'
});

const { token, user } = response.data;
localStorage.setItem('token', token);
```

**Get Profile:**
```javascript
const token = localStorage.getItem('token');
const response = await axios.get('http://localhost:5000/api/auth/profile', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

**Create Report:**
```javascript
const response = await axios.post('http://localhost:5000/api/reports', {
  type: 'Pothole',
  severity: 'High',
  description: 'Large pothole causing damage',
  location_name: 'Main Street',
  lat: 37.7749,
  lng: -122.4194
}, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

## 🔗 Rate Limits

No rate limiting currently implemented for development.
Production deployment should implement:
- 100 requests/minute per IP for anonymous endpoints
- 500 requests/minute per user for authenticated endpoints
- 1000 requests/minute for admin users

---

**Need help?** Check `server/README.md` or `BACKEND_SETUP.md`
