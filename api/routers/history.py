from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
import crud
import schemas

router = APIRouter(
    tags=['History'],
    prefix='/history'
)


@router.get("/", response_model=List[schemas.History])
async def get_history(user: schemas.User = Depends(crud.get_current_user)):
    return user.history


@router.get("/{history_id}")
async def get_history_entity(
        history_id: int,
        user: schemas.User = Depends(crud.get_current_user),
        db: Session = Depends(get_db)
):
    return await crud.get_history_entity(db, user, history_id)
