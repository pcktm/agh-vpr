from fastapi import APIRouter, HTTPException, Depends, security
from sqlalchemy.orm import Session

from database import get_db
import crud
import schemas

router = APIRouter(
    tags=['User'],
    prefix='/user'
)


@router.post("/register")
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = await crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = crud.create_user(db=db, user=user)

    return await crud.create_token(user)


@router.post("/token")
async def generate_token(
    form_data: security.OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = await crud.authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    return await crud.create_token(user)


@router.get("/me", response_model=schemas.User)
async def get_user(user: schemas.User = Depends(crud.get_current_user)):
    return user


@router.get("/places")
async def get_user_created_places(db: Session = Depends(get_db),
                                  user: schemas.User = Depends(crud.get_current_user)):
    return await crud.get_user_created_places(db, user.id)
