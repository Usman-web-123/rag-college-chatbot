const { GoogleGenerativeAI } = require('@google/generative-ai');

const VECTOR_DIMENSION = 768;

/**
 * Generate local deterministic feature vector for offline testing
 */
const generateLocalEmbedding = (text) => {
  const embedding = new Array(VECTOR_DIMENSION).fill(0);
  const normalized = text.toLowerCase().trim();

  for (let i = 0; i < normalized.length; i++) {
    const charCode = normalized.charCodeAt(i);
    const index1 = (charCode * 7 + i * 13) % VECTOR_DIMENSION;
    const index2 = (charCode * 17 + i * 3) % VECTOR_DIMENSION;
    embedding[index1] += 0.1;
    embedding[index2] += 0.05;
  }

  // Normalize to unit vector
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < VECTOR_DIMENSION; i++) {
      embedding[i] = embedding[i] / magnitude;
    }
  }

  return embedding;
};

/**
 * Generate vector embedding for input text using Gemini or Local fallback
 */
const generateEmbedding = async (text) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!text || text.trim().length === 0) {
    return new Array(VECTOR_DIMENSION).fill(0);
  }

  if (apiKey && apiKey.trim().length > 0 && apiKey !== 'your_gemini_api_key_here') {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
      const result = await model.embedContent(text);
      if (result && result.embedding && result.embedding.values) {
        return result.embedding.values;
      }
    } catch (error) {
      console.warn(`[Embedding Service Warning]: Gemini Embedding API error (${error.message}). Falling back to local vector generator.`);
    }
  }

  return generateLocalEmbedding(text);
};

module.exports = {
  generateEmbedding,
  generateLocalEmbedding,
  VECTOR_DIMENSION,
};
