from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Float
from sqlalchemy.orm import relationship
import passlib.hash as _hash
import datetime as date

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    lastly_logged = Column(DateTime, index=True)

    user_history = relationship("History")

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.hashed_password)


class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, index=True)
    address = Column(String, index=True)
    description = Column(String, index=True)
    main_image_id = Column(Integer, index=True)
    creator_id = Column(Integer, index=True)
    longitude = Column(Float, index=True)
    latitude = Column(Float, index=True)

    images = relationship("Image", back_populates="place")
    # histories = relationship("History", back_populates='place')


class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    place_id = Column(Integer, ForeignKey("places.id"))
    image = Column(String, index=True)

    place = relationship("Place", back_populates="images")


class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    place_id = Column(Integer, ForeignKey("places.id"))
    date = Column(DateTime, default=date.datetime.utcnow)

