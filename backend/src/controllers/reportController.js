const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const { documents } = require('./documentController');
const { buildEZRAPrompt } = require('../utils/promptBuilder');
const { parseClaudeResponse } = require('../utils/responseParser');
const { generateHTMLReport } = require('../utils/htmlGenerator');
const logger = require('winston');

// In-memory storage for reports (replace with database in production)
const reports = new Map();

const generateReport = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: true,
        message: 'נתונים לא תקינים',
        details: errors.array()
      });
    }

    const { documentId, projectName, organization, customInstructions } = req.body;
    
    // Get document
    const document = documents.get(documentId);
    if (!document) {
      return res.status(404).json({
        error: true,
        message: 'מסמך לא נמצא'
      });
    }

    if (!document.extractedText) {
      return res.status(400).json({
        error: true,
        message: 'המסמך לא עובד או ריק'
      });
    }

    const reportId = uuidv4();
    const report = {
      id: reportId,
      documentId,
      projectName,
      organization,
      status: 'generating',
      createdAt: new Date().toISOString(),
      progress: 0
    };

    reports.set(reportId, report);

    // Start report generation asynchronously
    generateReportAsync(reportId, document, { projectName, organization, customInstructions })
      .catch(error => {
        logger.error('Report generation failed:', error);
        report.status = 'error';
        report.error = error.message;
        reports.set(reportId, report);
      });

    res.json({
      success: true,
      reportId,
      message: 'הדוח בהכנה',
      status: 'generating'
    });

  } catch (error) {
    logger.error('Generate report error:', error);
    res.status(500).json({
      error: true,
      message: 'שגיאה ביצירת הדוח'
    });
  }
};

const generateReportAsync = async (reportId, document, options) => {
  const report = reports.get(reportId);
  
  try {
    // Step 1: Build EZRA prompt
    report.progress = 10;
    report.status = 'analyzing';
    reports.set(reportId, report);

    const prompt = buildEZRAPrompt(document.extractedText, options);
    logger.info(`Built EZRA prompt for report ${reportId}, length: ${prompt.length}`);

    // Step 2: Call Claude API
    report.progress = 20;
    report.status = 'processing_with_claude';
    reports.set(reportId, report);

    const claudeResponse = await callClaudeAPI(prompt);
    
    // Step 3: Parse Claude response
    report.progress = 60;
    report.status = 'parsing_response';
    reports.set(reportId, report);

    const parsedData = parseClaudeResponse(claudeResponse);
    
    // Step 4: Generate HTML report
    report.progress = 80;
    report.status = 'generating_html';
    reports.set(reportId, report);

    const htmlContent = generateHTMLReport(parsedData, options);
    
    // Step 5: Save report
    report.progress = 100;
    report.status = 'completed';
    report.content = parsedData;
    report.htmlContent = htmlContent;
    report.completedAt = new Date().toISOString();
    reports.set(reportId, report);

    logger.info(`Report ${reportId} generated successfully`);

  } catch (error) {
    logger.error(`Report generation failed for ${reportId}:`, error);
    report.status = 'error';
    report.error = error.message;
    report.progress = 0;
    reports.set(reportId, report);
  }
};

const callClaudeAPI = async (prompt) => {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Claude API Key לא מוגדר במשתני הסביבה');
  }

  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      timeout: 60000 // 1 minute timeout
    });

    if (!response.data.content || !response.data.content[0]) {
      throw new Error('תגובה ריקה מ-Claude API');
    }

    return response.data.content[0].text;

  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error?.message || error.response.statusText;
      
      if (status === 401) {
        throw new Error('Claude API Key לא תקין');
      } else if (status === 429) {
        throw new Error('יותר מדי בקשות ל-Claude API, נסה שוב מאוחר יותר');
      } else if (status === 400) {
        throw new Error(`בקשה לא תקינה ל-Claude: ${message}`);
      } else {
        throw new Error(`שגיאת Claude API (${status}): ${message}`);
      }
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('זמן ההמתנה ל-Claude API פג, נסה שוב');
    } else {
      throw new Error(`שגיאה בקריאה ל-Claude API: ${error.message}`);
    }
  }
};

const getReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = reports.get(reportId);

    if (!report) {
      return res.status(404).json({
        error: true,
        message: 'דוח לא נמצא'
      });
    }

    // Don't send the full HTML content in the status check
    const reportStatus = {
      id: report.id,
      documentId: report.documentId,
      projectName: report.projectName,
      organization: report.organization,
      status: report.status,
      progress: report.progress,
      createdAt: report.createdAt,
      completedAt: report.completedAt,
      error: report.error
    };

    // Include content only if completed
    if (report.status === 'completed' && report.content) {
      reportStatus.content = report.content;
      reportStatus.hasHtml = !!report.htmlContent;
    }

    res.json({
      success: true,
      report: reportStatus
    });

  } catch (error) {
    logger.error('Get report error:', error);
    res.status(500).json({
      error: true,
      message: 'שגיאה בטעינת הדוח'
    });
  }
};

const updateReport = async (req, res) => {
  // Implementation for updating reports
  res.json({ success: true, message: 'עדכון דוח - בפיתוח' });
};

const exportReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { format } = req.body;
    
    const report = reports.get(reportId);
    if (!report || report.status !== 'completed') {
      return res.status(404).json({
        error: true,
        message: 'דוח לא נמצא או לא הושלם'
      });
    }

    switch (format) {
      case 'html':
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="report-${reportId}.html"`);
        res.send(report.htmlContent);
        break;

      case 'pdf':
        res.status(501).json({
          error: true,
          message: 'ייצוא ל-PDF עדיין לא מוטמע'
        });
        break;

      default:
        res.status(400).json({
          error: true,
          message: 'פורמט לא נתמך'
        });
    }

  } catch (error) {
    logger.error('Export report error:', error);
    res.status(500).json({
      error: true,
      message: 'שגיאה בייצוא הדוח'
    });
  }
};

const listReports = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const allReports = Array.from(reports.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(offset, offset + parseInt(limit))
      .map(report => ({
        id: report.id,
        projectName: report.projectName,
        organization: report.organization,
        status: report.status,
        progress: report.progress,
        createdAt: report.createdAt,
        completedAt: report.completedAt
      }));

    res.json({
      success: true,
      reports: allReports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: reports.size
      }
    });

  } catch (error) {
    logger.error('List reports error:', error);
    res.status(500).json({
      error: true,
      message: 'שגיאה בטעינת רשימת הדוחות'
    });
  }
};

module.exports = {
  generateReport,
  getReport,
  updateReport,
  exportReport,
  listReports,
  reports // Export for testing
};
