# Military Asset Management System - Frontend

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Variables (Optional)
Create `.env` file in client directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
```

The app will run on: **http://localhost:3000**

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Layout.jsx              # Main layout with sidebar
│   │   └── CreatePurchaseModal.jsx # Purchase form modal
│   ├── context/
│   │   └── AuthContext.jsx         # Authentication context
│   ├── pages/
│   │   ├── Login.jsx               # Login page
│   │   ├── Dashboard.jsx           # Dashboard with metrics
│   │   ├── Purchases.jsx           # Purchases list
│   │   ├── Transfers.jsx           # Transfers list
│   │   └── Assignments.jsx         # Assignments & Expenditures
│   ├── services/
│   │   └── api.js                  # API service layer
│   ├── App.jsx                     # Main app with routing
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🔐 Login Credentials

Use these credentials from the seeded database:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@military.gov | admin123 |
| Base Commander | commander.alpha@military.gov | password123 |
| Logistics Officer | logistics@military.gov | password123 |

## ✨ Features Implemented

### ✅ Pages & Components
- [x] Login Page with authentication
- [x] Dashboard with metrics and charts
- [x] Purchases page with list view
- [x] Transfers page with list view
- [x] Assignments & Expenditures with tabs
- [x] Responsive sidebar navigation
- [x] Protected routes (auth required)

### ✅ Functionality
- [x] JWT Authentication
- [x] Role-based access control
- [x] API integration with Axios
- [x] Date/Type filters on Dashboard
- [x] Real-time data fetching
- [x] Loading states
- [x] Error handling
- [x] Auto logout on token expiry

### ✅ Design
- [x] Tailwind CSS styling
- [x] Responsive design
- [x] Clean UI components
- [x] Icons (Lucide React)
- [x] Charts (Recharts)

## 🎨 UI Components

### Dashboard
- **Metric Cards:** Opening Balance, Closing Balance, Net Movement, Assigned, Expended
- **Bar Chart:** Visual representation of movements
- **Filters:** Equipment Type, Start Date, End Date

### Purchases
- **Table View:** All purchases with asset details
- **Create Modal:** Form to add new purchases
- **Filters:** Equipment type and date range

### Transfers
- **Table View:** Inter-base transfers with status
- **Visual Route:** From Base → To Base display

### Assignments
- **Tabs:** Switch between Assignments and Expenditures
- **Return Action:** Return active assignments
- **Status Badges:** Visual status indicators

## 🔧 API Integration

All API calls are configured in `src/services/api.js`:

- **Authentication:** Login, Get current user
- **Dashboard:** Get metrics, Get movement details
- **Purchases:** List, Create, View single
- **Transfers:** List, Create, View single
- **Assignments:** List, Create, Return
- **Expenditures:** List, Create

### Axios Interceptors
- **Request:** Auto-adds JWT token to headers
- **Response:** Auto-logout on 401 (unauthorized)

## 🛠️ Development Tips

### Running Both Backend & Frontend
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Building for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## ⚠️ Known Limitations & Workarounds

### 1. Create Purchase Modal
Currently requires manual entry of Base ID and Asset ID. 

**Workaround:** 
- Get Base IDs from your MongoDB database
- Or check browser console in Dashboard for IDs
- Future improvement: Add dropdown selects

### 2. Asset Management
Assets are created on-the-fly during purchases.

**Future Improvement:** 
- Add dedicated Assets page
- Better asset selection in forms

### 3. Base Selection
No base dropdown in modals yet.

**Workaround:**
- Admins can access all bases
- Base Commanders are auto-filtered to their base
- Use MongoDB IDs for now

## 📱 Responsive Design

The application is fully responsive:
- **Desktop:** Full sidebar, multi-column layouts
- **Tablet:** Collapsible sidebar, 2-column grids
- **Mobile:** Hidden sidebar (to be added: hamburger menu)

## 🚀 Deployment (Vercel)

### 1. Build Configuration
```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 2. Environment Variables in Vercel
Add in Vercel Dashboard:
```
VITE_API_URL=https://your-backend-api.com/api
```

### 3. Deploy
```bash
npm run build
vercel --prod
```

## 🐛 Troubleshooting

### Backend Connection Issues
```javascript
// Check if proxy is working
// vite.config.js already configured
proxy: {
  '/api': {
    target: 'http://localhost:5000'
  }
}
```

### CORS Errors
Ensure backend has CORS enabled for frontend URL:
```javascript
// server/src/server.js
app.use(cors({
  origin: 'http://localhost:3000'
}));
```

### Token Issues
- Clear localStorage: `localStorage.clear()`
- Login again to get fresh token

## 📋 Testing Checklist

- [ ] Login with all 3 roles
- [ ] View Dashboard metrics
- [ ] Apply date filters on Dashboard
- [ ] View Purchases list
- [ ] View Transfers list
- [ ] View Assignments list
- [ ] View Expenditures tab
- [ ] Test Return Assignment
- [ ] Logout and verify redirect to login
- [ ] Test RBAC (Base Commander sees only their base)

## 🎯 What's Next?

### Priority Improvements for Deadline:
1. ✅ All core features working
2. ⚠️ Add actual Asset/Base dropdowns in Create modals
3. ⚠️ Add Create Transfer modal
4. ⚠️ Add Create Assignment modal
5. ⚠️ Add Create Expenditure modal

### Nice to Have (Post-deadline):
- Search functionality
- Pagination for large datasets
- Export to Excel/PDF
- Notifications/Alerts
- Mobile hamburger menu
- Dark mode

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify backend is running (http://localhost:5000)
3. Check MongoDB connection
4. Verify token in localStorage
5. Test APIs directly in Postman first

---

**Status:** ✅ MVP Complete - Ready for Presentation!
**Time Remaining:** Perfect for deadline!