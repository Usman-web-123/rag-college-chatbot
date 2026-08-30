const { generateEmbedding } = require('./embeddingService');
const { searchVectorStore } = require('./vectorSearchService');

/**
 * Retrieve relevant document context for a student's question
 */
const retrieveContext = async (question, options = {}) => {
  const topK = options.topK || 5;
  const minSimilarityThreshold = options.threshold || 0.12;

  if (!question || question.trim().length === 0) {
    return {
      chunks: [],
      contextText: '',
      hasRelevantContext: false,
    };
  }

  // 1. Generate query embedding
  const queryEmbedding = await generateEmbedding(question);

  // 2. Search vector database
  const searchResults = await searchVectorStore(queryEmbedding, question, {
    topK,
    category: options.category,
  });

  // 3. Filter by relevance threshold (accept top matching chunks if keyword or vector score matches)
  const relevantChunks = searchResults.filter(
    (chunk) => chunk.similarity >= 0.05 || (chunk.keywordScore && chunk.keywordScore > 0)
  );

  // 4. Construct context string
  const contextText = relevantChunks
    .map(
      (chunk, index) =>
        `[Source ${index + 1}: ${chunk.metadata?.title || 'Document'} (${chunk.metadata?.category || 'General'})]\n${chunk.text}`
    )
    .join('\n\n');

  return {
    chunks: relevantChunks,
    contextText,
    hasRelevantContext: relevantChunks.length > 0,
    topSimilarityScore: relevantChunks.length > 0 ? relevantChunks[0].similarity : 0,
  };
};

module.exports = {
  retrieveContext,
};
