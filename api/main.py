# import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from Places.routers import router as places_routers
from Accounts.routers import router as accounts_routers
from models import Base
from database import engine

Base.metadata.create_all(bind=engine)

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

app.include_router(places_routers)
app.include_router(accounts_routers)
# uvicorn.run(app, host="127.0.0.1", port=5000, log_level="info")

