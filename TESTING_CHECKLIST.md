# ✅ SafeRoad AI Testing Checklist

Use this checklist to verify all features are working correctly.

## 🔧 Pre-Setup Verification

### System Requirements
- [ ] Node.js v16+ installed: `node --version`
- [ ] PostgreSQL v12+ installed: `psql --version`
- [ ] PostGIS extension available
- [ ] Python 3.8+ installed (for ML): `python --version`

### Environment Setup
- [ ] Backend dependencies installed: `cd server && npm install`
- [ ] Frontend dependencies installed: `npm install`
- [ ] Python dependencies installed: `pip install -r server/requirements.txt`
- [ ] .env file exists in server/
- [ ] Environment variables configured correctly

## 🗄️ Database Setup

### Initialization
- [ ] PostgreSQL service is running
- [ ] Database created: Run `npm run init-db`
- [ ] No errors during initialization
- [ ] All tables created successfully
- [ ] Seed data loaded

### Verification
- [ ] Run setup check: `cd server && npm run check-setup`
- [ ] ✅ Database connected successfully
- [ ] ✅ All required tables exist
- [ ] ✅ PostGIS extension enabled
- [ ] ✅ Admin accounts exist

### Data Check
- [ ] Users table has data
- [ ] Damage reports table has seed data
- [ ] RQI segments exist
- [ ] Work orders exist
- [ ] Notifications exist

## 👥 Admin Accounts

### Garv Account
- [ ] Account exists in database
- [ ] Email: `garv@saferoad.ai`
- [ ] Password: `garv@admin2026`
- [ ] Role: `admin`
- [ ] Status: `Active`

### Mihir Account
- [ ] Account exists in database
- [ ] Email: `mihir@saferoad.ai`
- [ ] Password: `mihir@admin2026`
- [ ] Role: `admin`
- [ ] Status: `Active`

### Verification
- [ ] Run admin creation: `npm run create-admins`
- [ ] Both accounts created/updated successfully
- [ ] Credentials displayed in console

## 🚀 Server Startup

### Backend Server
- [ ] Server starts without errors: `cd server && npm run dev`
- [ ] Listens on port 5000
- [ ] Database connection successful
- [ ] PostGIS extension loaded
- [ ] No console errors

### Health Check
- [ ] Access http://localhost:5000/api/health
- [ ] Response status: 200
- [ ] Response includes:
  - `status: "online"`
  - `service: "SafeRoad AI..."`
  - `database: "PostgreSQL + PostGIS"`

### Frontend Server
- [ ] Server starts: `npm run dev`
- [ ] Listens on port 5173
- [ ] Vite dev server running
- [ ] No build errors

## 🔐 Authentication Testing

### Manual Login (UI)
- [ ] Navigate to http://localhost:5173
- [ ] Click "Login" or navigate to login page
- [ ] Enter Garv's credentials
- [ ] Login successful
- [ ] Redirected to dashboard
- [ ] User menu shows "Garv Patel"
- [ ] Admin features visible

### Logout
- [ ] Click logout button
- [ ] Redirected to home/login
- [ ] Token removed from localStorage
- [ ] Admin features hidden

### Login as Mihir
- [ ] Enter Mihir's credentials
- [ ] Login successful
- [ ] Dashboard shows correct user
- [ ] Admin features visible

### Register New User
- [ ] Navigate to register page
- [ ] Fill in:
  - Name: "Test User"
  - Email: "test@example.com"
  - Password: "test123456"
- [ ] Registration successful
- [ ] Automatically logged in
- [ ] User role = "user" (not admin)

### API Testing (cURL/Script)
- [ ] Run test script: `cd server && npm run test-auth`
- [ ] Garv login test passes
- [ ] Mihir login test passes
- [ ] Profile retrieval works
- [ ] Registration works
- [ ] Invalid login fails correctly

### Token Validation
- [ ] Login and get token
- [ ] Copy token from localStorage
- [ ] Make authenticated request
- [ ] Request succeeds with valid token
- [ ] Request fails with invalid token

## 🗺️ Map Features

### Map Display
- [ ] Navigate to Interactive Map page
- [ ] Map loads correctly
- [ ] Markers appear for reports
- [ ] Click marker shows popup
- [ ] Popup has correct information

### Heatmap
- [ ] Navigate to Road Heatmap page
- [ ] Heatmap layer displays
- [ ] High-density areas show intensity
- [ ] Legend displays correctly

### RQI Segments
- [ ] RQI segments display on map
- [ ] Color-coded by quality score
- [ ] Click shows segment details

## 📊 Dashboard Features

### User Dashboard
- [ ] Navigate to Dashboard
- [ ] Statistics cards display
- [ ] Charts render correctly
- [ ] Recent reports show
- [ ] Data updates

### Admin Dashboard
- [ ] Login as admin
- [ ] Navigate to Admin Dashboard
- [ ] User management table visible
- [ ] System statistics display
- [ ] Admin controls accessible

### Analytics Page
- [ ] Navigate to Analytics
- [ ] Charts render
- [ ] Filters work
- [ ] Data export (if available)
- [ ] Trends display correctly

## 📝 Report Management

### Create Report
- [ ] Navigate to Report Damage page
- [ ] Fill in form:
  - Type: Select type
  - Severity: Select severity
  - Description: Add text
  - Location: Add location
- [ ] Upload image (optional)
- [ ] Submit form
- [ ] Success message displays
- [ ] Report appears in list

### View Reports
- [ ] Navigate to My Reports
- [ ] List displays reports
- [ ] Filter by status works
- [ ] Filter by severity works
- [ ] Search works

### Update Report
- [ ] Click on a report
- [ ] Edit details
- [ ] Update status
- [ ] Save changes
- [ ] Changes reflect immediately

### Delete Report
- [ ] Select a report
- [ ] Click delete
- [ ] Confirm deletion
- [ ] Report removed from list

### Comments
- [ ] Open a report
- [ ] Add comment
- [ ] Comment appears
- [ ] Other users' comments visible

## 👨‍💼 Admin Features

### User Management
- [ ] Login as admin
- [ ] Navigate to Admin Dashboard
- [ ] View all users
- [ ] Edit user details
- [ ] Change user role
- [ ] Deactivate user
- [ ] Delete user (if permitted)

### Verification Queue
- [ ] Navigate to Road Verification
- [ ] View pending reports
- [ ] Review AI confidence
- [ ] Approve report
- [ ] Reject report with notes
- [ ] Status updates

### Work Orders
- [ ] Navigate to Repair Management
- [ ] View work orders
- [ ] Create new work order
- [ ] Assign crew
- [ ] Update progress
- [ ] Mark as completed
- [ ] Upload after images

## 🤖 AI Features

### Pothole Detection
- [ ] Navigate to AI Detection page
- [ ] Upload road image
- [ ] Processing starts
- [ ] Detection results display
- [ ] Confidence score shown
- [ ] Bounding boxes visible

### Model Testing (Backend)
- [ ] Run detection script
- [ ] Model loads successfully
- [ ] Processes test images
- [ ] Returns predictions
- [ ] Confidence scores accurate

## 🔔 Notifications

### View Notifications
- [ ] Login as user
- [ ] Navigate to Notifications
- [ ] List displays notifications
- [ ] Unread count shown
- [ ] Click notification

### Mark as Read
- [ ] Click on unread notification
- [ ] Marked as read
- [ ] Counter updates
- [ ] Notification style changes

## 🔒 Security Testing

### Protected Routes
- [ ] Logout
- [ ] Try to access dashboard
- [ ] Redirected to login
- [ ] Login required message

### Admin Routes
- [ ] Login as regular user
- [ ] Try to access admin panel
- [ ] Access denied
- [ ] Error message shown

### Token Expiration
- [ ] Login and get token
- [ ] Wait or manually expire token
- [ ] Make authenticated request
- [ ] Token rejected
- [ ] Redirected to login

### SQL Injection Prevention
- [ ] Try login with SQL injection
  - Email: `' OR '1'='1`
  - Password: `anything`
- [ ] Login fails
- [ ] No database error
- [ ] Secure error message

## 📱 Responsive Design

### Desktop
- [ ] Full navigation visible
- [ ] All features accessible
- [ ] Layout looks good
- [ ] No horizontal scroll

### Tablet
- [ ] Layout adapts
- [ ] Navigation works
- [ ] Forms usable
- [ ] Maps display correctly

### Mobile
- [ ] Mobile menu works
- [ ] Forms are accessible
- [ ] Maps zoom/pan works
- [ ] Text is readable

## ⚡ Performance

### Page Load
- [ ] Initial page loads < 3 seconds
- [ ] Subsequent pages load < 1 second
- [ ] No console errors
- [ ] No 404 errors

### API Response
- [ ] Login responds < 1 second
- [ ] Report list loads < 2 seconds
- [ ] Map loads < 3 seconds
- [ ] No timeout errors

### Database Queries
- [ ] Queries execute quickly
- [ ] No slow query warnings
- [ ] Indexes being used
- [ ] Connection pool working

## 🐛 Error Handling

### Network Errors
- [ ] Stop backend server
- [ ] Try to login from frontend
- [ ] Graceful error message
- [ ] Falls back to mock data (if configured)

### Invalid Input
- [ ] Submit empty form
- [ ] Validation errors show
- [ ] Clear error messages
- [ ] No page crash

### 404 Routes
- [ ] Navigate to invalid URL
- [ ] 404 page displays
- [ ] Can navigate back
- [ ] No console errors

## 📊 Data Integrity

### Create Operations
- [ ] Data saved correctly
- [ ] Relationships maintained
- [ ] Timestamps accurate
- [ ] Defaults applied

### Update Operations
- [ ] Changes persist
- [ ] Updated timestamps
- [ ] Related data updates
- [ ] No orphaned records

### Delete Operations
- [ ] Records deleted
- [ ] Cascades work (if configured)
- [ ] No foreign key errors
- [ ] Soft delete (if implemented)

## 🔄 Integration Testing

### End-to-End Flows

#### Report Lifecycle
1. [ ] User registers
2. [ ] User logs in
3. [ ] User creates report
4. [ ] Report appears on map
5. [ ] Admin reviews report
6. [ ] Admin approves report
7. [ ] Admin creates work order
8. [ ] Work order completed
9. [ ] Report marked resolved

#### User Management
1. [ ] Admin logs in
2. [ ] Admin views users
3. [ ] Admin creates user
4. [ ] New user logs in
5. [ ] User updates profile
6. [ ] Admin changes user role
7. [ ] Role change reflects

## 📈 Final Verification

### Overall System
- [ ] All pages accessible
- [ ] No console errors
- [ ] No 500 errors
- [ ] All features work
- [ ] Data persists
- [ ] Logout works
- [ ] Login works

### Documentation
- [ ] README.md accurate
- [ ] API docs match endpoints
- [ ] Setup guide works
- [ ] Quick start guide tested

### Deployment Ready
- [ ] Environment variables set
- [ ] Database optimized
- [ ] Security measures active
- [ ] Error logging configured
- [ ] Backup strategy in place

---

## ✅ Sign-Off

**Tested by:** _________________  
**Date:** _________________  
**Version:** _________________  

**Overall Status:**
- [ ] ✅ All tests passed - Ready for production
- [ ] ⚠️ Minor issues - Ready with notes
- [ ] ❌ Major issues - Not ready

**Notes:**
```
_______________________________________________________
_______________________________________________________
_______________________________________________________
```

---

## 🎯 Quick Test Commands

```bash
# Check setup
cd server && npm run check-setup

# Test authentication
npm run test-auth

# Health check
curl http://localhost:5000/api/health

# Login test
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"garv@saferoad.ai","password":"garv@admin2026"}'

# Get reports
curl http://localhost:5000/api/reports

# Database check
psql -U postgres -d saferoad_db -c "SELECT COUNT(*) FROM users;"
```
