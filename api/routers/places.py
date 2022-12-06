from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
import shutil
import cv2
import numpy as np
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
    try:
        image = cv2.imdecode(np.fromstring(await file.read(), np.uint8), cv2.IMREAD_UNCHANGED)
    except:
        raise HTTPException(status_code=415, detail="Unsupported Media Type, attach an image.")
    places = best_match(image, db)

    return places


@router.post("/find/{place_id}")
async def add_place_to_history(place_id: int,
                               user: schemas.User = Depends(crud.get_current_user),
                               db: Session = Depends(get_db)):
    await crud.add_to_history(db, user, place_id)

    return {"message", "Successfully added to history"}


@router.post("/create")
async def create_place(place: schemas.PlaceCreate = Depends(),
                    file: UploadFile = File(...), db: Session = Depends(get_db),
                    user: schemas.User = Depends(crud.get_current_user)):

    db_place = await crud.create_place(db, place)
    n = crud.get_number_of_images(db) + 1

    file_path = f'images_from_user/image{n}.png'
    with open(f'VPR/images/{file_path}', 'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)

    image = schemas.ImageCreate(place_id=db_place.id, image=file_path)
    db_image = await crud.add_image(db, image)
    await crud.update_main_image_id(db, db_place.id, db_image.id)

    add_image_to_file(file_path)
    return {"message", "Place successfully added ;)"}

