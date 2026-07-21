from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json

from app.services.monday_service import MondayService

router = APIRouter()


# ==========================================================
# REQUEST MODEL
# ==========================================================
class CreateDealRequest(BaseModel):
    name: str
    status: str = "No Status"
    dueDate: str = ""


# ==========================================================
# GET ALL BOARDS
# ==========================================================
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


# ==========================================================
# GET DEALS
# ==========================================================
@router.get("/deals")
def get_deals():

    query = """
    query {
      boards(ids: 5030093845) {
        id
        name

        columns {
          id
          title
          type
        }

        items_page {
          items {
            id
            name

            column_values {
              id
              text
              type
            }
          }
        }
      }
    }
    """

    try:
        result = MondayService.execute_query(query)
        return result["data"]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==========================================================
# CREATE DEAL
# ==========================================================
@router.post("/deals")
def create_deal(deal: CreateDealRequest):

    column_values = {
        "status": {"label": deal.status},
        "date4": {
            "date": deal.dueDate
        } if deal.dueDate else None
    }

    # Remove empty values
    column_values = {
        k: v for k, v in column_values.items() if v is not None
    }

    query = """
    mutation (
        $boardId: ID!,
        $itemName: String!,
        $columnValues: JSON!
    ) {
        create_item(
            board_id: $boardId,
            item_name: $itemName,
            column_values: $columnValues
        ) {
            id
            name
        }
    }
    """

    variables = {
        "boardId": 5030093845,
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


# ==========================================================
# GET WORK ORDERS
# ==========================================================
@router.get("/work-orders")
def get_work_orders():

    query = """
    query {
      boards(ids: 5030094086) {
        id
        name

        items_page {
          items {
            id
            name

            column_values {
              id
              text
              type
            }
          }
        }
      }
    }
    """

    try:
        result = MondayService.execute_query(query)
        return result["data"]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))