# Decision Log: FounderIQ AI Copilot

This document outlines the key design choices, assumptions, trade-offs, and feature interpretations made during the development of the FounderIQ AI Copilot.

---

## 1. Key Assumptions Made

*   **API & Board Structure:** Monday.com boards are imported using the provided CSV schemas. Instead of hardcoding board IDs, we query them dynamically by configuring the `MONDAY_BOARD_ID` environment variable.
*   **Authentication & Access Token:** The Monday.com board API key resides securely in the environment under `MONDAY_API_TOKEN` and is queried using GraphQL API version `2025-04`.
*   **LLM Model & Fallbacks:** Since production environments might not have `OPENAI_API_KEY` configured during dry-run testing, we implemented a **hybrid agent** that executes locally using heuristic intelligence if the OpenAI token is missing. It provides immediate, structured query answers from actual board datasets.

---

## 2. Technical Decisions & Trade-Offs Chosen

*   **Prefix Namespacing (`/api` router namespace):** To prevent routing conflicts where a page name (like `/deals`) matches an API route, all backend routers are mounted under the `/api` prefix. This leaves root paths open for React Router client-side path handling.
*   **Lightweight API Layer (No SDK dependency):** We opted to make raw HTTP requests using python's `requests` package instead of loading official Monday.com or OpenAI client SDKs. This minimizes build sizing and deployment dependencies.
*   **Hybrid Status mapping:** We mapped the CSV status labels to a custom text column `Status Value` instead of the default Monday.com color column to prevent status label validation crashes.

---

## 3. Interpretation of "Leadership Updates"

We interpreted **"help prepare data for leadership updates"** in two ways:
1.  **AI Summaries:** The Copilot accepts queries like *"Generate a leadership update report"* and uses the LLM (or fallback template engine) to aggregate counts, timelines, priority bottlenecks, and estimated costs from both boards into a structured markdown report suitable for copy-pasting.
2.  **Dashboard Visuals:** The Dashboard aggregates critical high-level metrics (e.g. Sales Pipeline Recharts, Status Distributions, and Deal Owners lists) that can be screenshotted directly by team leads.
3.  **Briefing View:** We added a dedicated "Leadership Briefing" view that displays a formatted executive briefing dynamically generated from the live Monday.com board, with copy and print functionality.

---

## 4. Future Improvements (With More Time)

*   **Interactive Chat Context:** Persist chat histories in local database tables or sessions so the copilot can maintain multi-turn context (e.g. asking clarifying questions and building upon previous answers).
*   **Enhanced Graph Integrations:** Enable the Copilot to dynamically generate Custom Recharts configurations on-the-fly and display them inline in the chat bubble.
*   **Automatic Syncing:** Implement webhooks on Monday.com so updates to the boards automatically trigger server-side updates rather than requiring manual page refreshes.
