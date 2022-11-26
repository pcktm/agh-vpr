# TODO: def get_user_history()
# TODO: def add_place()
# TODO: def delete_from_history()
# TODO: def delete_user()
# TODO: def clear_user_history()
# etc...
from sqlalchemy.orm import Session

import models
import schemas


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    first_name = user.first_name
    last_name = user.last_name
    fake_hashed_password = user.hashed_password + "notreallyhashed"
    db_user = models.User(email=user.email, hashed_password=fake_hashed_password, first_name=first_name,
                          last_name=last_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_place(db: Session, place_id: int):
    return db.query(models.Place).filter(models.Place.id == place_id).first()


def get_all_places(db: Session):
    return db.query(models.Place)


def get_image_by_name(db: Session, image: str):
    return db.query(models.Image).filter(models.Image.image == image).first()
