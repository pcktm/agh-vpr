# import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import Base
from database import engine, get_db
from routers.places import router as places_routers
from routers.users import router as users_routers
import os

Base.metadata.create_all(bind=engine)
get_db()

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

path = "VPR/images_from_user"
if not os.path.exists(path):
    os.mkdir(path)

app.include_router(places_routers)
app.include_router(users_routers)
# uvicorn.run(app, host="127.0.0.1", port=5000, log_level="info")

