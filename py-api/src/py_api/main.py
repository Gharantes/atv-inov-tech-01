from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Image Gallery API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict:
    return {"status": "ok"}


@app.post("/images")
def upload_image(file: UploadFile) -> dict:
    raise HTTPException(status_code=501, detail="Not implemented yet")


@app.get("/images")
def list_images() -> list:
    raise HTTPException(status_code=501, detail="Not implemented yet")


@app.get("/images/{image_id}")
def get_image(image_id: int) -> dict:
    raise HTTPException(status_code=501, detail="Not implemented yet")
