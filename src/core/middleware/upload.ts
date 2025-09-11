import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { config } from '../config';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads', 'pdfs');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter to only allow PDFs
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'));
  }
};

// Multer instance
export const uploadPdf = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.upload.pdfMaxSize, // PDF size limit from environment variable
  }
});

// Middleware for single PDF upload
export const uploadSinglePdf = uploadPdf.single('pdf');

// Middleware for multiple PDF uploads
export const uploadMultiplePdfs = uploadPdf.array('pdfs', config.upload.pdfMaxFiles); // Max files from environment variable
