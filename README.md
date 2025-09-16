AI Powered Resume Analyzer:

A full-stack web application that extracts and analyzes resumes in .pdf, .docx, and .txt formats.
The system provides structured insights such as skills, email addresses, and phone numbers using NLP.

Features:

* Upload resumes in PDF, Word, or TXT format

* Extract text content automatically

* AI-powered analysis to detect:

  * Skills

  * Emails

  * Phone numbers

Full-stack implementation with FastAPI backend and React frontend

Tech Stack

Backend: FastAPI, Python, PyPDF2, python-docx, spaCy

Frontend: React (JavaScript)

Other: CORS Middleware, Regex

Getting Started

Backend (FastAPI)
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

Frontend (React)
cd frontend
npm install
npm start

Project Structure
resume-analyzer/
│── backend/
│   ├── app/
│   │   ├── main.py        # FastAPI entry point
│   │   ├── parsers.py     # Resume text extraction
│   │   ├── analyzer.py    # NLP-based analysis
│── frontend/
│   ├── src/
│   │   └── App.js         # React UI for uploading and viewing results

Future Improvements:

* Extract years of experience from resume text

* Match resume skills against a job description

* Add database for storing and comparing resumes

Author
K R Shreyas