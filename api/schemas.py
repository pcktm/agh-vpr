from pydantic import BaseModel

import datetime as dt


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


class UserCreate(UserBase):
    hashed_password: str

    class Config:
        orm_mode = True


class User(UserBase):
    id: int
    first_name: str
    last_name: str
    history: list[History] = []

    class Config:
        orm_mode = True


class ImageBase(BaseModel):
    image: str
    key_points: str
    score: str
    descriptor: str


class ImageCreate(ImageBase):
    pass


class Image(ImageBase):
    id: int
    place_id: int

    class Config:
        orm_mode = True


class PlaceBase(BaseModel):
    name: str
    address: str
    description: str
    images: list[Image] = []


class PlaceCreate(PlaceBase):
    pass


class Place(BaseModel):
    id: int
    histories: list[History] = []

    class Config:
        orm_mode = True
