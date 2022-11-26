from fastapi import APIRouter, UploadFile, File, Depends
import shutil
from sqlalchemy.orm import Session
from utils import match

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
    image = match(file.filename)[1]

    place_id = crud.get_image_by_name(db, image).place_id
    place = crud.get_place(db, place_id)

    return {place.name, place.address, place.description}
