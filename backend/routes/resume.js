import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { extractTextFromFile } from '../utils/parsers.js';
import { analyzeResume } from '../utils/analyzer.js';
import Resume from '../models/Resume.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '../uploads');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.docx', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${ext}`));
  }
};

const upload = multer({ storage, fileFilter });

// Upload and analyze resume
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filepath = req.file.path;
    const originalName = req.file.originalname;

    // Extract text from file
    let fullText;
    try {
      fullText = await extractTextFromFile(filepath, originalName);
    } catch (error) {
      fs.unlinkSync(filepath); // Delete uploaded file
      return res.status(400).json({ error: error.message });
    }

    // Analyze resume
    const analysis = analyzeResume(fullText);

    // Save to MongoDB
    const resume = new Resume({
      filename: req.file.filename,
      originalName: originalName,
      fileSize: req.file.size,
      fullText: fullText,
      analysis: analysis
    });

    await resume.save();

    // Return response
    res.json({
      id: resume._id,
      filename: originalName,
      text_snippet: fullText.substring(0, 2000),
      full_text: fullText,
      analysis: analysis
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

// Get resume by ID
router.get('/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all resumes
router.get('/', async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ uploadedAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete resume
router.delete('/:id', async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Delete file from disk
    const filepath = path.join(uploadsDir, resume.filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
