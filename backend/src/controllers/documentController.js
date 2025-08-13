const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { v4: uuidv4 } = require('uuid');
const { extractTextFromDocument } = require('../utils/textExtractor');
const { validateDocument } = require('../utils/documentValidator');
const logger = require('winston');

// In-memory storage (replace with database in production)
const documents = new Map();

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: 'לא הועלה קובץ'
      });
    }

    const documentId = uuidv4();
    const document = {
      id: documentId,
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadTime: new Date().toISOString(),
      projectName: req.body.projectName || '',
      organization: req.body.organization || '',
      description: req.body.description || '',
      status: 'uploaded',
      extractedText: null
    };

    // Extract text from document
    try {
      const filePath = path.join(process.env.UPLOAD_DIR || './uploads', req.file.filename);
      const extractedText = await extractTextFromDocument(filePath, req.file.mimetype);
      
      if (!extractedText || extractedText.length < 100) {
        throw new Error('המסמך ריק או לא ניתן לחלץ ממנו טקסט משמעותי');
      }

      document.extractedText = extractedText;
      document.status = 'processed';
      
      // Validate document content
      const validation = await validateDocument(extractedText);
      document.validation = validation;
      
    } catch (error) {
      logger.error('Text extraction failed:', error);
      document.status = 'error';
      document.error = error.message;
    }

    documents.set(documentId, document);

    res.json({
      success: true,
      documentId,
      document: {
        id: document.id,
        originalName: document.originalName,
        size: document.size,
        status: document.status,
        projectName: document.projectName,
        organization: document.organization,
        validation: document.validation,
        textLength: document.extractedText?.length || 0
      }
    });

  } catch (error) {
    logger.error('Document upload error:', error);
    res.status(500).json({
      error: true,
      message: 'שגיאה בהעלאת המסמך',
      details: error.message
    });
  }
};

const processDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = documents.get(documentId);

    if (!document) {
      return res.status(404).json({
        error: true,
        message: 'מסמך לא נמצא'
      });
    }

    if (document.status !== 'uploaded') {
      return res.status(400).json({
        error: true,
        message: 'המסמך כבר עובד או שיש שגיאה'
      });
    }

    // Process document asynchronously
    document.status = 'processing';
    documents.set(documentId, document);

    // Simulate processing delay
    setTimeout(() => {
      document.status = 'processed';
      documents.set(documentId, document);
    }, 2000);

    res.json({
      success: true,
      message: 'המסמך בעיבוד',
      status: 'processing'
    });

  } catch (error) {
    logger.error('Document processing error:', error);
    res.status(500).json({
      error: true,
      message: 'שגיאה בעיבוד המסמך'
    });
  }
};

const getDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = documents.get(documentId);

    if (!document) {
      return res.status(404).json({
        error: true,
        message: 'מסמך לא נמצא'
      });
    }

    // Don't send the full file content, just metadata
    const documentMetadata = {
      id: document.id,
      originalName: document.originalName,
      size: document.size,
      status: document.status,
      uploadTime: document.uploadTime,
      projectName: document.projectName,
      organization: document.organization,
      description: document.description,
      validation: document.validation,
      textLength: document.extractedText?.length || 0,
      textPreview: document.extractedText?.substring(0, 200) + '...'
    };

    res.json({
      success: true,
      document: documentMetadata
    });

  } catch (error) {
    logger.error('Get document error:', error);
    res.status(500).json({
      error: true,
      message: 'שגיאה בטעינת המסמך'
    });
  }
};

module.exports = {
  uploadDocument,
  processDocument,
  getDocument,
  documents // Export for access from other modules
};
