const { retrieveContext } = require('./retrievalService');
const { generateAnswer } = require('./llmService');

/**
 * Full RAG pipeline: Query -> Embedding -> Vector Search -> Context -> LLM -> Answer + Sources
 */
const processRagQuery = async (question, options = {}) => {
  if (!question || question.trim().length === 0) {
    throw new Error('Question is required for RAG query');
  }

  // 1. Retrieve relevant chunks & context
  const retrievalResult = await retrieveContext(question, options);

  // 2. Generate answer grounded in context
  const aiResponse = await generateAnswer(
    question,
    retrievalResult.contextText,
    retrievalResult.chunks
  );

  // 3. Extract and format sources
  let sources = [];
  if (!aiResponse.isUnknown && retrievalResult.chunks.length > 0) {
    // Deduplicate by documentId / title
    const seenDocs = new Set();
    sources = retrievalResult.chunks
      .map((chunk) => ({
        documentId: chunk.documentId,
        title: chunk.metadata?.title || 'College Document',
        fileName: chunk.metadata?.fileName || 'document.pdf',
        category: chunk.metadata?.category || 'General',
        chunkIndex: chunk.chunkIndex,
        similarity: Math.round((chunk.similarity || 0) * 100) / 100,
        snippet: chunk.text.slice(0, 150) + '...',
      }))
      .filter((source) => {
        const key = `${source.title}-${source.fileName}-${source.chunkIndex}`;
        if (seenDocs.has(key)) return false;
        seenDocs.add(key);
        return true;
      });
  }

  return {
    question,
    answer: aiResponse.answer,
    sources,
    confidence: aiResponse.confidence || (retrievalResult.topSimilarityScore ? Math.round(retrievalResult.topSimilarityScore * 100) / 100 : 0),
    isUnknown: aiResponse.isUnknown,
    chunksRetrievedCount: retrievalResult.chunks.length,
  };
};

module.exports = {
  processRagQuery,
};
