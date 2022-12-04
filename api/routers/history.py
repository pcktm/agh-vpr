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


@router.delete("/", status_code=204)
async def delete_user_history(
        user: schemas.User = Depends(crud.get_current_user),
        db: Session = Depends(get_db)
):
    await crud.delete_user_history(db, user)
    return {"message", "Successfully Deleted"}


@router.delete("/{history_id}", status_code=204)
async def delete_from_history(
        history_id: int,
        user: schemas.User = Depends(crud.get_current_user),
        db: Session = Depends(get_db)
):
    await crud.delete_from_history(db, user, history_id)
    return {"message", "Successfully Deleted"}
