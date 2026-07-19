# endpoint
"""
@router — Modular route system (production standard)
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from fastapi.concurrency import run_in_threadpool
from app.services.ocr_services import extract_text_from_image
from app.schemas.ocr_scremas import OCRResponse, OCRResult

import logging

router = APIRouter()

logger = logging.getLogger(__name__)

# Add health check
@router.get("/health")
async def health_check():
    return {"status": "ok"}

"""
FastAPI internally does something similar to:

files = [
    UploadFile(image1.png),
    UploadFile(image2.jpg),
    UploadFile(image3.webp)
]

It is not receiving three separate API calls.
"""
@router.post('/convert', response_model=OCRResponse)
async def convert_image_to_text(files: List[UploadFile] = File(...)):
    results = []

    MAX_FILE = 20

    if len(files) > MAX_FILE:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum of {MAX_FILE} files allowed.")

    for file in files:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail=f"File '{file.filename}' is not a valid image.")
            
        image_bytes = await file.read()

        MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


        if len(image_bytes) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File '{file.filename}' exceeds 10MB Limit.")
        
        try:
            # Run CPU-bound OCR task in a separate thread to prevent blocking the event loop
            text = await run_in_threadpool(extract_text_from_image, image_bytes)
            results.append({
                "filename": file.filename,
                "text": text
            })
        except Exception as e:
            logger.error(f"OCR failed for '{file.filename}': {e}")
            raise HTTPException(status_code=500, detail=f"OCR failed for '{file.filename}'")

    return {
        "success": True,
        "results": results
    }


"""
? files: List[UploadFile] = File(...)

This has 3 different roles working together, not just one “file holder”.

1. List[UploadFile]
❌ Your interpretation:

“default syntax for receiving file, used to accept multiple files”

✅ Correct interpretation:
UploadFile = a single uploaded file object
List[UploadFile] = a container (Python list) of multiple UploadFile objects
What it actually means:

👉 “I expect a list where each item is an uploaded file.”

📌 Important clarification

List[UploadFile] is NOT FastAPI-specific syntax.

It is just Python typing:

List[T] = a list of items of type T

So here:

each item = UploadFile
whole thing = list of files
📦 Example actual value

If user uploads 3 files:

files = [
    UploadFile(filename="a.png"),
    UploadFile(filename="b.png"),
    UploadFile(filename="c.png")
]

So yes:
👉 List[UploadFile] is literally a Python list of UploadFile objects

2. UploadFile
What it actually is

Each UploadFile contains:

filename
content_type (image/png, etc.)
file stream (not loaded yet)
methods like .read()
Why it exists

Because FastAPI does NOT give raw bytes immediately.

Instead it gives a wrapper object that:

efficiently handles large files
avoids loading everything into memory immediately
3. File(...)
❌ Your interpretation:

“option type / required indicator / stores file”

✅ Correct interpretation:

File(...) is NOT storing anything.

It is only a FastAPI instruction:

👉 “This parameter comes from an HTTP file upload (multipart/form-data).”

What ... means
File(...)

The ... means:
👉 “this field is required”


? image_bytes = await file.read() 

What it does
Reads the actual file content into raw bytes
Why we use it
OCR engines (like Tesseract/OpenCV) don’t work with UploadFile objects directly
They need:
👉 raw image data (bytes)
Why await
File reading is I/O operation
await prevents blocking other requests

? text = extract_text_from_image(image_bytes)

"""