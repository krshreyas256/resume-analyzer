AI Powered Resume Analyzer

A full-stack web application that extracts and analyzes resumes in .pdf, .docx, and .txt formats.
The system provides structured insights such as skills, email addresses, phone numbers, and **ATS (Applicant Tracking System) scores** using NLP and pattern matching.

Features

* Upload resumes in PDF, Word, or TXT format

* Extract text content automatically

* **ATS Score Calculation** - Get instant feedback on how well your resume will perform with automated screening systems

* **AI-powered analysis** using spaCy NLP to detect:
  * Skills (40+ technical skills database)
  * Email addresses
  * Phone numbers
  * Names (using Named Entity Recognition)
  * Organizations/Companies (using NER)
  * Dates (work experience timeline)

* **Smart Improvement Suggestions** - Receive actionable recommendations to improve your resume:
  * Contact information completeness
  * Skills optimization
  * Content length analysis
  * Resume structure validation
  * Section recommendations

* **Beautiful Modern UI** with color-coded scoring and categorized suggestions

Full-stack MERN (MongoDB, Express, React, Node.js) implementation

Tech Stack

**Frontend:**
- **React 19.x** - Modern JavaScript UI library
- **JavaScript/JSX** - Frontend code

**Backend:**
- **Express.js** - Node.js web framework for API
- **Node.js 16+** - JavaScript runtime
- **MongoDB** - NoSQL database for storing resumes and analysis
- **Multer** - File upload middleware
- **pdf-parse** - PDF text extraction
- **Mammoth** - Word document parsing
- **Regex** - Pattern matching for emails, phones

**Prerequisites:**
- Node.js 16 or higher
- npm or yarn
- MongoDB 4.4 or higher (local or MongoDB Atlas)

**Backend Setup (Express.js)**

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection:
```
MONGODB_URI=mongodb://localhost:27017/resume-analyzer
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. Start the backend server:
```bash
npm start
```
   Or for development with hot reload:
```bash
npm run dev
```

**Frontend Setup (React)**

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000` and the backend API on `http://localhost:8000`
How It Works

1. **File Upload** - User uploads resume via React frontend
2. **Text Extraction** - Backend parses PDF/DOCX/TXT using appropriate library (pdf-parse, mammoth, or fs)
3. **Information Extraction**:
   - Regex patterns extract emails and phone numbers
   - Keyword matching identifies technical skills
   - Basic NER approach extracts names, organizations, and dates
4. **ATS Scoring** - Algorithm calculates score (0-100) based on:
   - Contact information completeness (20 points)
   - Skills quantity and diversity (25 points)
   - Personal information (10 points)
   - Work experience indicators (20 points)
   - Resume length optimization (10 points)
   - Section structure (15 points)
5. **Data Storage** - Resume analysis is saved to MongoDB
6. **Suggestions Generation** - Smart recommendations based on missing elements
7. **Results Display** - Beautiful UI shows score, suggestions, and extracted data

**MongoDB Setup**

**Option 1: Local MongoDB**
1. Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service (it will run on localhost:27017 by default)
3. Update `.env` file with `MONGODB_URI=mongodb://localhost:27017/resume-analyzer`

**Option 2: MongoDB Atlas (Cloud)**
1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Update `.env` file with your connection string: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-analyzer`

**Running the Application**

1. Start MongoDB (if using local installation)
2. Open terminal in `backend` directory and run: `npm start`
3. Open another terminal in `frontend` directory and run: `npm start`
4. Frontend will open at `http://localhost:3000`
5. Backend API is available at `http://localhost:8000`

**Using Docker**

To run the entire application using Docker and Docker Compose:

1. Install [Docker](https://www.docker.com/) and Docker Compose
2. In the project root directory, run:
```bash
docker-compose up --build
```

3. The application will be available at:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`
   - MongoDB: `localhost:27017`

To stop the application:
```bash
docker-compose down
```

ATS Score Breakdown

- **80-100**: Excellent - Well-optimized for ATS systems
- **60-79**: Good - Room for improvement
- **40-59**: Fair - Needs significant updates
- **0-39**: Needs Improvement - Major changes required

Future Enhancements

* Train custom NER model for job-specific entities
* Extract years of experience automatically
* Match resume against job descriptions
* Calculate skill match percentage
* Add database for resume history tracking
* PDF/DOCX report generation
* Integration with LinkedIn profiles

**Project Migration Notes**

This project was originally built with a Python FastAPI backend and has been successfully converted to a full MERN stack:

- **Python FastAPI** → **Express.js/Node.js**
- **spaCy NLP** → **JavaScript pattern matching + basic NER**
- **PyPDF2** → **pdf-parse**
- **python-docx** → **Mammoth**
- **File system storage** → **MongoDB**

The frontend React component remains largely the same with updated API endpoints to match the new backend structure.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/upload` | Upload and analyze a resume |
| GET | `/api/resume` | Get all uploaded resumes |
| GET | `/api/resume/:id` | Get a specific resume by ID |
| DELETE | `/api/resume/:id` | Delete a resume |
| GET | `/api/health` | Health check endpoint |

## Project Structure

```
resume-analyzer/
├── backend/
│   ├── package.json          # Backend dependencies
│   ├── server.js             # Express entry point
│   ├── .env                  # Environment configuration
│   ├── models/
│   │   └── Resume.js         # MongoDB Resume schema
│   ├── routes/
│   │   └── resume.js         # API routes
│   ├── utils/
│   │   ├── parsers.js        # Resume text extraction
│   │   └── analyzer.js       # Resume analysis logic
│   └── uploads/              # Uploaded resume files
├── frontend/
│   ├── package.json          # Frontend dependencies
│   ├── public/
│   │   └── index.html        # HTML template
│   └── src/
│       ├── App.js            # React main component
│       ├── App.css           # Styles
│       └── index.js          # React entry point
└── docker-compose.yml        # Docker orchestration
```

## Troubleshooting

**Backend won't start:**
- Check if port 8000 is already in use: `netstat -ano | findstr :8000`
- Ensure MongoDB is running or properly configured in `.env`
- Run `npm install` again to ensure all dependencies are installed

**Frontend shows "Cannot connect to backend":**
- Verify backend is running: `curl http://localhost:8000/api/health`
- Check that `FRONTEND_URL` in backend `.env` includes your frontend URL

**MongoDB connection errors:**
- For local MongoDB: Ensure MongoDB service is running
- For MongoDB Atlas: Verify connection string and IP whitelist

**File upload fails:**
- Ensure backend is running
- Check file format (PDF, DOCX, or TXT only)
- Verify MongoDB is connected

## Additional Features

* Future: Multi-language support
* Future: Custom skills database per industry
* Future: Resume comparison and matching
* Future: Export analysis reports as PDF

Author
K R Shreyas