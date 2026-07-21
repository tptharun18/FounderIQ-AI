# Decision Log: FounderIQ AI Copilot

This document outlines the key design choices, assumptions, trade-offs, and feature interpretations made during the development of the FounderIQ AI Copilot.

---

## 1. Key Assumptions Made

*   **API & Board Structure:** We assume Monday.com boards are populated with data matching the schema of `Deal funnel Data.csv` (Deals board ID `5030093845`) and `Work_Order_Tracker Data.csv` (Work Orders board ID `5030094086`). We query these boards dynamically rather than hardcoding static datasets.
*   **Authentication & Access Token:** We assume the Monday.com board API key resides securely in the environment under `MONDAY_API_TOKEN` and is queried using GraphQL API version `2025-04`.
*   **LLM Model & Fallbacks:** Since production envs might not have `OPENAI_API_KEY` configured during dry-run testing, we implemented a **hybrid agent** that executes locally using heuristic intelligence if the OpenAI token is missing. It provides immediate, structured query answers from actual board datasets and alerts the user about the missing credential rather than crashing or returning blank outputs.

---

## 2. Technical Decisions & Trade-Offs Chosen

*   **Lightweight API Layer (No SDK dependency):** We opted to make raw HTTP requests using python's `requests` package instead of loading official Monday.com or OpenAI client SDKs. This minimizes build sizing and deployment dependencies on Render.
*   **Dual Router Resolution (Path Conflict):** We identified that both `monday.py` and `deals.py` previously registered the duplicate route `POST /deals`. We left the `monday.py` endpoint as the primary active route because it supports updating other fields (Status & Due Date) inside Monday.com via mutations.
*   **Client-Side UI Consistency:** Per instructions to "not change the UI", we retained all CSS styling, grid structures, layout parameters, and color palettes. We seamlessly integrated the "AI Copilot" page layout into the sidebar using exactly matching styles and icons.

---

## 3. Interpretation of "Leadership Updates"

We interpreted **"help prepare data for leadership updates"** in two ways:
1.  **AI Summaries:** The Copilot accepts queries like *"Generate a leadership update report"* and uses the LLM (or fallback template engine) to aggregate counts, timelines, priority bottlenecks, and estimated costs from both boards into a structured markdown report suitable for copy-pasting.
2.  **Dashboard Visuals:** The Dashboard aggregates critical high-level metrics (e.g. Sales Pipeline Recharts, Status Distributions, and Deal Owners lists) that can be screenshotted directly by team leads.

---

## 4. Future Improvements (With More Time)

*   **Interactive Chat Context:** Persist chat histories in local database tables or sessions so the copilot can maintain multi-turn context (e.g. asking clarifying questions and building upon previous answers).
*   **Enhanced Graph Integrations:** Enable the Copilot to dynamically generate Custom Recharts configurations on-the-fly and display them inline in the chat bubble.
*   **Automatic Syncing:** Implement webhooks on Monday.com so updates to the boards automatically trigger server-side updates rather than requiring manual page refreshes.
