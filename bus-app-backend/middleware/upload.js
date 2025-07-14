// Multer config for file uploads (aadhaar, etc.)
import multer from 'multer';

const storage = multer.memoryStorage();
export const upload = multer({ storage });