const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const DocumentChunk = require('../models/DocumentChunk');
const { extractTextFromFile } = require('../rag/documentProcessor');
const { createChunks } = require('../rag/textChunker');
const { generateEmbedding } = require('../rag/embeddingService');

/**
 * Process document pipeline: extract -> chunk -> embed -> save vector chunks
 */
const processDocumentPipeline = async (document) => {
  try {
    document.status = 'PROCESSING';
    await document.save();

    // 1. Extract text
    const cleanText = await extractTextFromFile(document.filePath, document.fileType);
    document.extractedTextLength = cleanText.length;

    // 2. Clear old chunks if reprocessing
    await DocumentChunk.deleteMany({ documentId: document._id });

    // 3. Chunk text
    const chunks = createChunks(cleanText, { chunkSize: 600, chunkOverlap: 120 });
    document.chunkCount = chunks.length;

    // 4. Generate embeddings and save chunks
    const chunkPromises = chunks.map(async (chunk) => {
      const embedding = await generateEmbedding(chunk.text);
      return new DocumentChunk({
        documentId: document._id,
        text: chunk.text,
        chunkIndex: chunk.chunkIndex,
        embedding,
        metadata: {
          title: document.title,
          fileName: document.fileName,
          category: document.category,
          fileType: document.fileType,
        },
      });
    });

    const chunkDocs = await Promise.all(chunkPromises);
    await DocumentChunk.insertMany(chunkDocs);

    // 5. Update document status to READY
    document.status = 'READY';
    document.errorMessage = null;
    await document.save();

    console.log(`[Document Processed Successfully]: ${document.title} (${document.chunkCount} chunks index stored)`);
  } catch (error) {
    console.error(`[Document Processing Pipeline Error]: ${error.message}`);
    document.status = 'FAILED';
    document.errorMessage = error.message;
    await document.save();
  }
};

// @desc    Upload new document & trigger RAG pipeline
// @route   POST /api/documents/upload
// @access  Private (Admin)
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file (.pdf, .docx, or .txt).' });
    }

    const { title, category } = req.body;
    const fileType = path.extname(req.file.originalname).substring(1).toLowerCase();

    const document = await Document.create({
      title: title || req.file.originalname,
      fileName: req.file.originalname,
      fileType,
      category: category || 'General',
      uploadedBy: req.user._id,
      filePath: req.file.path,
      status: 'PROCESSING',
    });

    // Run processing pipeline asynchronously
    processDocumentPipeline(document);

    return res.status(201).json({
      success: true,
      message: 'Document uploaded successfully and background indexing started.',
      document,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all documents with search and filtering
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res) => {
  try {
    const { category, search, status } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { fileName: { $regex: search, $options: 'i' } },
      ];
    }

    const documents = await Document.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single document by ID
// @route   GET /api/documents/:id
// @access  Private
const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate('uploadedBy', 'name email');
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const chunks = await DocumentChunk.find({ documentId: document._id })
      .select('-embedding')
      .sort({ chunkIndex: 1 });

    return res.json({
      success: true,
      document,
      chunks,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reprocess document pipeline
// @route   POST /api/documents/:id/reprocess
// @access  Private (Admin)
const reprocessDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    processDocumentPipeline(document);

    return res.json({
      success: true,
      message: 'Reprocessing triggered for document.',
      document,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete document & associated vector chunks
// @route   DELETE /api/documents/:id
// @access  Private (Admin)
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // 1. Remove file from disk
    if (fs.existsSync(document.filePath)) {
      try {
        fs.unlinkSync(document.filePath);
      } catch (err) {
        console.warn(`[File Delete Warning]: Could not remove file ${document.filePath}`);
      }
    }

    // 2. Remove document chunks from vector store
    await DocumentChunk.deleteMany({ documentId: document._id });

    // 3. Remove document record
    await document.deleteOne();

    return res.json({
      success: true,
      message: 'Document and vector embeddings deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  reprocessDocument,
  deleteDocument,
  processDocumentPipeline,
};
