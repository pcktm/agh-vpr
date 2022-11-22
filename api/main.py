from fastapi import FastAPI
from Places.routers import router as places_routers


app = FastAPI()

app.include_router(places_routers)

