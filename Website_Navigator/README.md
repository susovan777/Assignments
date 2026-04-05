# WebNavigator

Upload a spreadsheet of URLs and browse them one by one — right inside the app.

![Upload Screen](./screenshots/upload.png)

---

## What it does

- Upload `.xlsx`, `.xls`, or `.csv` files containing website URLs
- Auto-loads your last session on every visit
- Browse sites with Prev / Next buttons or ← → arrow keys
- Jump directly to any site from the sidebar
- Sites that block embedding show a clean fallback with an "Open in new tab" button

![Main Viewer](./screenshots/viewer.png)

---

## Stack

```
Frontend   React + Vite + Tailwind CSS v4
Backend    Node.js + Express.js
Database   MongoDB Atlas
Parsing    multer + xlsx
```

---

## Quick Start

**Backend**

```bash
cd backend
pnpm install
# create .env with PORT, MONGO_URI, CLIENT_URL
pnpm dev
```

**Frontend**

```bash
cd frontend
pnpm install
# create .env with VITE_API_URL=http://localhost:5000
pnpm dev
```

Open `http://localhost:5173`

---

## How to use

1. Prepare a spreadsheet with URLs in any column

   | Name       | URL                          |
   |------------|------------------------------|
   | GitHub     | https://github.com           |
   | MDN Docs   | https://developer.mozilla.org |

2. Upload it via the sidebar or the **Upload file** button
3. Navigate with the arrow buttons or keyboard ← →

![Blocked Site Fallback](./screenshots/fallback.png)

---

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/api/upload` | Upload file, returns extracted URLs |
| `GET` | `/api/latest` | Fetch last uploaded URL set |

---

> Note — some sites (Google, GitHub, Pinterest) block iframe embedding via `X-Frame-Options`. The app detects this and shows a fallback screen automatically.