import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIRECTORY = './uploads';
const ALLOWED_IMAGE_FILE_TYPES = ['.png', '.jpg', '.jpeg', '.gif'];
const ALLOWED_VIDEO_FILE_TYPES = ['.mp4', '.mov', '.avi'];

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIRECTORY)) {
  try {
    fs.mkdirSync(UPLOAD_DIRECTORY);
  } catch (err) {
    console.error('Error creating upload directory:', err.message);
    process.exit(1);
  }
}

const generateUniqueFilename = (file) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const fileExtension = path.extname(file.originalname);
  return `${uniqueSuffix}-${file.originalname}`;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIRECTORY);
  },
  filename: (req, file, cb) => {
    cb(null, generateUniqueFilename(file));
  },
});

const fileFilter = (req, file, cb) => {
  const fileExtension = path.extname(file.originalname);
  const isImage = ALLOWED_IMAGE_FILE_TYPES.includes(fileExtension);
  const isVideo = ALLOWED_VIDEO_FILE_TYPES.includes(fileExtension);

  if (isImage || isVideo) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
