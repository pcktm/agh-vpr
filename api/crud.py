# TODO: def delete_user()

from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException
from database import get_db

import passlib.hash
import fastapi.security
from datetime import datetime
import jwt

import models
import schemas

oauth2schema = fastapi.security.OAuth2PasswordBearer(tokenUrl="/user/token")

JWT_SECRET = "myjwtsecret"


# user functions
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


async def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    first_name = user.first_name
    last_name = user.last_name
    hashed_password = passlib.hash.bcrypt.hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password, first_name=first_name,
                          last_name=last_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


async def authenticate_user(email: str, password: str, db: Session):
    user = await get_user_by_email(db=db, email=email)

    if not user:
        return False

    if not user.verify_password(password):
        return False

    return user


async def create_token(user: models.User):
    user_obj = schemas.User.from_orm(user)

    token = jwt.encode({'id': user_obj.id}, JWT_SECRET)

    return dict(access_token=token, token_type="bearer")


async def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2schema),
):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(models.User).get(payload["id"])
    except:
        raise HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )

    return schemas.User.from_orm(user)


# places functions
def get_place(db: Session, place_id: int):
    return db.query(models.Place).filter(models.Place.id == place_id).first()


def get_all_places(db: Session):
    return db.query(models.Place)


def exist_by_name(db: Session, place_name):
    place = db.query(models.Place).filter(models.Place.name == place_name).first()

    if place is None:
        return False

    return True


def exist_by_address(db: Session, place_address):
    place = db.query(models.Place).filter(models.Place.address == place_address).first()

    if place is None:
        return False

    return True


async def create_place(db: Session, place: schemas.PlaceCreate):
    # print(place.name)
    db_place = models.Place(name=place.name, address=place.address, description=place.description, main_image_id=0)

    db.add(db_place)
    db.commit()
    db.refresh(db_place)
    return db_place


async def update_main_image_id(db: Session, place_id: int, image_id: int):
    place = db.query(models.Place).filter(models.Place.id == place_id).first()
    place.main_image_id = image_id

    db.commit()
    db.refresh(place)
    return place


# images functions
def get_image_by_name(db: Session, image: str):
    image = db.query(models.Image).filter(models.Image.image == image).first()

    return image


def get_number_of_images(db: Session):
    return db.query(models.Image).count()


def get_image_by_id(db: Session, image_id: int):
    return db.query(models.Image).filter(models.Image.id == image_id).first()


async def add_image(db: Session, image: schemas.ImageCreate):
    image_name = image.image
    place_id = image.place_id
    db_image = models.Image(image=image_name, place_id=place_id)

    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image


# history functions
async def get_user_history(db: Session, user_id: int):
    history = db.query(models.History).filter(models.History.user_id == user_id)

    return list(map(schemas.History.from_orm, history))


async def history_selector(history_id: int, user: schemas.User, db: Session):
    history = (
        db.query(models.History)
        .filter_by(user_id=user.id)
        .filter(models.History.id == history_id)
        .first()
    )

    if history is None:
        raise HTTPException(status_code=404, detail="This place does not exist in history.")

    return history


async def get_history_entity(db: Session, user: schemas.User, history_id: int):
    return await history_selector(history_id, user, db)


async def delete_from_history(db: Session, user: schemas.User, history_id: int):
    db_history = await history_selector(history_id, user, db)

    db.delete(db_history)
    db.commit()


async def delete_user_history(db: Session, user: schemas.User):
    user_history = db.query(models.History).filter_by(user_id=user.id)

    for history in user_history:
        db.delete(history)
        db.commit()


async def add_to_history(db: Session, user: schemas.User, place_id: int):
    date = datetime.now()

    db_history = models.History(place_id=place_id, user_id=user.id, date=date)
    db.add(db_history)
    db.commit()
    db.refresh(db_history)

    return db_history

