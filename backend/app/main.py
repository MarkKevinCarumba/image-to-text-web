from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router
import uvicorn # This will be used to provide default host and port

app = FastAPI(
    title="Image to Text API",
    description="OCR backend using FastAPI and Tesseract",
    version="0.0.1",
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"],
)

#
app.include_router(api_router, prefix="/ocr")

# Default host and port
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
    # Then run `python -m app.main` on the terminal