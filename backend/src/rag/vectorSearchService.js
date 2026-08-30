const DocumentChunk = require('../models/DocumentChunk');

/**
 * Calculate Cosine Similarity between two numeric vectors
 */
const calculateCosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Keyword overlap matching score (boosts exact domain term matches)
 */
const STOP_WORDS = new Set([
  'what', 'is', 'the', 'for', 'are', 'how', 'when', 'does', 'where', 'can', 'about',
  'tell', 'me', 'give', 'show', 'of', 'in', 'and', 'to', 'a', 'an', 'with', 'any'
]);

const calculateKeywordScore = (query, chunkText) => {
  if (!query || !chunkText) return 0;
  const queryTokens = query
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));

  if (queryTokens.length === 0) return 0;

  const chunkTextLower = chunkText.toLowerCase();
  let matches = 0;
  for (const token of queryTokens) {
    if (chunkTextLower.includes(token)) {
      matches++;
    }
  }

  return matches / queryTokens.length;
};

/**
 * Search vector database for top matching chunks
 */
const searchVectorStore = async (queryVector, queryText, options = {}) => {
  const topK = options.topK || 5;
  const categoryFilter = options.category;

  // Build document filter
  const filter = {};
  if (categoryFilter && categoryFilter !== 'All') {
    filter['metadata.category'] = categoryFilter;
  }

  try {
    const allChunks = await DocumentChunk.find(filter).lean();
    if (!allChunks || allChunks.length === 0) {
      return [];
    }

    const scoredChunks = allChunks.map((chunk) => {
      const vectorSimilarity = calculateCosineSimilarity(queryVector, chunk.embedding);
      const keywordScore = calculateKeywordScore(queryText, chunk.text);
      
      // Combined hybrid score (70% vector + 30% keyword match)
      const combinedScore = vectorSimilarity * 0.7 + keywordScore * 0.3;

      return {
        ...chunk,
        similarity: combinedScore,
        vectorSimilarity,
        keywordScore,
      };
    });

    // Sort descending by similarity score
    scoredChunks.sort((a, b) => b.similarity - a.similarity);

    // Return top K chunks
    return scoredChunks.slice(0, topK);
  } catch (error) {
    console.error(`[Vector Search Error]: ${error.message}`);
    throw error;
  }
};

module.exports = {
  calculateCosineSimilarity,
  searchVectorStore,
};
