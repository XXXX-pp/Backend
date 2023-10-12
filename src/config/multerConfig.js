import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDirectory = './uploads';

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const generateUniqueFilename = (file) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const fileExtension = path.extname(file.originalname);
  return `${uniqueSuffix}-${file.originalname}`;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, generateUniqueFilename(file));
  },
});

const allowedFileTypes = ['.png', '.jpg', '.jpeg', '.gif'];
const fileFilter = (req, file, cb) => {
  const fileExtension = path.extname(file.originalname);
  if (allowedFileTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

export const upload = multer({ storage, fileFilter });

export default upload;
