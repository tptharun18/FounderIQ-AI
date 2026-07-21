# FounderIQ AI Copilot

FounderIQ AI is an intelligent, real-time Business Intelligence Copilot that integrates dynamically with Monday.com to fetch, clean, and analyze sales pipeline (Deals) and project execution (Work Orders) datasets. 

---

## 🏗️ Architecture Overview

The application is built using a modern decoupled architecture:

1.  **Frontend (React + Vite + React Router):**
    *   **Dashboard View:** Visualizes KPIs (Total Pipeline Value, Stage Distributions) using dynamic Recharts graphs.
    *   **Deals & Work Orders tables:** Displays structured fields dynamically fetched from Monday.com with multi-column sorting and filtering.
    *   **AI Copilot Chat Interface:** Interactive conversational interface to query datasets.
    *   **Leadership Briefing:** Provides copyable markdown summaries and printable PDF-ready reports.
    *   **Security & Audit Trail:** Interactive table displaying client pre-transmission hashing verification and WAF log telemetry.
2.  **Backend (FastAPI + Uvicorn):**
    *   Dynamic Monday.com integrations via GraphQL.
    *   Fallback logic that aggregates and runs calculations locally if OpenAI tokens are not configured, preventing dry-run failures.
    *   Endpoints are structured under the `/api/` prefix to prevent frontend URL shadowing.

---

## 🚀 Setup & Installation

### 1. Monday.com Configuration
*   Import your Deals and Work Orders CSVs into Monday.com as groups inside a single board (or separate boards).
*   Create the following columns on your board:
    *   `Status Value` (Text)
    *   `Client Code` (Text)
    *   `Value/Cost` (Text)
    *   `Deal Stage` (Text)
    *   `Sector` (Text)
    *   `Owner Code` (Text)
    *   `Serial #` (Text)

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
MONDAY_API_TOKEN=your_monday_personal_access_token
MONDAY_BOARD_ID=5030102338
OPENAI_API_KEY=your_openai_api_key
```

### 3. Backend Setup & Run
```bash
# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload --port 8000
```

### 4. Frontend Setup & Run
```bash
cd frontend
npm install
npm run dev
```
