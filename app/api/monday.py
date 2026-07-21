from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import os

from app.services.monday_service import MondayService

router = APIRouter()

class CreateDealRequest(BaseModel):
    name: str
    status: str = "No Status"
    dueDate: str = ""

@router.get("/boards")
def get_boards():
    query = """
    query {
      boards {
        id
        name
      }
    }
    """
    try:
        result = MondayService.execute_query(query)
        return result["data"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/deals")
def get_deals():
    board_id = int(os.getenv("MONDAY_BOARD_ID", "5030102714"))
    query = """
    query {
      boards(ids: %d) {
        id
        name
        columns {
          id
          title
          type
        }
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
              type
            }
          }
        }
      }
    }
    """ % board_id
    try:
        result = MondayService.execute_query(query)
        board = result["data"]["boards"][0]
        filtered_items = []
        for item in board["items_page"]["items"]:
            group_id = item.get("group", {}).get("id") or ""
            group_title = item.get("group", {}).get("title") or ""
            if "Deal" in group_title or group_id == "group_mm5fav3p":
                if item["name"].lower() not in ["deal name", "deal name masked"]:
                    filtered_items.append(item)
                    
        board["items_page"]["items"] = filtered_items
        return {"boards": [board]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/deals")
def create_deal(deal: CreateDealRequest):
    board_id = int(os.getenv("MONDAY_BOARD_ID", "5030102714"))
    column_values = {
        "text_mm5fj5gd": deal.status,
        "date4": {
            "date": deal.dueDate
        } if deal.dueDate else None
    }

    column_values = {
        k: v for k, v in column_values.items() if v is not None
    }

    query = """
    mutation (
        $boardId: ID!,
        $groupId: String!,
        $itemName: String!,
        $columnValues: JSON!
    ) {
        create_item(
            board_id: $boardId,
            group_id: $groupId,
            item_name: $itemName,
            column_values: $columnValues
        ) {
            id
            name
        }
    }
    """

    variables = {
        "boardId": board_id,
        "groupId": "group_mm5fav3p",
        "itemName": deal.name,
        "columnValues": json.dumps(column_values)
    }

    try:
        result = MondayService.execute_query(query, variables)
        return {
            "success": True,
            "message": "Deal created successfully",
            "data": result["data"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/work-orders")
def get_work_orders():
    board_id = int(os.getenv("MONDAY_BOARD_ID", "5030102714"))
    query = """
    query {
      boards(ids: %d) {
        id
        name
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
              type
            }
          }
        }
      }
    }
    """ % board_id
    try:
        result = MondayService.execute_query(query)
        board = result["data"]["boards"][0]
        filtered_items = []
        for item in board["items_page"]["items"]:
            group_id = item.get("group", {}).get("id") or ""
            group_title = item.get("group", {}).get("title") or ""
            if "Work" in group_title or group_id == "group_mm5fqxrf":
                if item["name"].lower() not in ["deal name", "deal name masked"]:
                    filtered_items.append(item)
                    
        board["items_page"]["items"] = filtered_items
        return {"boards": [board]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))