# ORC Logics

import pytesseract
import cv2
import numpy as np 
from PIL import Image
import io

def preprocess_image(image):
    """
    Convert image to grayscale + noise reduction for better OCR accuracy
    """
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY) # Converts to Black and White
    
    # optional: thresholding improves text clarity
    gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1] # Turns image into pure black and white pixels

    return gray

def extract_text_from_image(image_bytes: bytes) -> str: #  -> str return type hint
    """
    Main OCR function
    """

    # Ensure image is in RGB mode (handles PNGs with transparency correctly)
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = np.array(image) # Convert PIL → NumPy array

    # preprocess 
    processed = preprocess_image(image)

    # OCR 
    text = pytesseract.image_to_string(processed) # this communicates to local Tesseract, tesseract must be added in system path

    return text.strip()
"""
 
? image = Image.open(io.BytesIO(image_bytes))
✔️ What it does
Converts raw bytes into a readable image object (PIL)
Why this is needed

Uploaded files come as:

binary bytes

But libraries like PIL/OpenCV need:

image object / array

So:
👉 we wrap bytes into a stream (BytesIO)
👉 then PIL reads it as an image
"""
