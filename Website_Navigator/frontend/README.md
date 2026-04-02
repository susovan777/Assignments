# Website Navigator

A full-stack MERN application that lets you upload an Excel or CSV file containing website URLs and navigate between them using Previous and Next buttons — all inside a built-in browser viewer.

---

## Demo

Live Demo: 

---

## Screenshots



---

## Features

- Upload `.xlsx`, `.xls`, or `.csv` files containing website URLs
- Automatically extracts all URLs from any column in the file
- Displays websites in an embedded browser viewer
- Navigate using Prev / Next buttons or left / right arrow keys
- Click any URL in the sidebar to jump directly to it
- Graceful fallback screen for sites that block embedding
- Open any site in a new tab with one click
- URLs and session saved to MongoDB Atlas

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| File parsing | multer, xlsx |
| HTTP client | Axios |
| Package manager | pnpm |

---

## Project Structure

```
website-navigator/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── src/
│   │   ├── controllers/
│   │   │   └── urlController.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   └── UrlSet.js
│   │   └── routes/
│   │       └── upload.js
│   ├── .env
│   ├── app.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── api/
        │   └── upload.js
        ├── components/
        │   ├── BrowserViewer.jsx
        │   ├── NavBar.jsx
        │   ├── UploadZone.jsx
        │   └── UrlSidebar.jsx
        ├── hooks/
        │   └── useNavigator.js
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- pnpm (`npm install -g pnpm`)
- MongoDB Atlas account (free tier works fine)

---

### 1. Clone the repository

```bash
git clone https://github.com/susovan777/Assignments/
cd Assignments/Website_Navigator
```

---

### 2. Backend setup

```bash
cd backend
pnpm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
pnpm dev
```

The API will be running at `http://localhost:5000`. Verify with:

```
GET http://localhost:5000/
```

---

### 3. Frontend setup

```bash
cd frontend
pnpm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
pnpm dev
```

Open `http://localhost:5173` in your browser.

---

## How to Use

1. Prepare a `.xlsx` or `.csv` file with website URLs in any column. Example:

   | Name | URL |
   |---|---|
   | GitHub | https://github.com |
   | MDN Docs | https://developer.mozilla.org |
   | npm | https://npmjs.com |

2. Open the app and upload the file by dragging it onto the upload zone or clicking to browse.
3. The app extracts all URLs and loads the first one in the viewer.
4. Use the **← →** buttons in the top bar, the **sidebar**, or the **arrow keys** on your keyboard to navigate.
5. If a site blocks embedding, click **Open in new tab** to view it directly.

---

## API Reference

### `POST /api/upload`

Accepts a multipart form upload and returns extracted URLs.

**Request**

| Field | Type | Description |
|---|---|---|
| `file` | `File` | `.xlsx`, `.xls`, or `.csv` file |

**Response**

```json
{
  "success": true,
  "id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "urls": [
    "https://github.com",
    "https://developer.mozilla.org",
    "https://npmjs.com"
  ]
}
```

**Error response**

```json
{
  "success": false,
  "message": "No valid URLs found in file"
}
```

---

## Known Limitations

- Many popular sites (Google, GitHub, Twitter) block iframe embedding via `X-Frame-Options`. The app detects this and shows a fallback screen with an "Open in new tab" button.
- `multer.memoryStorage()` holds uploaded files in RAM. Very large spreadsheets (50MB+) may cause issues in production — consider `diskStorage` for those cases.

---

## License

MIT