# Response Structure

from pydantic import BaseModel
from typing import List

class OCRResult(BaseModel):
    filename: str
    text: str | None = None


class OCRResponse(BaseModel):
    success: bool
    results: List[OCRResult]