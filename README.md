# Easy to Excel Clear — AI-Powered Document to Excel Converter

Turn messy documents into clean, organized Excel files in minutes. Upload PDFs, images, invoices, receipts, and tables. Let AI extract, clean, and structure your data automatically.

## Features

✨ **AI-Powered Extraction** — Automatically extracts structured data from any document
🧹 **Data Cleaning** — Normalizes dates, currency, formats, and removes duplicates
📊 **Real Excel Export** — Generate actual .xlsx files with proper formatting
✏️ **Easy Editing** — Review and edit extracted data before downloading
📋 **Conversion History** — Keep track of your recent conversions
🔒 **Secure** — Files are processed temporarily and automatically deleted

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (lightning-fast build)
- Tailwind CSS (modern UI)
- Axios (API client)

**Backend:**
- Node.js + Express.js
- Claude API (Anthropic) for AI extraction
- pdfjs-dist (PDF text extraction)
- Tesseract.js (Image OCR)
- SheetJS (Excel generation)

**Database:**
- SQLite (optional, for future use)
- Currently: Local JSON storage + browser localStorage

## Requirements

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Claude API Key** (Get from [console.anthropic.com](https://console.anthropic.com))
- **Text Editor/IDE** (VS Code recommended)

## Windows Setup Instructions

### Step 1: Install Node.js (if not already installed)

1. Go to https://nodejs.org/
2. Download the **LTS (Long Term Support)** version
3. Run the installer
4. Follow the installation wizard (accept defaults)
5. Open **Command Prompt** or **PowerShell** and verify:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Get Your Claude API Key

1. Go to https://console.anthropic.com
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **Create Key**
5. Copy the key (starts with `sk-ant-`)
6. **Keep this secret!** Don't commit it to git

### Step 3: Clone or Download the Project

Open Command Prompt or PowerShell and run:

```bash
cd Desktop
git clone <repository-url>
cd easy-to-excel-clear
```

Or download the ZIP file and extract it.

### Step 4: Setup Backend

**Open Command Prompt/PowerShell:**

```bash
cd backend
npm install
```

**Create `.env` file:**

1. In the `backend` folder, create a new file called `.env`
2. Open it in Notepad and add:

```
NODE_ENV=development
PORT=5000
CLAUDE_API_KEY=sk-ant-your-actual-key-here
AI_MODEL=claude-sonnet-5-20250929
```

Replace `sk-ant-your-actual-key-here` with your actual API key.

**Start backend server:**

```bash
npm run dev
```

You should see:
```
╔════════════════════════════════════════╗
║   Easy to Excel Clear - Backend        ║
║          API Running                   ║
╠════════════════════════════════════════╣
║ Environment: development               ║
║ Port: 5000                             ║
║ URL: http://localhost:5000             ║
```

✅ **Backend is running!** Leave this window open.

### Step 5: Setup Frontend

**Open a NEW Command Prompt/PowerShell window:**

```bash
cd frontend
npm install
```

**Create `.env.local` file:**

1. In the `frontend` folder, create a new file called `.env.local`
2. Open it in Notepad and add:

```
VITE_API_URL=http://localhost:5000
```

**Start frontend dev server:**

```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in 234 ms

➜  Local:   http://localhost:5173/
```

### Step 6: Open the Application

1. Open your web browser
2. Go to: **http://localhost:5173**
3. You should see the Easy to Excel Clear landing page

## Testing the Application

### Sample Files

Test with these types of documents:

1. **PDF Table** — A PDF with a table or structured data
2. **Invoice Image** — A photo of an invoice (JPG/PNG)
3. **Receipt** — A photo of a receipt
4. **Spreadsheet Screenshot** — Image of a table

### Full Workflow

1. Click "Upload Your File"
2. Select a document (PDF, JPG, JPEG, or PNG)
3. Wait for extraction (15-30 seconds)
4. Review the extracted data
5. Edit if needed (add/remove rows, rename columns)
6. Click "Download Excel File"
7. Open in Excel or Google Sheets

## File Structure

```
easy-to-excel-clear/
├── backend/
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Claude, PDF, OCR, Excel services
│   │   ├── middleware/     # Error handling, validation
│   │   ├── types/          # TypeScript interfaces
│   │   └── app.ts          # Express app setup
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example        # Copy to .env and add API key
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API + storage services
│   │   ├── types/          # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   ├── .env.local          # API URL
│   └── .gitignore
│
└── README.md
```

## Environment Variables

### Backend (`.env`)

```bash
NODE_ENV=development          # development or production
PORT=5000                      # Server port
CLAUDE_API_KEY=sk-ant-...     # Your Claude API key (REQUIRED)
AI_MODEL=claude-sonnet-5-20250929  # AI model to use
```

### Frontend (`.env.local`)

```bash
VITE_API_URL=http://localhost:5000  # Backend URL
```

## Available Models

Choose a model based on your needs:

- **claude-sonnet-5** (recommended)
  - Pricing: $2 input / $10 output per million tokens
  - Good balance of speed and cost

- **claude-haiku-4-5** (fastest, cheapest)
  - Pricing: $1 input / $5 output per million tokens
  - Good for simple documents

- **claude-opus-5** (most capable)
  - Pricing: $5 input / $25 output per million tokens
  - Best for complex documents

## Estimated Costs

Pricing is based on actual usage:

| Volume | Estimated Cost |
|--------|---|
| 10 documents | ~$0.04 |
| 100 documents | ~$0.40 |
| 1,000 documents | ~$4.00 |
| 10,000 documents | ~$40.00 |

Cost is **only** for Claude API calls. No other fees.

## Troubleshooting

### Backend won't start

```bash
# Make sure Node.js is installed
node --version

# Clear node_modules and reinstall
rmdir /s node_modules
npm install

# Check if port 5000 is in use
netstat -ano | findstr :5000
```

### Frontend won't load

```bash
# Clear cache
npm run build

# Restart dev server
npm run dev

# Check if port 5173 is available
```

### API key error

1. Verify your Claude API key in `backend/.env`
2. Make sure there are no extra spaces or quotes
3. Restart the backend server after changing `.env`
4. Check https://console.anthropic.com that your key is valid

### Document extraction fails

1. Try a different document format
2. Ensure the document is clear and readable
3. Check that file size is under 10 MB
4. Verify Claude API key is configured
5. Check browser console for detailed error messages

### Files stuck in `/uploads`

Backend automatically cleans up old uploads every 6 hours. To manually clean:

```bash
# Delete the uploads folder
rmdir /s uploads
```

## API Endpoints

### Health Check
```
GET /api/health
Response: { status: "healthy", services: {...} }
```

### Upload File
```
POST /api/upload
Body: FormData with 'file' field
Response: { uploadId, fileName, fileSize, fileType }
```

### Extract Data
```
POST /api/extract
Body: { uploadId: "..." }
Response: { uploadId, data: { columns, rows, confidence } }
```

### Export to Excel
```
POST /api/export
Body: { uploadId: "...", data: {...} }
Response: Binary .xlsx file
```

## Security Notes

- ✅ API keys are NOT exposed in frontend code
- ✅ Files are processed temporarily and deleted after export
- ✅ No data is stored on the server
- ✅ Use HTTPS in production
- ✅ Keep API keys secret (never commit to git)

## Building for Production

### Build Frontend
```bash
cd frontend
npm run build
```
Output goes to `frontend/dist/`

### Build Backend
```bash
cd backend
npm run build
```
Output goes to `backend/dist/`

## Deployment

### Vercel (Frontend)
```bash
npm install -g vercel
cd frontend
vercel
```

### Render/Railway (Backend)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables in dashboard
4. Deploy

## Future Features

- [ ] User authentication (JWT)
- [ ] PostgreSQL database for conversion history
- [ ] Cloud storage (AWS S3)
- [ ] Batch processing
- [ ] Custom extraction templates
- [ ] Email notifications
- [ ] Payment integration (Stripe)
- [ ] Advanced data cleaning options
- [ ] Google Sheets export
- [ ] Mobile app

## Contributing

This is an MVP. Improvements and bug reports welcome!

## License

MIT License — feel free to use for personal and commercial projects.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review error messages in the browser console
3. Check backend logs in the terminal
4. Verify API key and environment variables

## Version

**v0.1.0** — MVP Release

---

**Happy converting! 🎉**

Transform your messy documents into clean, organized Excel files today.
