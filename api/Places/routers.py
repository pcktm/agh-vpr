from fastapi import APIRouter, UploadFile, File, Depends
import shutil
from sqlalchemy.orm import Session
from utils import best_match

from database import get_db
import crud
import schemas

router = APIRouter(
    tags=['Find'],
    prefix='/find'
)


@router.post("/")
async def root(file: UploadFile = File(...), db: Session = Depends(get_db)):
    with open(f'ImgFromUser/{file.filename}', 'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)
    places = best_match(file.filename, db)

    return places
