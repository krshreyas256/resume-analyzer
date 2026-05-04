import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromFile(filepath, filename) {
  const ext = path.extname(filename).toLowerCase();

  switch (ext) {
    case '.txt':
      return parseTxt(filepath);
    case '.pdf':
      return await parsePdf(filepath);
    case '.docx':
      return await parseDocx(filepath);
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}

function parseTxt(filepath) {
  try {
    const text = fs.readFileSync(filepath, 'utf-8');
    return text;
  } catch (error) {
    throw new Error(`Error reading TXT: ${error.message}`);
  }
}

async function parsePdf(filepath) {
  try {
    const fileBuffer = fs.readFileSync(filepath);
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (error) {
    throw new Error(`Error reading PDF: ${error.message}`);
  }
}

async function parseDocx(filepath) {
  try {
    const result = await mammoth.extractRawText({ path: filepath });
    return result.value;
  } catch (error) {
    throw new Error(`Error reading DOCX: ${error.message}`);
  }
}
