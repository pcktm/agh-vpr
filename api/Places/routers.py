from fastapi import APIRouter, UploadFile, File
import shutil
from utils import match

router = APIRouter(
    tags=['Find'],
    prefix='/find'
)


@router.post("/")
async def root(file: UploadFile = File(...)):
    with open(f'ImgFromUser/{file.filename}', 'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)
    best = match(file.filename)
    return {best[0], best[1]}
