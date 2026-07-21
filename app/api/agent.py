import os
import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests

from app.services.monday_service import MondayService

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

def fetch_monday_context():
    # 1. Fetch Deals
    deals_query = """
    query {
      boards(ids: 5030093845) {
        name
        items_page {
          items {
            id
            name
            column_values {
              id
              text
            }
          }
        }
      }
    }
    """
    
    # 2. Fetch Work Orders
    wo_query = """
    query {
      boards(ids: 5030094086) {
        name
        items_page {
          items {
            id
            name
            column_values {
              id
              text
            }
          }
        }
      }
    }
    """
    
    deals_data = []
    wo_data = []
    
    try:
        deals_res = MondayService.execute_query(deals_query)
        boards = deals_res.get("data", {}).get("boards", [])
        if boards:
            items = boards[0].get("items_page", {}).get("items", [])
            for item in items:
                deal = {"name": item["name"]}
                for cv in item.get("column_values", []):
                    if cv["id"] == "status":
                        deal["status"] = cv["text"]
                    elif cv["id"] == "person":
                        deal["owner"] = cv["text"]
                    elif cv["id"] == "date4":
                        deal["dueDate"] = cv["text"]
                deals_data.append(deal)
    except Exception as e:
        print("Error fetching deals:", e)

    try:
        wo_res = MondayService.execute_query(wo_query)
        boards = wo_res.get("data", {}).get("boards", [])
        if boards:
            items = boards[0].get("items_page", {}).get("items", [])
            for item in items:
                wo = {"name": item["name"]}
                for cv in item.get("column_values", []):
                    if cv["id"] == "dropdown_mm5fvd3y":
                        wo["equipment_type"] = cv["text"]
                    elif cv["id"] == "timerange_mm5fnsgm":
                        wo["timeline"] = cv["text"]
                    elif cv["id"] == "color_mm5fm0bh":
                        wo["status"] = cv["text"]
                    elif cv["id"] == "numeric_mm5fr0bn":
                        wo["estimated_cost"] = cv["text"]
                    elif cv["id"] == "text_mm5fdzke":
                        wo["description"] = cv["text"]
                    elif cv["id"] == "color_mm5fx65f":
                        wo["priority"] = cv["text"]
                    elif cv["id"] == "multiple_person_mm5fv5c1":
                        wo["assigned_to"] = cv["text"]
                wo_data.append(wo)
    except Exception as e:
        print("Error fetching work orders:", e)

    return {
        "deals": deals_data,
        "work_orders": wo_data
    }

def fallback_local_agent(user_message: str, data: dict) -> str:
    msg = user_message.lower()
    deals = data.get("deals", [])
    wo = data.get("work_orders", [])
    
    response = []
    response.append("⚠️ **Notice:** OpenAI API key is missing in the backend `.env` file. Operating in local fallback query matching mode.\n")
    
    if "deal" in msg or "pipeline" in msg or "sales" in msg:
        response.append(f"### Deals Summary (Sales Pipeline)")
        response.append(f"Total deals in system: **{len(deals)}**")
        status_counts = {}
        for d in deals:
            st = d.get("status") or "No Status"
            status_counts[st] = status_counts.get(st, 0) + 1
        response.append("\n**Pipeline Breakdowns:**")
        for st, count in status_counts.items():
            response.append(f"- **{st}**: {count} deals")
            
    elif "work order" in msg or "task" in msg or "order" in msg or "equipment" in msg or "cost" in msg:
        response.append(f"### Work Orders Summary")
        response.append(f"Total work orders in system: **{len(wo)}**")
        
        # Calculate cost
        total_cost = 0
        status_counts = {}
        for w in wo:
            st = w.get("status") or "No Status"
            status_counts[st] = status_counts.get(st, 0) + 1
            cost_str = w.get("estimated_cost") or "0"
            try:
                total_cost += float(cost_str.replace(",", "").strip())
            except ValueError:
                pass
        
        response.append(f"Total Estimated Cost: **${total_cost:,.2f}**")
        response.append("\n**Work Order Statuses:**")
        for st, count in status_counts.items():
            response.append(f"- **{st}**: {count} orders")
            
    else:
        response.append("### Business Intelligence Agent Overview")
        response.append(f"Currently tracking **{len(deals)} deals** and **{len(wo)} work orders** dynamically connected to your Monday.com board.")
        response.append("\nTry asking things like:")
        response.append("- *How's the sales pipeline looking?*")
        response.append("- *Tell me about our work orders and estimated costs.*")
        
    return "\n".join(response)

@router.post("/chat")
def chat(payload: ChatRequest):
    data = fetch_monday_context()
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        reply = fallback_local_agent(payload.message, data)
        return {"reply": reply}
        
    system_prompt = f"""You are FounderIQ AI, a highly capable Executive Business Intelligence Copilot.
Your job is to answer founder-level business queries about sales deals and project work orders.
You have dynamic access to the live Monday.com boards data provided below.

LIVE DATA CONTEXT:
1. DEALS BOARD (Sales Pipeline):
{json.dumps(data["deals"], indent=2)}

2. WORK ORDERS BOARD (Project Execution & Cost):
{json.dumps(data["work_orders"], indent=2)}

DIRECTIONS:
1. Always be conversational, concise, professional, and insightful.
2. Answer founder queries directly (e.g. summary metrics, aggregates, and sector health).
3. If data is incomplete or missing, state the caveat clearly (do not make up numbers).
4. If a query is ambiguous, ask brief clarifying questions.
5. Provide actionable insights (e.g., highlighting bottlenecks, heavy workloads, or sales wins) alongside numbers.
"""

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    chat_payload = {
        "model": "gpt-4o",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": payload.message}
        ],
        "temperature": 0.3
    }
    
    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=chat_payload,
            timeout=30
        )
        if response.status_code == 200:
            res_json = response.json()
            reply = res_json["choices"][0]["message"]["content"]
            return {"reply": reply}
        else:
            print("OpenAI Error:", response.text)
            reply = fallback_local_agent(payload.message, data)
            return {"reply": f"⚠️ **Notice:** OpenAI API call failed (HTTP {response.status_code}). Falling back to local agent.\n\n{reply}"}
    except Exception as e:
        print("OpenAI Request Exception:", e)
        reply = fallback_local_agent(payload.message, data)
        return {"reply": f"⚠️ **Notice:** OpenAI request timed out/failed. Falling back to local agent.\n\n{reply}"}
