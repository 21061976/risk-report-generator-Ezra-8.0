const path = require('path');
const sanitizeFilename = require('sanitize-filename');

const validateFileType = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      error: true,
      message: 'לא נבחר קובץ להעלאה'
    });
  }

  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain'
  ];

  const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt'];
  const fileExtension = path.extname(req.file.originalname).toLowerCase();

  if (!allowedMimeTypes.includes(req.file.mimetype) || !allowedExtensions.includes(fileExtension)) {
    return res.status(400).json({
      error: true,
      message: `סוג קובץ לא נתמך. נתמכים: ${allowedExtensions.join(', ')}`,
      receivedType: req.file.mimetype,
      receivedExtension: fileExtension
    });
  }

  // Check file size (10MB limit)
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024;
  if (req.file.size > maxSize) {
    return res.status(400).json({
      error: true,
      message: `הקובץ גדול מדי. מקסימום: ${Math.round(maxSize / 1024 / 1024)}MB`,
      fileSize: Math.round(req.file.size / 1024 / 1024 * 100) / 100
    });
  }

  next();
};

const sanitizeFileName = (filename) => {
  // Remove path traversal attempts
  const baseName = path.basename(filename);
  
  // Sanitize the filename
  const sanitized = sanitizeFilename(baseName);
  
  // Ensure it's not empty
  if (!sanitized || sanitized.length === 0) {
    return `document_${Date.now()}.txt`;
  }
  
  return sanitized;
};

module.exports = {
  validateFileType,
  sanitizeFileName
};
