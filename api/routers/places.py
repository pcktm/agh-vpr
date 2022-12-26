from fastapi import BackgroundTasks, APIRouter, UploadFile, File, Depends, HTTPException, security
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
async def find_place(file: UploadFile = File(...), db: Session = Depends(get_db),
                     user: schemas.User = Depends(crud.get_current_user_or_none)):

    image = cv2.imdecode(np.fromstring(await file.read(), np.uint8), cv2.IMREAD_UNCHANGED)
    if image is None:
        raise HTTPException(status_code=415, detail="Unsupported Media Type, attach an image.")
    places = best_match(image, db)
    if user is not None:
        place_id = places[0]['id']
        await crud.add_to_history(db, user, place_id)
    return places


@router.post("/create")
async def create_place(background_tasks: BackgroundTasks,
                       place: schemas.PlaceCreate = Depends(),
                       file: UploadFile = File(...), db: Session = Depends(get_db),
                       user: schemas.User = Depends(crud.get_current_user)):

    image = cv2.imdecode(np.fromstring(await file.read(), np.uint8), cv2.IMREAD_UNCHANGED)
    if image is None:
        raise HTTPException(status_code=415, detail="Unsupported Media Type, attach an image.")

    if not crud.exist_by_name(db, place.name) and not crud.exist_by_address(db, place.address):

        db_place = await crud.create_place(db, place)
        n = crud.get_number_of_images(db) + 1

        file_path = f'images_from_user/image{n}.png'
        cv2.imwrite(f"VPR/{file_path}", image)

        image_schema = schemas.ImageCreate(place_id=db_place.id, image=file_path)
        db_image = await crud.add_image(db, image_schema)
        await crud.update_main_image_id(db, db_place.id, db_image.id)

        background_tasks.add_task(add_image_to_file(file_path, image))

        return {"message", "Place successfully added ;)"}
    else:
        return {"message", "Place already exists in database"}
