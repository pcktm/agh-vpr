from fastapi import APIRouter, UploadFile, File, Depends
import shutil
from sqlalchemy.orm import Session
from utils import best_match, add_image_to_file

from database import get_db
import crud
import schemas

router = APIRouter(
    tags=['Place'],
    prefix='/place'
)


@router.post("/find")
async def find_place(file: UploadFile = File(...), db: Session = Depends(get_db)):
    with open(f'ImgFromUser/{file.filename}', 'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)
    places = best_match(file.filename, db)

    return places


@router.post("/add")
async def add_place(file: UploadFile = File(...), db: Session = Depends(get_db)):
    with open(f'ImgFromUser/{file.filename}', 'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)

    add_image_to_file(file.filename)
    # add_img_to_database
    # add_place_to_database
    pass

