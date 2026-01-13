# Military Asset Management System - Backend

## 📋 Prerequisites
- Node.js v16+ installed
- MongoDB installed locally OR MongoDB Atlas account
- Postman/Insomnia (for testing APIs)

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/military_asset_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
Replace `MONGODB_URI` with:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/military_asset_db
```

### 3. Run the Application

**Development Mode (with auto-restart):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

### 4. Seed Database (Optional - Recommended)
```bash
npm run seed
```

This creates sample data:
- 3 Bases (Fort Alpha, Bravo, Charlie)
- 4 Users (Admin, 2 Commanders, 1 Logistics Officer)
- 5 Assets
- Sample Purchases, Transfers, Assignments

## 🔐 Test Credentials (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@military.gov | admin123 |
| Base Commander (Alpha) | commander.alpha@military.gov | password123 |
| Base Commander (Bravo) | commander.bravo@military.gov | password123 |
| Logistics Officer | logistics@military.gov | password123 |

## 📡 API Endpoints

### Authentication
```
POST /api/auth/login
GET  /api/auth/me (Protected)
```

### Dashboard
```
GET /api/dashboard (Protected)
GET /api/dashboard/movements (Protected)
```

### Purchases
```
GET  /api/purchases (Protected)
POST /api/purchases (Protected - Admin, Commander, Logistics)
GET  /api/purchases/:id (Protected)
```

### Transfers
```
GET  /api/transfers (Protected)
POST /api/transfers (Protected - Admin, Commander, Logistics)
GET  /api/transfers/:id (Protected)
```

### Assignments & Expenditures
```
GET  /api/assignments (Protected)
POST /api/assignments (Protected - Admin, Commander)
PUT  /api/assignments/:id/return (Protected - Admin, Commander)

GET  /api/assignments/expenditures (Protected)
POST /api/assignments/expenditures (Protected - Admin, Commander)
```

## 🧪 Testing APIs with Postman

### 1. Login
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "admin@military.gov",
  "password": "admin123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {...}
}
```

### 2. Use Token for Protected Routes
Add to Headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### 3. Create Purchase Example
```
POST http://localhost:5000/api/purchases
Headers:
  Authorization: Bearer YOUR_TOKEN

Body (JSON):
{
  "assetId": "ASSET_ID_FROM_DATABASE",
  "baseId": "BASE_ID_FROM_DATABASE",
  "quantity": 10,
  "notes": "New procurement"
}
```

## 🗂️ Database Schema

### Collections:
- **users** - User accounts with roles
- **bases** - Military bases
- **assets** - Equipment/weapons inventory
- **purchases** - Purchase records
- **transfers** - Inter-base transfers
- **assignments** - Personnel assignments
- **expenditures** - Asset expenditure records
- **auditlogs** - Audit trail for all operations

## 🔒 Role-Based Access Control (RBAC)

### Roles:
1. **Admin** - Full access to all bases and operations
2. **Base Commander** - Access only to assigned base data
3. **Logistics Officer** - Limited access (purchases, transfers)

### Access Matrix:

| Feature | Admin | Base Commander | Logistics Officer |
|---------|-------|----------------|-------------------|
| View Dashboard | All Bases | Assigned Base | Assigned Base |
| Create Purchase | ✅ | ✅ | ✅ |
| Create Transfer | ✅ | ✅ | ✅ |
| Create Assignment | ✅ | ✅ | ❌ |
| Create Expenditure | ✅ | ✅ | ❌ |

## 📊 Query Parameters

### Dashboard & Lists
```
?baseId=XXXXX          - Filter by base
?equipmentType=weapon  - Filter by equipment type
?startDate=2025-01-01  - Filter from date
?endDate=2025-01-31    - Filter to date
?status=active         - Filter by status
```
