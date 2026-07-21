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

    variables = {
        "board": 5030093845,
        "group": "topics",
        "name": deal.name
    }

    try:
        result = MondayService.execute_query(query, variables)
        return result["data"]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))