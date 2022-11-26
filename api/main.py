from fastapi import FastAPI
from sqlalchemy.orm import Session

from Places.routers import router as places_routers
from Accounts.routers import router as accounts_routers
from models import Base
from database import SessionLocal, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()



app.include_router(places_routers)
app.include_router(accounts_routers)


