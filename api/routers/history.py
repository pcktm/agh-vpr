from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.database import get_db
import api.crud as crud
import api.schemas as schemas
import api.utils as utils

router = APIRouter(
    tags=['History'],
    prefix='/history'
)


@router.get("/")
async def get_history(user: schemas.User = Depends(crud.get_current_user),
                      db: Session = Depends(get_db)):
    return await utils.get_places_from_history(user, db)


@router.delete("/", status_code=204)
async def delete_user_history(
        user: schemas.User = Depends(crud.get_current_user),
        db: Session = Depends(get_db)
):
    await crud.delete_user_history(db, user)
    return {"message", "Successfully Deleted"}

