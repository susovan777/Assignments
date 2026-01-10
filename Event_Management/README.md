# Event & Attendee Management Portal

A simplified full-stack dashboard for managing events and their attendee registrations.  
This project demonstrates clean data modeling, modern React patterns, and thoughtful UX handling.

---

## 🚀 Tech Stack

- **Frontend & Backend**: Next.js (App Router)
- **ORM**: Prisma
- **Database**: SQLite (for simplicity and fast evaluation)
- **Forms & Validation**: React Hook Form + Zod
- **Server State**: TanStack Query
- **UI**: shadcn/ui + Tailwind CSS
- **Notifications**: Sonner
- **Deployment**: Vercel

---

## ✨ Features

### Event Management
- Create events with:
  - Title
  - Description
  - Date & time
  - Capacity
- View all events in a clean, card-based layout
- See attendee count vs capacity in real time

### Attendee Management
- Register attendees for a specific event
- Enforce event capacity at the API level
- View attendees per event (relational view)

### UX & Engineering Highlights
- Fully validated forms using shared Zod schemas
- Server-state synchronization with TanStack Query
- Loading, empty, and error states handled gracefully
- Optimistic UI updates for better perceived performance
- Toast notifications for success and failure feedback

---

## 🧠 Architecture Overview

This project uses **Next.js App Router**, where:

- Frontend pages and backend API routes live in the **same codebase**
- Backend functionality is implemented via `/app/api/**` route handlers
- Prisma manages relational data between `Event` and `Attendee`
- The frontend communicates with backend routes using relative URLs (e.g. `/api/events`)

Unlike a traditional MERN stack, **frontend and backend are not deployed separately**.

---

## ⚠️ Deployment Note (Important)

This application is deployed on **Vercel** using **SQLite** for simplicity.

Vercel runs API routes in a **serverless environment** with **ephemeral file storage**, which means:

- SQLite data may reset between deployments or cold starts
- This setup is suitable for demos, assignments, and evaluation
- It is **not recommended for production persistence**

### Production Consideration

In a real production environment, SQLite would be replaced with a hosted database such as:

- Neon (PostgreSQL)
- Supabase
- PlanetScale
- Railway PostgreSQL

This change would require **no frontend code changes**, only an update to the Prisma datasource and environment variables.

---

## 🛠️ Local Development

### 1. Clone the repository

```bash
git clone https://github.com/susovan777/Assignments/tree/main/Event_Management
cd Event_Management
```
### 2. Install dependencies
```
npm install
```

### 3. Run database migrations
```
npx prisma migrate dev
```
### 4. Start the development server
```
npm run dev
```

The application will be available at: http://localhost:3000

---

## 📂 Project Structure (Simplified)
```
src/
 ├─ app/
 │   ├─ api/            # Backend API routes
 │   ├─ page.tsx        # Main dashboard UI
 │   └─ layout.tsx
 ├─ components/         # Reusable UI components
 ├─ lib/
 │   ├─ api/            # API helper functions
 │   ├─ prisma.ts       # Prisma client
 │   └─ validators/     # Zod schemas
 └─ app/globals.css
```
---

## 👤 Author

Built by Susovan Sahoo

As part of a full-stack evaluation project.