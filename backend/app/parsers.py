# app/parsers.py
import os
from PyPDF2 import PdfReader
import docx

def extract_text_from_file(filepath: str, filename: str) -> str:
    ext = os.path.splitext(filename)[1].lower()

    if ext == ".txt":
        return _parse_txt(filepath)
    elif ext == ".pdf":
        return _parse_pdf(filepath)
    elif ext == ".docx":
        return _parse_docx(filepath)
    else:
        raise ValueError(f"Unsupported file type: {ext}")

def _parse_txt(filepath: str) -> str:
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()

def _parse_pdf(filepath: str) -> str:
    text = ""
    try:
        reader = PdfReader(filepath)
        for page in reader.pages:
            text += page.extract_text() or ""
    except Exception as e:
        raise ValueError(f"Error reading PDF: {e}")
    return text.strip()

def _parse_docx(filepath: str) -> str:
    text = ""
    try:
        doc = docx.Document(filepath)
        for para in doc.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        raise ValueError(f"Error reading DOCX: {e}")
    return text.strip()
