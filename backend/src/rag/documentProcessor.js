const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Clean extracted text by normalizing whitespace, line breaks, and removing invalid characters
 */
const cleanText = (rawText) => {
  if (!rawText) return '';
  return rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
};

/**
 * Extract text from file based on file extension
 */
const extractTextFromFile = async (filePath, fileType) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found at path: ${filePath}`);
  }

  let extractedText = '';

  try {
    const ext = fileType ? fileType.toLowerCase() : filePath.split('.').pop().toLowerCase();

    if (ext === 'pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;
    } else if (ext === 'docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;
    } else if (ext === 'txt') {
      extractedText = fs.readFileSync(filePath, 'utf-8');
    } else {
      throw new Error(`Unsupported file type: ${ext}. Only PDF, DOCX, and TXT are supported.`);
    }

    const cleaned = cleanText(extractedText);
    if (!cleaned) {
      throw new Error('Extracted text is empty or unreadable.');
    }

    return cleaned;
  } catch (error) {
    console.error(`[Document Processor Error]: ${error.message}`);
    throw new Error(`Failed to extract text from document: ${error.message}`);
  }
};

module.exports = {
  extractTextFromFile,
  cleanText,
};
