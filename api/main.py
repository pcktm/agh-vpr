from fastapi import FastAPI
from sqlalchemy.orm import Session

from Places.routers import router as places_routers
from models import Base
from database import SessionLocal, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app.include_router(places_routers)

