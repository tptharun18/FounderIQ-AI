from fastapi import APIRouter
from app.services.monday_service import MondayService
import os

router = APIRouter()

@router.get("/dashboard")
def dashboard():
    board_id = int(os.getenv("MONDAY_BOARD_ID", "5030102338"))
    query = """
    query {
      boards(ids: %d) {
        items_page(limit: 500) {
          items {
            id
            name
            group {
              id
              title
            }
            column_values {
              id
              text
            }
          }
        }
      }
    }
    """ % board_id

    result = MondayService.execute_query(query)
    items = result["data"]["boards"][0]["items_page"]["items"]

    deals = []
    pipeline = {}
    owners = {}

    for item in items:
        group_id = item.get("group", {}).get("id") or ""
        group_title = item.get("group", {}).get("title") or ""
        
        # We only want Deals group items
        if "Deal" not in group_title and group_id != "group_mm5fav3p":
            continue
            
        # Ignore placeholder headers
        if item["name"].lower() in ["deal name", "deal name masked"]:
            continue

        status = "No Status"
        owner = "Unassigned"
        due = ""
        val_cost = "0"
        stage_work = "None"
        sector_val = "Other"

        # Map column values based on board 5030102338 mappings:
        # - Status Value -> text_mm5fj5gd
        # - Owner Code -> text_mm5fk8zf
        # - Date -> date4
        # - Value/Cost -> text_mm5f67d0
        # - Deal Stage -> text_mm5fpxb9
        # - Sector -> text_mm5fxv12
        for col in item["column_values"]:
            if col["id"] == "text_mm5fj5gd":
                status = col["text"] or "No Status"
            elif col["id"] == "text_mm5fk8zf":
                owner = col["text"] or "Unassigned"
            elif col["id"] == "date4":
                due = col["text"] or ""
            elif col["id"] == "text_mm5f67d0":
                val_cost = col["text"] or "0"
            elif col["id"] == "text_mm5fpxb9":
                stage_work = col["text"] or "None"
            elif col["id"] == "text_mm5fxv12":
                sector_val = col["text"] or "Other"

        deals.append({
            "id": item["id"],
            "name": item["name"],
            "status": status,
            "owner": owner,
            "dueDate": due,
            "deal_value": val_cost,
            "deal_stage": stage_work,
            "sector": sector_val
        })

        pipeline[status] = pipeline.get(status, 0) + 1
        owners[owner] = owners.get(owner, 0) + 1

    return {
        "totalDeals": len(deals),
        "deals": deals,
        "salesPipeline": pipeline,
        "dealOwners": owners
    }