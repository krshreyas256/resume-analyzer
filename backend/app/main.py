 
# main.py
import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from .parsers import extract_text_from_file
from fastapi.middleware.cors import CORSMiddleware
from .analyzer import analyze_resume


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="Resume Analyzer (Step 1)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    filename = file.filename
    if not filename or "." not in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    save_path = os.path.join(UPLOAD_DIR, filename)
    try:
        content = await file.read()
        with open(save_path, "wb") as f:
            f.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")

    try:
        text = extract_text_from_file(save_path, filename)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract text: {e}")

    analysis = analyze_resume(text)

    return JSONResponse({
    "filename": filename,
    "text_snippet": text[:2000],
    "full_text": text,
    "analysis": analysis
})

