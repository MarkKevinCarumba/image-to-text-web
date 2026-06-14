# 📝 Image to Text OCR Web Application

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/frontend-React.js-61DAFB.svg)
![Python](https://img.shields.io/badge/backend-Python-3776AB.svg)
![Tesseract](https://img.shields.io/badge/OCR-Tesseract-4CAF50.svg)

A modern, high-performance Image-to-Text (OCR) web application that seamlessly extracts text from images. Designed with a decoupled full-stack architecture, it ensures secure, fast, and scalable document processing suitable for both personal utility and enterprise integrations.

## ✨ Value Proposition

- **Precision & Speed:** Utilizes Tesseract OCR combined with OpenCV image preprocessing (grayscale conversion, OTSU thresholding) for highly accurate text extraction.
- **Frictionless UX:** Supports drag-and-drop, clipboard pasting, and direct URL uploads to minimize user effort.
- **Scalable Architecture:** A clean separation of concerns between a responsive React frontend and a robust Python REST API.

## 🚀 Features

### 🎨 Frontend Experience

- **Intuitive Uploads:** Drag & drop, clipboard paste, and URL import support.
- **Batch Processing:** Seamlessly handle multiple image uploads simultaneously.
- **Real-time Feedback:** Interactive UI indicating processing state and extraction success.
- **Export Options:** One-click copy to clipboard and text file download capabilities.
- **Responsive Design:** Fluid layout optimized for desktop, tablet, and mobile devices.

### ⚙️ Backend Engine

- **Advanced Preprocessing:** Uses `OpenCV` and `NumPy` for noise reduction and binarization, boosting OCR accuracy.
- **Robust OCR:** Integration with `PyTesseract` for industry-standard text recognition.
- **Stateless API:** RESTful architecture designed for quick horizontal scaling.

## 🛠 Tech Stack

**Frontend:**

- React.js (JavaScript/ES6+)
- Modular CSS

**Backend:**

- Python 3.x
- OpenCV (`cv2`) & NumPy (Image Preprocessing)
- PyTesseract (Optical Character Recognition)
- Pillow (PIL) (Image Handling)
- Web Framework (e.g., FastAPI / Flask / Django)

## 🧩 Architecture & Project Structure

```text
local-ocr/
├── frontend/               # React UI
│   ├── src/
│   ├── public/
│   └── package.json
└── backend/                # Python API
    ├── app/
    │   ├── services/
    │   │   └── ocr_services.py  # OpenCV & Tesseract logic
    │   └── main.py
    └── requirements.txt
```

## 📦 Getting Started

### Prerequisites

- **Node.js** (v16+)
- **Python** (3.8+)
- **Tesseract OCR Binary:** Must be installed and added to your system's PATH.
  - _Windows:_ Tesseract at UB-Mannheim
  - _Mac:_ `brew install tesseract`
  - _Linux:_ `sudo apt-get install tesseract-ocr`

### 1. Clone the Repository

```bash
git clone https://github.com/MarkKevinCarumba/image-to-text-web.git
cd local-ocr
```
