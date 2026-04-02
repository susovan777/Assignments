# Website Navigator — Backend API

REST API built with Node.js and Express.js that handles file uploads, parses URLs from Excel/CSV files, and persists them to MongoDB Atlas.

---

## Tech Stack

| Tool          | Purpose                        |
| ------------- | ------------------------------ |
| Node.js       | Runtime                        |
| Express.js    | HTTP server and routing        |
| MongoDB Atlas | Cloud database                 |
| Mongoose      | ODM for MongoDB                |
| multer        | Multipart file upload handling |
| xlsx          | Excel and CSV parsing          |
| cors          | Cross-origin request support   |
| dotenv        | Environment variable loading   |
| pnpm          | Package manager                |

---

## Project Structure

```
backend/
├── config/
│   └── db.js               ← MongoDB Atlas connection
├── src/
│   ├── controllers/
│   │   └── urlController.js  ← Business logic: parse, save, fetch
│   ├── middleware/
│   │   └── errorHandler.js   ← Global error handler
│   ├── models/
│   │   └── UrlSet.js         ← Mongoose schema
│   └── routes/
│       └── upload.js         ← Route definitions + multer config
├── .env                    ← Environment variables (never commit this)
├── .gitignore
├── app.js                  ← Express app setup
├── package.json
├── pnpm-lock.yaml
└── server.js               ← Entry point, starts HTTP server
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- pnpm (`npm install -g pnpm`)
- A MongoDB Atlas cluster (free tier is fine)

### 1. Install dependencies

```bash
cd backend
pnpm install
```

### 2. Configure environment variables

Create a `.env` file in the `backend/` root:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/webnavigator
CLIENT_URL=http://localhost:5173
```

| Variable     | Description                             |
| ------------ | --------------------------------------- |
| `PORT`       | Port the server listens on              |
| `MONGO_URI`  | MongoDB Atlas connection string         |
| `CLIENT_URL` | Allowed CORS origin (your frontend URL) |

### 3. Start the server

```bash
# Development (with auto-restart)
pnpm dev

# Production
pnpm start
```

Server runs at `http://localhost:5000`.

---

## API Reference

### Health check

```
GET /
```

**Response**

```json
{ "status": "ok" }
```

---

### Upload a file

```
POST /api/upload
```

Accepts a `.xlsx`, `.xls`, or `.csv` file, extracts all cells that look like URLs, saves them to MongoDB, and returns the list.

**Request**

- Content-Type: `multipart/form-data`
- Body field name: `file`

```bash
# Example with curl
curl -X POST http://localhost:5000/api/upload \
  -F "file=@/path/to/sites.xlsx"
```

**Success response** `201`

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

**Error responses**

| Status | Message                     | Cause                                                           |
| ------ | --------------------------- | --------------------------------------------------------------- |
| `400`  | No file uploaded            | Request has no file attached                                    |
| `422`  | No valid URLs found in file | File was parsed but contained no `http://` or `https://` values |
| `500`  | Internal server error       | Unexpected server error                                         |

---

### Get latest uploaded URLs

```
GET /api/latest
```

Returns the most recently uploaded URL set from MongoDB. Used by the frontend to restore the last session on page load.

**Success response** `200`

```json
{
  "success": true,
  "id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "urls": ["https://github.com", "https://developer.mozilla.org"]
}
```

**Response when no data exists** `200`

```json
{ "urls": [] }
```

---

## How File Parsing Works

### 1. multer intercepts the request

```
POST /api/upload (multipart/form-data)
       ↓
fileFilter checks mimetype → rejects non-Excel/CSV files
       ↓
memoryStorage stores file as Buffer in req.file.buffer
       ↓
uploadFile controller receives req.file
```

multer uses `memoryStorage` — the file is held in RAM as a `Buffer` and never written to disk. This keeps the server stateless and avoids cleanup logic.

### 2. xlsx parses the buffer

```js
XLSX.read(req.file.buffer, { type: 'buffer' });
// → Workbook

sheet_to_json(sheet, { header: 1 })
  // → [ ['URL', 'Name'], ['https://...', 'GitHub'], ... ]

  .flat()
  // → [ 'URL', 'Name', 'https://...', 'GitHub', ... ]

  .filter(/^https?:\/\//);
// → [ 'https://github.com', 'https://npmjs.com' ]
```

`{ header: 1 }` returns each row as a plain array instead of a keyed object. This means all cells are captured regardless of what the column headers are named.

### 3. Saved to MongoDB

The extracted URLs and original filename are stored as a `UrlSet` document. The frontend fetches the latest document on every page load to restore the previous session.

---

## Database Schema

### UrlSet

```js
{
  fileName:   String,    // original uploaded filename e.g. "sites.xlsx"
  urls:       [String],  // array of extracted URL strings
  createdAt:  Date,      // auto-managed by Mongoose timestamps
  updatedAt:  Date
}
```

Collection name: `urlsets`

---

## Environment Variables Reference

| Variable     | Required | Default | Description                     |
| ------------ | -------- | ------- | ------------------------------- |
| `PORT`       | No       | `5000`  | HTTP server port                |
| `MONGO_URI`  | Yes      | —       | MongoDB Atlas connection string |
| `CLIENT_URL` | Yes      | —       | Frontend origin allowed by CORS |

---

## Error Handling

All errors are caught and passed to the global `errorHandler` middleware in `src/middleware/errorHandler.js`. It returns a consistent JSON shape:

```json
{
  "success": false,
  "message": "Description of what went wrong"
}
```

Controllers use `try/catch` and call `next(err)` so no error ever crashes the process silently.

---

## Supported File Formats

| Format        | Extension | MIME type                                                           |
| ------------- | --------- | ------------------------------------------------------------------- |
| Excel 2007+   | `.xlsx`   | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| Excel 97–2003 | `.xls`    | `application/vnd.ms-excel`                                          |
| CSV           | `.csv`    | `text/csv`                                                          |

URLs are detected by scanning every cell in the first sheet for values that start with `http://` or `https://`. Column names and position do not matter.

---

## Known Limitations

- `memoryStorage` holds the uploaded file in RAM. For very large spreadsheets (50MB+), consider switching to `diskStorage` and streaming the file to the xlsx parser.
- Only the first sheet of a workbook is parsed. If URLs are on a later tab they will be missed.
- Only the most recent upload is returned by `GET /api/upload/latest`. There is no history or multi-session support in the current version.

---

## Scripts

```bash
pnpm dev      # Start with nodemon (auto-restarts on file change)
pnpm start    # Start without nodemon (production)
```
