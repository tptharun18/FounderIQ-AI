from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.monday_service import MondayService

router = APIRouter()

class DealCreate(BaseModel):
    name: str
    status: str
    dueDate: str | None = None

@router.post("/deals")
def create_deal(deal: DealCreate):
    query = """
    mutation ($board: ID!, $group: String!, $name: String!) {
      create_item(
        board_id: $board,
        group_id: $group,
        item_name: $name
      ) {
        id
      }
    }
    """

    import os
    board_id = int(os.getenv("MONDAY_BOARD_ID", "5030102714"))
    variables = {
        "board": board_id,
        "group": "group_mm5fav3p", # Deal funnel group
        "name": deal.name
    }

    try:
        result = MondayService.execute_query(query, variables)
        return result["data"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))