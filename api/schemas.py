from pydantic import BaseModel

import datetime as dt
import json


class HistoryBase(BaseModel):
    date: dt.datetime
    place_id: int
    user_id: int


class HistoryCreate(HistoryBase):
    pass


class History(HistoryBase):
    id: int

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    email: str
    first_name: str
    last_name: str


class UserCreate(UserBase):
    hashed_password: str

    class Config:
        orm_mode = True


class User(UserBase):
    id: int
    history: list[History] = []

    class Config:
        orm_mode = True


class ImageBase(BaseModel):
    image: str
    place_id: int
    # key_points: str
    # score: str
    # descriptor: str


class ImageCreate(ImageBase):
    pass


class Image(ImageBase):
    id: int

    class Config:
        orm_mode = True


class PlaceBase(BaseModel):
    name: str
    address: str
    description: str


class PlaceCreate(PlaceBase):
    pass


class Place(BaseModel):
    id: int
    main_image_id: int
    images: list[Image] = []
    histories: list[History] = []

    class Config:
        orm_mode = True

    @classmethod
    def __get_validators__(cls):
        yield cls.validate_to_json

    @classmethod
    def validate_to_json(cls, value):
        if isinstance(value, str):
            return cls(**json.loads(value))
        return value
