from fastapi import APIRouter
from app.services.monday_service import MondayService

router = APIRouter()


@router.get("/dashboard")
def dashboard():

    query = """
    query {
      boards(ids: 5030093845) {
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

    result = MondayService.execute_query(query)

    items = result["data"]["boards"][0]["items_page"]["items"]

    deals = []
    pipeline = {}
    owners = {}

    for item in items:

        status = "No Status"
        owner = "Unassigned"
        due = ""

        for col in item["column_values"]:

            if col["id"] == "status":
                status = col["text"] or "No Status"

            if col["id"] == "person":
                owner = col["text"] or "Unassigned"

            if col["id"] == "date":
                due = col["text"]

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