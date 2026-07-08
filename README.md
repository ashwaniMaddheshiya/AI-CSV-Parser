# AI CSV Importer

An AI-powered CSV importer that intelligently understands CSV files with different structures and converts them into a standardized CRM format using an LLM.

## Project Structure

```
ai-csv-parser/
├── frontend/          # Next.js App Router + TypeScript + TailwindCSS
└── backend/           # Express + TypeScript + Google Gemini
```

## Tech Stack

**Frontend:** Next.js, TypeScript, TailwindCSS, TanStack Table, React Dropzone, Axios, Sonner

**Backend:** Node.js, Express, TypeScript, Multer, csv-parser, Zod, Google Gemini (@google/generative-ai)

## Features

- Drag & drop CSV upload with client-side validation
- Raw CSV preview with virtualized table (sticky headers, horizontal/vertical scroll)
- AI-powered field mapping from arbitrary column names to CRM schema
- Batch processing with retry on failure
- Zod validation of AI responses and post-processing sanitization
- Import results table with imported/skipped counts
- Loading states, progress bar, skeletons, and toast notifications
- Light and dark mode

## Getting Started

### Prerequisites

- Node.js 18+
- Gemini API key (set `GEMINI_API_KEY` in the backend `.env`)

### Backend Setup

```bash
cd backend
cp .env.example .env
# Add your GEMINI_API_KEY to .env
npm install
npm run dev
```

Backend runs at `http://localhost:4000`.

To start the backend without watch mode:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.


## Development Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Project structure | Complete |
| 2 | Frontend upload & preview | Complete |
| 3 | Backend import API | Complete |
| 4 | CSV parsing | Complete |
| 5 | AI integration | Complete |
| 6 | Validation layer | Complete |
| 7 | Frontend results | Complete |
| 8 | Loading states | Complete |
| 9 | Retry mechanism | Complete |
| 10 | README updates | Complete |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/import` | Upload CSV and run the full AI import flow |

### Import Response

```json
{
  "success": true,
  "imported": 42,
  "skipped": 3,
  "records": [{ "name": "...", "email": "...", "...": "..." }],
  "skippedRecords": [{ "rowIndex": 5, "reason": "No email or phone found", "rawData": {} }]
}
```

## CRM Fields

The AI maps arbitrary CSV columns to these standardized fields:

`created_at`, `name`, `email`, `country_code`, `mobile_without_country_code`, `company`, `city`, `state`, `country`, `lead_owner`, `crm_status`, `crm_note`, `data_source`, `possession_time`, `description`

### Business Rules

- **crm_status** must be one of: `GOOD_LEAD_FOLLOW_UP`, `DID_NOT_CONNECT`, `BAD_LEAD`, `SALE_DONE` (or blank)
- **data_source** must be one of: `leads_on_demand`, `meridian_tower`, `eden_park`, `varah_swamy`, `sarjapur_plots` (or blank)
- Records without email or phone are skipped
- Multiple emails/phones: first is used, rest appended to `crm_note`
- AI never invents values — unknown fields are left blank

## License

Private assignment project.
