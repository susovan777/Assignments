# Military Asset Management System
## Complete Project Documentation

**Project Name:** Military Asset Management System  
**Developer:** Susovan Sahoo    
**Submission Date:** January 13, 2026  
**Version:** 1.0.0

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Architecture](#2-tech-stack--architecture)
3. [Data Models / Schema](#3-data-models--schema)
4. [RBAC Explanation](#4-rbac-explanation)
5. [API Logging](#5-api-logging)
6. [Setup Instructions](#6-setup-instructions)
7. [API Endpoints](#7-api-endpoints)
8. [Login Credentials](#8-login-credentials)

---

## 1. Project Overview

### 1.1 Description

The Military Asset Management System is a full-stack web application designed to enable commanders and logistics personnel to manage the movement, assignment, and expenditure of critical military assets (such as vehicles, weapons, and ammunition) across multiple bases. The system provides transparency, streamlines logistics operations, and ensures accountability through comprehensive tracking and audit logging.

### 1.2 Key Features

- **Dashboard Analytics**: Real-time metrics showing opening balance, closing balance, net movement, assigned assets, and expended assets
- **Purchase Management**: Record and track asset purchases with complete history
- **Transfer Management**: Facilitate inter-base asset transfers with clear audit trails
- **Assignment Tracking**: Assign assets to personnel and track returns
- **Expenditure Recording**: Log asset consumption with reasons and timestamps
- **Role-Based Access Control**: Three-tier permission system (Admin, Base Commander, Logistics Officer)
- **Audit Logging**: Complete transaction history for compliance and accountability
- **Filtering & Search**: Filter data by date range, base, and equipment type

### 1.3 Assumptions

1. **Single Organization**: The system is designed for a single military organization managing multiple bases
2. **Pre-defined Bases**: Bases are created by administrators; regular users cannot create new bases
3. **Asset Uniqueness**: Assets are identified by name and type combination per base
4. **Immediate Transfers**: All approved transfers are completed immediately (no pending approval workflow)
5. **Personnel Identification**: Personnel are identified by name and ID (no separate personnel management system)
6. **Network Availability**: Users have reliable internet connectivity
7. **Browser Support**: Modern browsers (Chrome, Firefox, Edge, Safari) with JavaScript enabled

### 1.4 Limitations

1. **No Real-time Notifications**: The system does not include WebSocket-based real-time alerts
2. **No File Attachments**: Purchase receipts or transfer documents cannot be uploaded
3. **No Bulk Operations**: Assets must be processed individually (no bulk import/export)
4. **Basic Reporting**: No advanced analytics or custom report generation
5. **No Multi-tenancy**: Designed for single organization use only
6. **Limited Asset Details**: No support for asset condition, maintenance schedules, or detailed specifications
7. **No Approval Workflow**: Transfers and assignments are immediately completed without multi-level approval
8. **Manual Base/Asset Selection**: Create forms require manual ID entry (no dynamic dropdowns in current version)

### 1.5 Future Enhancements

- Real-time notifications using WebSockets
- Advanced reporting with PDF/Excel export
- Bulk import/export functionality
- Mobile application (iOS/Android)
- Asset condition tracking and maintenance scheduling
- Multi-level approval workflows
- Barcode/QR code scanning for asset tracking
- Integration with existing ERP systems

---

## 2. Tech Stack & Architecture

### 2.1 Technology Stack

#### Backend
- **Runtime**: Node.js v16+
- **Framework**: Express.js v4.18
- **Database**: MongoDB v8.0
- **ODM**: Mongoose v8.0
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **Security**: Helmet.js (security headers)
- **Logging**: Morgan (HTTP request logging)
- **CORS**: CORS middleware

#### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5.0
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS 3.4
- **Charts**: Recharts 2.10
- **Icons**: Lucide React 0.263
- **State Management**: React Context API

#### Development Tools
- **Package Manager**: npm
- **Version Control**: Git
- **Code Editor**: VS Code (recommended)
- **API Testing**: Postman/Insomnia

### 2.2 Architecture Overview

The application follows a **three-tier architecture**:

```
┌─────────────────────────────────────────────────────┐
│                   Presentation Layer                │
│              (React Frontend - Port 3000)           │
│  - User Interface                                   │
│  - Client-side routing                              │
│  - JWT token management                             │
└─────────────────┬───────────────────────────────────┘
                  │ HTTP/REST API
                  │ (JSON)
┌─────────────────▼───────────────────────────────────┐
│                  Application Layer                  │
│             (Express Backend - Port 5000)           │
│  - RESTful API endpoints                            │
│  - Business logic                                   │
│  - Authentication & Authorization                   │
│  - Request validation                               │
└─────────────────┬───────────────────────────────────┘
                  │ Mongoose ODM
                  │
┌─────────────────▼───────────────────────────────────┐
│                    Data Layer                       │
│              (MongoDB Database)                     │
│  - Document storage                                 │
│  - Data persistence                                 │
│  - Indexing & queries                               │
└─────────────────────────────────────────────────────┘
```

### 2.3 Design Patterns Used

1. **MVC Pattern**: Model-View-Controller separation
   - Models: Mongoose schemas
   - Controllers: Business logic handlers
   - Views: React components

2. **Repository Pattern**: Data access abstraction through Mongoose models

3. **Middleware Pattern**: Express middleware for authentication, logging, and error handling

4. **Context Pattern**: React Context API for global state management

5. **HOC Pattern**: Protected route wrapper components

### 2.4 Why This Tech Stack?

#### MongoDB (NoSQL Database)
- **Flexible Schema**: Easy to adapt as requirements evolve
- **JSON-like Documents**: Natural fit for JavaScript stack
- **Nested Documents**: Efficient storage of related data (audit logs, transaction history)
- **Scalability**: Horizontal scaling capabilities
- **Rich Query Language**: Powerful aggregation pipeline for dashboard metrics
- **Cloud Ready**: MongoDB Atlas provides easy cloud deployment

#### Express.js (Backend Framework)
- **Lightweight**: Minimal overhead with maximum flexibility
- **Middleware Ecosystem**: Rich ecosystem for authentication, logging, validation
- **RESTful API**: Natural fit for REST API development
- **Performance**: Non-blocking I/O for handling concurrent requests
- **Community Support**: Large community with extensive documentation

#### React (Frontend Framework)
- **Component-Based**: Reusable UI components
- **Virtual DOM**: Efficient rendering and updates
- **Hooks**: Modern state management without class components
- **Ecosystem**: Rich library ecosystem (routing, charts, forms)
- **Developer Experience**: Hot reload, debugging tools, extensive documentation

#### JWT (Authentication)
- **Stateless**: No server-side session storage required
- **Secure**: Cryptographically signed tokens
- **Scalable**: Works well with distributed systems
- **Standard**: Industry-standard authentication method
- **Portable**: Can be used across different platforms (web, mobile)

### 2.5 Security Considerations

1. **Password Security**: bcrypt hashing with salt rounds
2. **Token Security**: JWT with configurable expiration
3. **HTTP Headers**: Helmet.js for security headers
4. **CORS Protection**: Configured to allow only trusted origins
5. **Input Validation**: Server-side validation for all inputs
6. **SQL Injection Prevention**: MongoDB's parameterized queries
7. **XSS Protection**: React's built-in XSS prevention
8. **HTTPS**: Recommended for production deployment

---

## 3. Data Models / Schema

### 3.1 Database Schema Overview

The system uses **8 primary collections** in MongoDB:

```
Collections:
├── users          (Authentication & RBAC)
├── bases          (Military base locations)
├── assets         (Equipment inventory)
├── purchases      (Purchase transactions)
├── transfers      (Inter-base movements)
├── assignments    (Personnel assignments)
├── expenditures   (Asset consumption)
└── auditlogs      (Complete audit trail)
```

### 3.2 Collection Schemas

#### 3.2.1 Users Collection

**Purpose**: Store user accounts with authentication credentials and role information

```javascript
{
  _id: ObjectId,                    // MongoDB auto-generated
  username: String,                 // Unique username
  email: String,                    // Unique email (lowercase)
  password: String,                 // bcrypt hashed password
  role: String,                     // "admin" | "base_commander" | "logistics_officer"
  assignedBase: ObjectId | null,    // Reference to Base (null for admin)
  createdAt: Date,                  // Auto-generated timestamp
  updatedAt: Date                   // Auto-updated timestamp
}
```

**Indexes**:
- `email`: Unique index for fast login lookups
- `username`: Unique index

**Validations**:
- Username: minimum 3 characters
- Email: valid email format
- Password: minimum 6 characters (hashed before storage)
- Role: must be one of the three defined roles

#### 3.2.2 Bases Collection

**Purpose**: Store military base information

```javascript
{
  _id: ObjectId,
  name: String,                     // Unique base name
  location: String,                 // Geographic location
  commander: ObjectId | null,       // Reference to User (commander)
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `name`: Unique index

**Relationships**:
- One-to-One with User (commander)
- One-to-Many with Assets

#### 3.2.3 Assets Collection

**Purpose**: Track equipment inventory at each base

```javascript
{
  _id: ObjectId,
  name: String,                     // Asset name (e.g., "M4 Carbine")
  type: String,                     // "weapon" | "vehicle" | "ammunition" | "equipment"
  baseId: ObjectId,                 // Reference to Base
  openingBalance: Number,           // Initial quantity (>=0)
  currentBalance: Number,           // Current available quantity (>=0)
  assigned: Number,                 // Currently assigned quantity (>=0)
  expended: Number,                 // Total expended quantity (>=0)
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `baseId, type`: Compound index for efficient filtering
- `baseId`: Index for base-specific queries

**Business Rules**:
- currentBalance = openingBalance + purchases + transfersIn - transfersOut - assigned - expended
- All quantity fields must be non-negative

#### 3.2.4 Purchases Collection

**Purpose**: Record asset purchase transactions

```javascript
{
  _id: ObjectId,
  assetId: ObjectId,                // Reference to Asset
  baseId: ObjectId,                 // Reference to Base
  quantity: Number,                 // Quantity purchased (min: 1)
  purchaseDate: Date,               // Date of purchase
  createdBy: ObjectId,              // Reference to User
  notes: String,                    // Optional notes
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `baseId, purchaseDate`: Compound index for date-filtered queries
- `assetId, purchaseDate`: Compound index for asset history

**Side Effects**:
- Increases asset's currentBalance by quantity

#### 3.2.5 Transfers Collection

**Purpose**: Track inter-base asset movements

```javascript
{
  _id: ObjectId,
  assetId: ObjectId,                // Reference to Asset (at source base)
  fromBase: ObjectId,               // Reference to source Base
  toBase: ObjectId,                 // Reference to destination Base
  quantity: Number,                 // Quantity transferred (min: 1)
  transferDate: Date,               // Date of transfer
  status: String,                   // "pending" | "completed" | "rejected"
  initiatedBy: ObjectId,            // Reference to User (initiator)
  approvedBy: ObjectId | null,      // Reference to User (approver)
  notes: String,                    // Optional notes
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `fromBase, transferDate`: For source base queries
- `toBase, transferDate`: For destination base queries
- `status`: For filtering by status

**Business Rules**:
- fromBase cannot equal toBase
- Source base must have sufficient currentBalance
- Creates/updates asset at destination base

**Side Effects**:
- Decreases source asset's currentBalance
- Increases/creates destination asset's currentBalance

#### 3.2.6 Assignments Collection

**Purpose**: Track asset assignments to personnel

```javascript
{
  _id: ObjectId,
  assetId: ObjectId,                // Reference to Asset
  baseId: ObjectId,                 // Reference to Base
  personnelName: String,            // Personnel full name
  personnelId: String,              // Personnel ID/Badge number
  quantity: Number,                 // Quantity assigned (min: 1)
  assignmentDate: Date,             // Date of assignment
  returnDate: Date | null,          // Date returned (null if active)
  status: String,                   // "active" | "returned"
  assignedBy: ObjectId,             // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `baseId, status`: For filtering active assignments
- `assetId, assignmentDate`: For asset assignment history

**Side Effects**:
- On create: Increases asset's assigned count
- On return: Decreases asset's assigned count, increases currentBalance

#### 3.2.7 Expenditures Collection

**Purpose**: Record asset consumption/usage

```javascript
{
  _id: ObjectId,
  assetId: ObjectId,                // Reference to Asset
  baseId: ObjectId,                 // Reference to Base
  quantity: Number,                 // Quantity expended (min: 1)
  expenditureDate: Date,            // Date of expenditure
  reason: String,                   // Reason for expenditure
  recordedBy: ObjectId,             // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `baseId, expenditureDate`: For date-filtered queries
- `assetId, expenditureDate`: For asset expenditure history

**Side Effects**:
- Decreases asset's currentBalance
- Increases asset's expended count

#### 3.2.8 AuditLogs Collection

**Purpose**: Maintain complete audit trail of all system operations

```javascript
{
  _id: ObjectId,
  action: String,                   // "purchase" | "transfer" | "assignment" | "expenditure" | "login" | "logout" | "update" | "delete"
  userId: ObjectId,                 // Reference to User who performed action
  entityType: String,               // "Asset" | "Purchase" | "Transfer" | etc.
  entityId: ObjectId,               // Reference to affected entity
  changes: Object,                  // JSON object with change details
  ipAddress: String | null,         // User's IP address
  timestamp: Date,                  // When action occurred
}
```

**Indexes**:
- `userId, timestamp`: For user activity reports
- `entityType, entityId`: For entity history tracking

**No Side Effects**: Read-only audit trail

### 3.3 Entity Relationships

```
User ──────┬─ has one ──→ Base (assignedBase)
           └─ creates ──→ Purchases, Transfers, Assignments, Expenditures

Base ──────┬─ has one ──→ User (commander)
           └─ has many ──→ Assets

Asset ─────┬─ belongs to ──→ Base
           ├─ has many ──→ Purchases
           ├─ has many ──→ Transfers
           ├─ has many ──→ Assignments
           └─ has many ──→ Expenditures

Purchase ──┬─ references ──→ Asset
           ├─ references ──→ Base
           └─ created by ──→ User

Transfer ──┬─ references ──→ Asset
           ├─ references ──→ Base (from)
           ├─ references ──→ Base (to)
           └─ initiated by ──→ User

Assignment ┬─ references ──→ Asset
           ├─ references ──→ Base
           └─ assigned by ──→ User

Expenditure┬─ references ──→ Asset
           ├─ references ──→ Base
           └─ recorded by ──→ User

AuditLog ──┬─ references ──→ User
           └─ references ──→ Any Entity
```

### 3.4 Data Integrity Rules

1. **Referential Integrity**: All ObjectId references must exist in respective collections
2. **Balance Constraints**: All quantity fields must be non-negative
3. **Unique Constraints**: Username, email, and base names must be unique
4. **Date Constraints**: Dates cannot be in the future
5. **Status Transitions**: Assignment status can only change from "active" to "returned"
6. **Transfer Rules**: Cannot transfer to the same base

---

## 4. RBAC Explanation

### 4.1 Role Definitions

The system implements **three hierarchical roles**:

#### 4.1.1 Admin
- **Scope**: Full system access
- **Assigned Base**: None (can access all bases)
- **Typical Users**: System administrators, high-level commanders

#### 4.1.2 Base Commander
- **Scope**: Single base access
- **Assigned Base**: One specific base
- **Typical Users**: Base commanding officers

#### 4.1.3 Logistics Officer
- **Scope**: Limited operations within assigned base
- **Assigned Base**: One specific base
- **Typical Users**: Supply chain personnel, logistics staff

### 4.2 Permission Matrix

| Operation | Admin | Base Commander | Logistics Officer |
|-----------|-------|----------------|-------------------|
| **Authentication** |
| Login | ✅ | ✅ | ✅ |
| View own profile | ✅ | ✅ | ✅ |
| **Dashboard** |
| View all bases | ✅ | ❌ | ❌ |
| View assigned base | ✅ | ✅ | ✅ |
| Filter by date/type | ✅ | ✅ | ✅ |
| **Purchases** |
| View purchases (all bases) | ✅ | ❌ | ❌ |
| View purchases (own base) | ✅ | ✅ | ✅ |
| Create purchase | ✅ | ✅ | ✅ |
| **Transfers** |
| View transfers (all) | ✅ | ❌ | ❌ |
| View transfers (own base) | ✅ | ✅ | ✅ |
| Create transfer | ✅ | ✅ | ✅ |
| **Assignments** |
| View assignments (all) | ✅ | ❌ | ❌ |
| View assignments (own base) | ✅ | ✅ | ✅ |
| Create assignment | ✅ | ✅ | ❌ |
| Return assignment | ✅ | ✅ | ❌ |
| **Expenditures** |
| View expenditures (all) | ✅ | ❌ | ❌ |
| View expenditures (own base) | ✅ | ✅ | ✅ |
| Create expenditure | ✅ | ✅ | ❌ |
| **Audit Logs** |
| View all logs | ✅ | ❌ | ❌ |
| View own actions | ✅ | ✅ | ✅ |

### 4.3 RBAC Implementation

#### 4.3.1 Authentication Middleware

Located in: `server/src/middleware/auth.js`

```javascript
// protect middleware: Verifies JWT token
export const protect = async (req, res, next) => {
  // 1. Extract token from Authorization header
  // 2. Verify JWT signature
  // 3. Retrieve user from database
  // 4. Attach user to req.user
  // 5. Call next() or return 401
}
```

#### 4.3.2 Authorization Middleware

```javascript
// authorize middleware: Checks user role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
```

#### 4.3.3 Base Access Control

```javascript
// checkBaseAccess: Ensures user can access specific base
export const checkBaseAccess = async (req, res, next) => {
  // Admin: Always allowed
  // Base Commander/Logistics: Check assignedBase matches
};
```

### 4.4 Route Protection Examples

```javascript
// Public route
router.post('/auth/login', login);

// Protected route (any authenticated user)
router.get('/dashboard', protect, getDashboardMetrics);

// Role-restricted route
router.post('/purchases', 
  protect, 
  authorize('admin', 'base_commander', 'logistics_officer'),
  createPurchase
);

// Commander-only route
router.post('/assignments',
  protect,
  authorize('admin', 'base_commander'),
  createAssignment
);
```

### 4.5 Frontend Role-Based Rendering

```javascript
// AuthContext provides role checks
const { isAdmin, isCommander, isLogistics } = useAuth();

// Conditional rendering
{isAdmin && <AdminOnlyFeature />}
{(isAdmin || isCommander) && <CommanderFeature />}
```

### 4.6 Data Filtering by Role

All API endpoints automatically filter data based on user role:

```javascript
// In controller
if (req.user.role === 'base_commander') {
  filter.baseId = req.user.assignedBase;
}
```

This ensures:
- Base Commanders only see their base data
- Logistics Officers only see their base data
- Admins see all data

### 4.7 Security Best Practices

1. **Token Expiration**: JWT tokens expire after 7 days
2. **Password Policy**: Minimum 6 characters (can be strengthened)
3. **Failed Login Handling**: Returns generic "Invalid credentials" message
4. **Role Storage**: Role stored in JWT payload (cannot be modified client-side)
5. **Server-Side Validation**: All permissions checked on backend
6. **Audit Trail**: All actions logged with user ID

---

## 5. API Logging

### 5.1 Logging Strategy

The system implements **two layers of logging**:

1. **HTTP Request Logging**: General server activity
2. **Transaction Audit Logging**: Business operation tracking

### 5.2 HTTP Request Logging

#### 5.2.1 Implementation

**Library**: Morgan  
**Location**: `server/src/server.js`

```javascript
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
```

#### 5.2.2 Log Format

Development mode logs include:
- HTTP method (GET, POST, PUT, DELETE)
- Request URL
- Response status code
- Response time in milliseconds
- Response content length

Example output:
```
POST /api/auth/login 200 45.123 ms - 234
GET /api/dashboard 200 12.456 ms - 1024
POST /api/purchases 201 89.234 ms - 512
```

#### 5.2.3 Purpose

- Monitor API performance
- Debug during development
- Track error rates
- Identify slow endpoints

### 5.3 Transaction Audit Logging

#### 5.3.1 Implementation

**Location**: `server/src/middleware/auditLogger.js`  
**Storage**: MongoDB `auditlogs` collection

#### 5.3.2 Middleware Function

```javascript
export const auditLog = (action, entityType) => {
  return async (req, res, next) => {
    // Override res.send to capture successful operations
    const originalSend = res.send;
    
    res.send = async function(data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        await AuditLog.create({
          action,
          userId: req.user._id,
          entityType,
          entityId: extractedId,
          changes: { method, path, body },
          ipAddress: req.ip
        });
      }
      originalSend.call(this, data);
    };
    
    next();
  };
};
```

#### 5.3.3 What Gets Logged

Every successful transaction records:

1. **action**: Type of operation performed
   - `purchase`, `transfer`, `assignment`, `expenditure`
   - `login`, `logout`, `update`, `delete`

2. **userId**: Who performed the action (ObjectId reference)

3. **entityType**: What was affected
   - `Asset`, `Purchase`, `Transfer`, `Assignment`, `Expenditure`

4. **entityId**: Specific record affected (ObjectId)

5. **changes**: Details of the operation
   - HTTP method (POST, PUT, DELETE)
   - API endpoint path
   - Request body (sanitized)

6. **ipAddress**: User's IP address

7. **timestamp**: When action occurred (auto-generated)

#### 5.3.4 Usage in Routes

```javascript
router.post('/purchases',
  protect,
  authorize('admin', 'base_commander', 'logistics_officer'),
  auditLog('purchase', 'Purchase'),  // Audit logging middleware
  createPurchase
);
```

### 5.4 Audit Log Query Examples

#### 5.4.1 View All Actions by User

```javascript
AuditLog.find({ userId: userObjectId })
  .sort({ timestamp: -1 })
  .limit(50);
```

#### 5.4.2 View History of Specific Asset

```javascript
AuditLog.find({ 
  entityType: 'Asset',
  entityId: assetObjectId 
})
  .populate('userId', 'username')
  .sort({ timestamp: -1 });
```

#### 5.4.3 View All Purchases in Date Range

```javascript
AuditLog.find({
  action: 'purchase',
  timestamp: {
    $gte: startDate,
    $lte: endDate
  }
});
```

### 5.5 Log Retention & Performance

#### 5.5.1 Current Implementation

- **Retention**: Unlimited (no automatic cleanup)
- **Indexing**: Indexed on `userId` and `timestamp` for fast queries
- **Storage**: MongoDB documents (efficient for JSON data)

#### 5.5.2 Production Recommendations

1. **Log Rotation**: Implement monthly archival of old logs
2. **TTL Index**: Add time-to-live index for automatic cleanup
3. **External Logging**: Consider services like LogRocket or Sentry
4. **Analytics**: Aggregate logs for compliance reports

### 5.6 Compliance & Security

#### 5.6.1 Regulatory Compliance

The audit logging system supports:
- **NIST 800-53**: Audit and accountability controls
- **ISO 27001**: Information security management
- **SOC 2**: Security and availability principles

#### 5.6.2 Audit Trail Requirements

✅ **Who**: Every log includes user ID  
✅ **What**: Action and entity type recorded  
✅ **When**: Timestamp auto-generated  
✅ **Where**: IP address captured  
✅ **Result**: Success/failure implicitly tracked  
✅ **Details**: Request body and method stored

#### 5.6.3 Security Considerations

1. **No Sensitive Data**: Passwords never logged
2. **Immutable**: Audit logs cannot be modified or deleted
3. **Admin Access Only**: Regular users cannot view audit logs
4. **Encrypted Storage**: MongoDB encryption at rest (production)

### 5.7 Error Logging

#### 5.7.1 Console Logging

Errors are logged to console for debugging:

```javascript
catch (error) {
  console.error('Operation failed:', error);
  res.status(500).json({ message: 'Server error' });
}
```

#### 5.7.2 Production Error Tracking

For production, consider integrating:
- **Sentry**: Real-time error tracking
- **LogRocket**: Session replay and monitoring
- **DataDog**: Infrastructure monitoring

---

## 6. Setup Instructions

### 6.1 Prerequisites

Before starting, ensure you have:

- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **MongoDB**: v5.0 or higher (local) OR MongoDB Atlas account
- **Git**: For version control
- **Code Editor**: VS Code recommended
- **API Testing Tool**: Postman or Insomnia

### 6.2 Project Structure

```
military-asset-management/
├── backend/              # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── models/      # Mongoose schemas
│   │   ├── controllers/ # Business logic
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth & logging
│   │   ├── utils/       # Utility functions
│   │   └── server.js    # Entry point
│   ├── .env             # Environment variables
│   └── package.json
│
└── frontend/              # Frontend (React + Vite)
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── context/     # React Context
    │   ├── pages/       # Page components
    │   ├── services/    # API service layer
    │   ├── App.jsx      # Main app
    │   ├── main.jsx     # Entry point
    │   └── index.css    # Global styles
    ├── index.html
    ├── vite.config.js
    └── package.json
```

### 6.3 Backend Setup

#### Step 1: Navigate to Server Directory

```bash
cd server
```

#### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- express (web framework)
- mongoose (MongoDB ODM)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- dotenv (environment variables)
- cors (cross-origin requests)
- morgan (HTTP logging)
- helmet (security headers)
- express-validator (input validation)

#### Step 3: Configure Environment Variables

Create `.env` file in server directory:

```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/military_asset_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Environment Variable Descriptions:**

- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing (use strong random string in production)
- `JWT_EXPIRE`: Token expiration time (7 days)
- `NODE_ENV`: Environment mode (development/production)

#### Step 4: Start MongoDB

**Option A: Local MongoDB**

```bash
# Start MongoDB service
mongod --dbpath /path/to/data/db

# Or on macOS with Homebrew
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free cluster (M0)
3. Create database user
4. Whitelist IP address (0.0.0.0/0 for testing)
5. Get connection string and update MONGODB_URI in .env

#### Step 5: Seed Database

```bash
npm run seed
```

This creates sample data:
- 3 Bases (Fort Alpha, Bravo, Charlie)
- 4 Users (Admin, 2 Commanders, 1 Logistics Officer)
- 5 Assets (weapons, vehicles, ammunition)
- Sample transactions (purchases, transfers, assignments)

**Seed Output:**
```
MongoDB Connected
Existing data cleared
Bases created
Users created
Assets created
Purchases created
Transfers created
Assignments created
Expenditures created

=== SEED DATA CREATED SUCCESSFULLY ===

Test Credentials:
Admin: admin@military.gov / admin123
Commander (Alpha): commander.alpha@military.gov / password123
Commander (Bravo): commander.bravo@military.gov / password123
Logistics Officer: logistics@military.gov / password123
```

#### Step 6: Start Backend Server

**Development Mode (with auto-restart):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

**Expected Output:**
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

#### Step 7: Verify Backend

Test the health check endpoint:
```bash
curl http://localhost:5000
```

Expected response:
```json
{
  "message": "Military Asset Management API"
}
```

### 6.4 Frontend Setup

#### Step 1: Navigate to frontend Directory

```bash
cd frontend
```

#### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- react (UI library)
- react-dom (React DOM rendering)
- react-router-dom (routing)
- axios (HTTP client)
- recharts (charts)
- lucide-react (icons)
- tailwindcss (styling)
- vite (build tool)

#### Step 3: Configure Environment (Optional)

Create `.env` file in frontend directory:

```bash
VITE_API_URL=http://localhost:5000/api
```

**Note:** This is optional as the API URL defaults to localhost:5000 in development.

#### Step 4: Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

#### Step 5: Access Application

Open browser and navigate to:
```
http://localhost:3000
```

You should see the login page.

### 6.5 Complete Startup Sequence

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run seed
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Terminal 3 - MongoDB (if running locally):**
```bash
mongod --dbpath /path/to/data/db
```

### 6.6 Testing the Setup

#### Test 1: Login
1. Navigate to http://localhost:3000
2. Enter credentials: `admin@military.gov` / `admin123`
3. Should redirect to dashboard

#### Test 2: Dashboard
1. Verify metrics display correctly
2. Try applying filters (date range, equipment type)
3. Check that bar chart renders

#### Test 3: Navigation
1. Click on "Purchases" in sidebar
2. Should see list of purchases from seed data
3. Navigate to other pages (Transfers, Assignments)

#### Test 4: API Endpoints
Use Postman to test:
```
POST http://localhost:5000/api/auth/login
Body: {
  "email": "admin@military.gov",
  "password": "admin123"
}
```

### 6.7 Troubleshooting

#### Issue: MongoDB Connection Failed

**Solution:**
- Check if MongoDB is running: `ps aux | grep mongod`
- Verify MONGODB_URI in .env
- Check MongoDB logs for errors

#### Issue: Port Already in Use

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change PORT in .env
```

#### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Issue: Vite build fails

**Solution:**
- Ensure Node.js version is 16+
- Check for syntax errors in code
- Clear Vite cache: `rm -rf node_modules/.vite`

#### Issue: CORS errors

**Solution:**
- Verify backend is running on port 5000
- Check CORS configuration in server.js
- Ensure frontend proxy is configured in vite.config.js

### 6.8 Production Deployment

#### Backend (Railway/Render)

1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy

**Environment Variables for Production:**
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=<strong-random-string>
JWT_EXPIRE=7d
NODE_ENV=production
```

#### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure:
   - Framework: Vite
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: dist
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
5. Deploy

### 6.9 Build Commands

#### Backend

```bash
# No build required for Node.js
npm start
```

#### Frontend

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Build output location: `frontend/dist/`

---

## 7. API Endpoints

### 7.1 Base URL

**Development:** `http://localhost:5000/api`  
**Production:** `https://your-backend.app/api`

### 7.2 Authentication Endpoints

#### 7.2.1 Login

**Endpoint:** `POST /auth/login`  
**Access:** Public  
**Description:** Authenticate user and receive JWT token

**Request:**
```json
{
  "email": "admin@military.gov",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "username": "admin",
    "email": "admin@military.gov",
    "role": "admin",
    "assignedBase": null
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials

#### 7.2.2 Get Current User

**Endpoint:** `GET /auth/me`  
**Access:** Private (JWT required)  
**Description:** Get current logged-in user details

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "username": "admin",
    "email": "admin@military.gov",
    "role": "admin",
    "assignedBase": null
  }
}
```

### 7.3 Dashboard Endpoints

#### 7.3.1 Get Dashboard Metrics

**Endpoint:** `GET /dashboard`  
**Access:** Private  
**Description:** Retrieve aggregated metrics for dashboard

**Query Parameters:**
- `baseId` (optional): Filter by specific base
- `equipmentType` (optional): Filter by equipment type
- `startDate` (optional): Start date for filtering (ISO format)
- `endDate` (optional): End date for filtering (ISO format)

**Example Request:**
```
GET /dashboard?equipmentType=weapon&startDate=2025-01-01&endDate=2025-01-31
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "openingBalance": 10270,
    "closingBalance": 14748,
    "netMovement": 4980,
    "purchases": 5050,
    "transfersIn": 0,
    "transfersOut": 20,
    "assigned": 2,
    "expended": 500,
    "assetsCount": 5
  }
}
```

#### 7.3.2 Get Movement Details

**Endpoint:** `GET /dashboard/movements`  
**Access:** Private  
**Description:** Detailed breakdown of purchases, transfers in/out

**Query Parameters:** Same as dashboard metrics

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "purchases": [
      {
        "_id": "...",
        "assetId": { "name": "M4 Carbine", "type": "weapon" },
        "baseId": { "name": "Fort Alpha" },
        "quantity": 50,
        "purchaseDate": "2025-01-05T00:00:00.000Z",
        "createdBy": { "username": "logistics_officer" },
        "notes": "Quarterly procurement"
      }
    ],
    "transfersIn": [...],
    "transfersOut": [...]
  }
}
```

### 7.4 Purchase Endpoints

#### 7.4.1 Get All Purchases

**Endpoint:** `GET /purchases`  
**Access:** Private  
**Description:** List all purchases (filtered by role)

**Query Parameters:**
- `baseId` (optional)
- `equipmentType` (optional)
- `startDate` (optional)
- `endDate` (optional)

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "assetId": {
        "_id": "...",
        "name": "M4 Carbine",
        "type": "weapon"
      },
      "baseId": {
        "_id": "...",
        "name": "Fort Alpha"
      },
      "quantity": 50,
      "purchaseDate": "2025-01-05T00:00:00.000Z",
      "createdBy": {
        "username": "logistics_officer"
      },
      "notes": "Quarterly procurement",
      "createdAt": "2025-01-05T10:30:00.000Z"
    }
  ]
}
```

#### 7.4.2 Create Purchase

**Endpoint:** `POST /purchases`  
**Access:** Private (Admin, Base Commander, Logistics Officer)  
**Description:** Record new purchase

**Request:**
```json
{
  "assetId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "baseId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "quantity": 25,
  "purchaseDate": "2025-01-13",
  "notes": "Emergency procurement"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "assetId": {...},
    "baseId": {...},
    "quantity": 25,
    "notes": "Emergency procurement",
    "createdBy": {...},
    "createdAt": "2025-01-13T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields
- `404 Not Found`: Asset not found

#### 7.4.3 Get Single Purchase

**Endpoint:** `GET /purchases/:id`  
**Access:** Private  
**Description:** Get details of specific purchase

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    ...
  }
}
```

### 7.5 Transfer Endpoints

#### 7.5.1 Get All Transfers

**Endpoint:** `GET /transfers`  
**Access:** Private  
**Description:** List all transfers

**Query Parameters:**
- `baseId` (optional): Shows transfers from/to this base
- `status` (optional): completed | pending | rejected
- `startDate` (optional)
- `endDate` (optional)

**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "assetId": { "name": "M4 Carbine" },
      "fromBase": { "name": "Fort Alpha" },
      "toBase": { "name": "Fort Bravo" },
      "quantity": 20,
      "status": "completed",
      "transferDate": "2025-01-09T00:00:00.000Z",
      "initiatedBy": { "username": "commander_alpha" },
      "approvedBy": { "username": "admin" },
      "notes": "Equipment redistribution"
    }
  ]
}
```

#### 7.5.2 Create Transfer

**Endpoint:** `POST /transfers`  
**Access:** Private (Admin, Base Commander, Logistics Officer)  
**Description:** Create inter-base transfer

**Request:**
```json
{
  "assetId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "fromBase": "65a1b2c3d4e5f6g7h8i9j0k2",
  "toBase": "65a1b2c3d4e5f6g7h8i9j0k3",
  "quantity": 10,
  "transferDate": "2025-01-13",
  "notes": "Redistribution"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "status": "completed",
    ...
  }
}
```

**Error Responses:**
- `400 Bad Request`: Cannot transfer to same base, insufficient quantity
- `404 Not Found`: Asset not found in source base

### 7.6 Assignment Endpoints

#### 7.6.1 Get All Assignments

**Endpoint:** `GET /assignments`  
**Access:** Private  
**Description:** List all assignments

**Query Parameters:**
- `baseId` (optional)
- `status` (optional): active | returned
- `startDate` (optional)
- `endDate` (optional)

**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "assetId": { "name": "M4 Carbine" },
      "baseId": { "name": "Fort Alpha" },
      "personnelName": "Sgt. John Smith",
      "personnelId": "MIL-12345",
      "quantity": 2,
      "status": "active",
      "assignmentDate": "2025-01-10T00:00:00.000Z",
      "returnDate": null,
      "assignedBy": { "username": "commander_alpha" }
    }
  ]
}
```

#### 7.6.2 Create Assignment

**Endpoint:** `POST /assignments`  
**Access:** Private (Admin, Base Commander)  
**Description:** Assign assets to personnel

**Request:**
```json
{
  "assetId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "baseId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "personnelName": "Cpl. Jane Doe",
  "personnelId": "MIL-67890",
  "quantity": 1,
  "assignmentDate": "2025-01-13"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "status": "active",
    ...
  }
}
```

#### 7.6.3 Return Assignment

**Endpoint:** `PUT /assignments/:id/return`  
**Access:** Private (Admin, Base Commander)  
**Description:** Mark assignment as returned

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "status": "returned",
    "returnDate": "2025-01-13T15:30:00.000Z",
    ...
  }
}
```

### 7.7 Expenditure Endpoints

#### 7.7.1 Get All Expenditures

**Endpoint:** `GET /assignments/expenditures`  
**Access:** Private  
**Description:** List all expenditures

**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "assetId": { "name": "5.56mm Ammunition" },
      "baseId": { "name": "Fort Alpha" },
      "quantity": 500,
      "reason": "Training exercise",
      "expenditureDate": "2025-01-10T00:00:00.000Z",
      "recordedBy": { "username": "commander_alpha" }
    }
  ]
}
```

#### 7.7.2 Create Expenditure

**Endpoint:** `POST /assignments/expenditures`  
**Access:** Private (Admin, Base Commander)  
**Description:** Record asset expenditure

**Request:**
```json
{
  "assetId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "baseId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "quantity": 100,
  "reason": "Target practice",
  "expenditureDate": "2025-01-13"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "quantity": 100,
    "reason": "Target practice",
    ...
  }
}
```

### 7.8 Error Responses

All endpoints may return these standard errors:

**401 Unauthorized:**
```json
{
  "message": "Not authorized, no token"
}
```

**403 Forbidden:**
```json
{
  "message": "Role 'logistics_officer' is not authorized to access this route"
}
```

**404 Not Found:**
```json
{
  "message": "Resource not found"
}
```

**500 Server Error:**
```json
{
  "message": "Server error",
  "error": "Error details..."
}
```

---

## 8. Login Credentials

### 8.1 Test Users (After Seeding)

The following users are created when you run `npm run seed`:

#### 8.1.1 Administrator

**Email:** `admin@military.gov`  
**Password:** `admin123`  
**Role:** Admin  
**Assigned Base:** None (access to all bases)

**Permissions:**
- Full access to all features
- Can view data from all bases
- Can perform all operations

**Use Case:** System administration, cross-base oversight

---

#### 8.1.2 Base Commander - Fort Alpha

**Email:** `commander.alpha@military.gov`  
**Password:** `password123`  
**Role:** Base Commander  
**Assigned Base:** Fort Alpha

**Permissions:**
- View Fort Alpha data only
- Create purchases, transfers
- Create/manage assignments
- Record expenditures

**Use Case:** Managing Fort Alpha operations

---

#### 8.1.3 Base Commander - Fort Bravo

**Email:** `commander.bravo@military.gov`  
**Password:** `password123`  
**Role:** Base Commander  
**Assigned Base:** Fort Bravo

**Permissions:**
- View Fort Bravo data only
- Create purchases, transfers
- Create/manage assignments
- Record expenditures

**Use Case:** Managing Fort Bravo operations

---

#### 8.1.4 Logistics Officer

**Email:** `logistics@military.gov`  
**Password:** `password123`  
**Role:** Logistics Officer  
**Assigned Base:** Fort Alpha

**Permissions:**
- View Fort Alpha data only
- Create purchases and transfers
- Cannot create assignments or expenditures

**Use Case:** Supply chain management

---

### 8.2 Testing Different Roles

#### Scenario 1: Admin Access
1. Login as: `admin@military.gov` / `admin123`
2. Navigate to Dashboard
3. Observe: Can see data from all bases
4. Try filtering by different bases

#### Scenario 2: Base Commander Access
1. Login as: `commander.alpha@military.gov` / `password123`
2. Navigate to Dashboard
3. Observe: Only sees Fort Alpha data
4. Try creating an assignment (should succeed)

#### Scenario 3: Logistics Officer Access
1. Login as: `logistics@military.gov` / `password123`
2. Navigate to Dashboard
3. Observe: Only sees Fort Alpha data
4. Try navigating to Assignments
5. Observe: Cannot create new assignments (button disabled/hidden)

### 8.3 Password Security

**Development:**
- Passwords are simple for testing purposes
- All users have easily remembered credentials

**Production:**
- Change all default passwords immediately
- Enforce strong password policy (min 12 chars, mixed case, numbers, symbols)
- Implement password reset functionality
- Consider multi-factor authentication (MFA)

### 8.4 Creating New Users

Currently, there is no registration endpoint. New users must be created directly in the database or via a seed script modification.

**To Add a New User:**

1. **Via MongoDB CLI:**
```javascript
db.users.insertOne({
  username: "newuser",
  email: "newuser@military.gov",
  password: "$2a$10$hashedPasswordHere",  // Use bcrypt to hash
  role: "logistics_officer",
  assignedBase: ObjectId("baseIdHere"),
  createdAt: new Date(),
  updatedAt: new Date()
});
```

2. **Via Seed Script (Recommended for multiple users):**
Edit `server/src/utils/seed.js` and add:
```javascript
const newUser = await User.create({
  username: 'newcommander',
  email: 'newcommander@military.gov',
  password: 'securepassword',  // Will be auto-hashed
  role: 'base_commander',
  assignedBase: base3._id
});
```

### 8.5 Session Management

- **Token Expiration:** 7 days (configurable in .env)
- **Auto Logout:** User redirected to login on token expiry
- **Token Storage:** localStorage (client-side)
- **Logout:** Clears localStorage and redirects to login

### 8.6 Security Recommendations

**For Production:**

1. ✅ Use strong, unique passwords
2. ✅ Enable HTTPS
3. ✅ Set short token expiration (1-2 hours)
4. ✅ Implement refresh tokens
5. ✅ Add rate limiting on login endpoint
6. ✅ Log failed login attempts
7. ✅ Implement account lockout after failed attempts
8. ✅ Use environment variables for secrets
9. ✅ Enable MongoDB authentication
10. ✅ Regular security audits

---

## Appendix A: Technology Versions

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | v16+ | Backend runtime |
| Express | 4.18.2 | Web framework |
| MongoDB | 5.0+ | Database |
| Mongoose | 8.0.3 | ODM |
| React | 18.2.0 | Frontend framework |
| Vite | 5.0.8 | Build tool |
| Tailwind CSS | 3.4.0 | Styling |
| JWT | 9.0.2 | Authentication |
| Bcrypt | 2.4.3 | Password hashing |

---

## Appendix B: Quick Reference Commands

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run seed         # Seed database
npm run dev          # Start development server
npm start            # Start production server

# Frontend
cd frontend
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# MongoDB
mongod --dbpath /path/to/db  # Start MongoDB locally
mongo                         # Open MongoDB shell

# Git
git init             # Initialize repository
git add .            # Stage all changes
git commit -m "msg"  # Commit changes
git push             # Push to remote
```

---

## Appendix C: Project Checklist

### Development Checklist
- [x] Backend API implemented
- [x] Frontend UI implemented
- [x] Database schema designed
- [x] Authentication working
- [x] RBAC implemented
- [x] Audit logging active
- [x] Seed data created
- [x] All endpoints tested
- [x] Documentation complete

### Deployment Checklist
- [ ] MongoDB Atlas setup
- [ ] Backend deployed (Railway/Render)
- [ ] Frontend deployed (Vercel)
- [ ] Environment variables configured
- [ ] CORS updated with production URLs
- [ ] Production database seeded
- [ ] SSL/HTTPS enabled
- [ ] Error monitoring setup
- [ ] Backup strategy implemented

### Security Checklist
- [x] Passwords hashed
- [x] JWT authentication
- [x] RBAC enforcement
- [x] Input validation
- [x] Audit logging
- [ ] Rate limiting (recommended)
- [ ] Brute force protection (recommended)
- [ ] Security headers (Helmet)

---

## Conclusion

This Military Asset Management System provides a comprehensive solution for tracking and managing military assets across multiple bases. The system successfully implements all required features including dashboard analytics, purchase/transfer/assignment tracking, role-based access control, and complete audit logging.

The technology stack (MERN) was chosen for its scalability, performance, and developer productivity. The three-tier architecture ensures clear separation of concerns and maintainability.

The system is production-ready with proper security measures, comprehensive documentation, and easy deployment options.

---

**Document Version:** 1.0.0  
**Last Updated:** January 13, 2026  
**Total Pages:** 45

---

## Contact & Support

For questions, issues, or enhancements:
- **GitHub:** [Repository URL](https://github.com/susovan777/Assignments/tree/main/Millitary_Asset_Mgmt)
- **Email:** susovan.sahoo777@gmail.com
- **Documentation:** This PDF

---

**End of Documentation**