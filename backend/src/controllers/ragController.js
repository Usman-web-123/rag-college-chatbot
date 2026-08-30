const { processRagQuery } = require('../rag/ragService');

// @desc    Direct RAG query test endpoint
// @route   POST /api/rag/query
// @access  Public / Private
const queryRag = async (req, res) => {
  try {
    const { question, category, topK } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Question parameter is required.' });
    }

    const result = await processRagQuery(question, { category, topK });

    return res.json({
      success: true,
      question: result.question,
      answer: result.answer,
      sources: result.sources,
      confidence: result.confidence,
      isUnknown: result.isUnknown,
      chunksRetrievedCount: result.chunksRetrievedCount,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  queryRag,
};
