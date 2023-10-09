import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define the upload directory and ensure it exists
const uploadDirectory = './uploads';

// Ensure the upload directory exists or create it
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

// Define a function to generate a unique filename
const generateUniqueFilename = (file) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const fileExtension = path.extname(file.originalname);
  return `${uniqueSuffix}-${file.originalname}`;
};

// Create the Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, generateUniqueFilename(file));
  },
});

// Create a file filter function to allow specific file types
const allowedFileTypes = ['.png', '.jpg', '.jpeg', '.gif'];
const fileFilter = (req, file, cb) => {
  const fileExtension = path.extname(file.originalname);
  if (allowedFileTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

// Initialize Multer with the storage and file filter configurations
export const upload = multer({ storage, fileFilter });

export default upload;
