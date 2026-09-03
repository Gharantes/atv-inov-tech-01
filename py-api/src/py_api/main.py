import uuid

from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class Image(BaseModel):
    id: str
    url: str
    name: str


app = FastAPI(title="Image Gallery API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

_PLACEHOLDER_PHOTO_IDS = [10, 20, 30, 40, 50, 60]

_images: list[Image] = [
    Image(id="1", url="https://picsum.photos/id/10/400/300", name="forest.jpg"),
    Image(id="2", url="https://picsum.photos/id/20/400/300", name="laptop.jpg"),
    Image(id="3", url="https://picsum.photos/id/30/400/300", name="keyboard.jpg"),
    Image(id="4", url="https://picsum.photos/id/40/400/300", name="plant.jpg"),
    Image(id="5", url="https://picsum.photos/id/50/400/300", name="mountains.jpg"),
    Image(id="6", url="https://picsum.photos/id/60/400/300", name="road.jpg"),
]


@app.get("/")
def root() -> dict:
    return {"status": "ok"}


@app.post("/images", status_code=201)
def upload_image(file: UploadFile) -> Image:
    photo_id = _PLACEHOLDER_PHOTO_IDS[len(_images) % len(_PLACEHOLDER_PHOTO_IDS)]
    image = Image(
        id=str(uuid.uuid4()),
        url=f"https://picsum.photos/id/{photo_id}/400/300",
        name=file.filename or "upload.jpg",
    )
    _images.insert(0, image)
    return image


@app.get("/images")
def list_images() -> list[Image]:
    return _images


@app.get("/images/{image_id}")
def get_image(image_id: str) -> Image:
    for image in _images:
        if image.id == image_id:
            return image
    raise HTTPException(status_code=404, detail="Image not found")
