const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { uploadDocument, processDocument, getDocument } = require('../controllers/documentController');
const { validateFileType, sanitizeFileName } = require('../middleware/fileValidation');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: (req, file, cb) => {
    const sanitizedName = sanitizeFileName(file.originalname);
    const timestamp = Date.now();
    cb(null, `${timestamp}-${sanitizedName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('סוג קובץ לא נתמך. אנא העלה PDF, Word או טקסט.'), false);
    }
  }
});

// Routes
router.post('/upload', 
  upload.single('document'),
  validateFileType,
  [
    body('projectName').optional().trim().isLength({ min: 1, max: 100 }),
    body('organization').optional().trim().isLength({ min: 1, max: 100 }),
    body('description').optional().trim().isLength({ max: 500 })
  ],
  uploadDocument
);

router.post('/process/:documentId', processDocument);
router.get('/:documentId', getDocument);

module.exports = router;
