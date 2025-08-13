const fs = require('fs').promises;
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const extractTextFromDocument = async (filePath, mimetype) => {
  const buffer = await fs.readFile(filePath);

  switch (mimetype) {
    case 'application/pdf':
      const pdfData = await pdfParse(buffer);
      return pdfData.text;

    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/msword':
      const docxResult = await mammoth.extractRawText({ buffer });
      return docxResult.value;

    case 'text/plain':
      return buffer.toString('utf8');

    default:
      throw new Error('סוג קובץ לא נתמך');
  }
};

module.exports = {
  extractTextFromDocument
};
