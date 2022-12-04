from fastapi import APIRouter, UploadFile, File, Depends, Form
import shutil
import cv2
import numpy as np
from sqlalchemy.orm import Session
from utils import best_match, add_image_to_file
import cv2
import numpy as np

from database import get_db
import crud
import schemas

router = APIRouter(
    tags=['Place'],
    prefix='/place'
)


@router.post("/find")
async def find_place(file: UploadFile = File(...), db: Session = Depends(get_db)):
    image = cv2.imdecode(np.fromstring(await file.read(), np.uint8), cv2.IMREAD_UNCHANGED)
    places = best_match(image, db)

    return places


@router.post("/add")
async def add_place(place: schemas.PlaceCreate = Depends(), file: UploadFile = File(...), db: Session = Depends(get_db),
                    user: schemas.User = Depends(crud.get_current_user)):

    db_place = await crud.add_place(db, place)

    file_path = f'images_from_user/{file.filename}'
    with open(f'VPR/{file_path}', 'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)

    image = schemas.ImageCreate(place_id=db_place.id, image=file_path)
    db_image = await crud.add_image(db, image)
    await crud.update_main_image_id(db, db_place.id, db_image.id)

    # add_image_to_file(file_path)
    return "image successfully added ;)"

