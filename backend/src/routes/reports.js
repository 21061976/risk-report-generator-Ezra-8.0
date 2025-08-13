const express = require('express');
const { body, validationResult } = require('express-validator');
const { 
  generateReport, 
  getReport, 
  updateReport, 
  exportReport,
  listReports 
} = require('../controllers/reportController');

const router = express.Router();

// Validation middleware
const validateReportData = [
  body('documentId').isUUID().withMessage('מזהה מסמך לא תקין'),
  body('projectName').trim().isLength({ min: 1, max: 100 }).withMessage('שם פרויקט נדרש'),
  body('organization').trim().isLength({ min: 1, max: 100 }).withMessage('שם ארגון נדרש'),
  body('goals').isArray({ min: 1, max: 3 }).withMessage('נדרשות 1-3 מטרות'),
  body('risks').isArray({ min: 1, max: 5 }).withMessage('נדרשים 1-5 סיכונים')
];

// Routes
router.post('/generate', validateReportData, generateReport);
router.get('/', listReports);
router.get('/:reportId', getReport);
router.put('/:reportId', validateReportData, updateReport);
router.post('/:reportId/export', 
  [body('format').isIn(['pdf', 'html', 'docx']).withMessage('פורמט לא נתמך')],
  exportReport
);

module.exports = router;
