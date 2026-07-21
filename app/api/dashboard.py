from fastapi import APIRouter
from app.services.monday_service import MondayService

router = APIRouter()

@router.get("/dashboard")
def dashboard():
    # Query the new board 5030102338 with limit 500
    query = """
    query {
      boards(ids: 5030102338) {
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
    """

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

        # Map column values based on board 5030102338 mappings:
        # Status Value -> text_mm5fj5gd
        # Owner Code -> text_mm5fk8zf
        # Date -> date4
        for col in item["column_values"]:
            if col["id"] == "text_mm5fj5gd":
                status = col["text"] or "No Status"
            elif col["id"] == "text_mm5fk8zf":
                owner = col["text"] or "Unassigned"
            elif col["id"] == "date4":
                due = col["text"] or ""

        deals.append({
            "id": item["id"],
            "name": item["name"],
            "status": status,
            "owner": owner,
            "dueDate": due
        })

        pipeline[status] = pipeline.get(status, 0) + 1
        owners[owner] = owners.get(owner, 0) + 1

    return {
        "totalDeals": len(deals),
        "deals": deals,
        "salesPipeline": pipeline,
        "dealOwners": owners
    }