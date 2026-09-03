from fastapi import Depends, FastAPI, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import ImageRecord

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Image Gallery API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ImageOut(BaseModel):
    id: str
    name: str
    url: str


def to_image_out(record: ImageRecord, request: Request) -> ImageOut:
    base_url = str(request.base_url).rstrip("/")
    return ImageOut(id=record.id, name=record.name, url=f"{base_url}/images/{record.id}/file")


@app.get("/")
def root() -> dict:
    return {"status": "ok"}


@app.post("/images", status_code=201)
async def upload_image(request: Request, file: UploadFile, db: Session = Depends(get_db)) -> ImageOut:
    data = await file.read()
    record = ImageRecord(
        name=file.filename or "upload",
        content_type=file.content_type or "application/octet-stream",
        data=data,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return to_image_out(record, request)


@app.get("/images")
def list_images(request: Request, db: Session = Depends(get_db)) -> list[ImageOut]:
    records = db.query(ImageRecord).order_by(ImageRecord.created_at.desc()).all()
    return [to_image_out(record, request) for record in records]


@app.get("/images/{image_id}")
def get_image(image_id: str, request: Request, db: Session = Depends(get_db)) -> ImageOut:
    record = db.get(ImageRecord, image_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return to_image_out(record, request)


@app.get("/images/{image_id}/file")
def get_image_file(image_id: str, db: Session = Depends(get_db)) -> Response:
    record = db.get(ImageRecord, image_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return Response(content=record.data, media_type=record.content_type)
