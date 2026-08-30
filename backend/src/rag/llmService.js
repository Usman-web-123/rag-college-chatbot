const { GoogleGenerativeAI } = require('@google/generative-ai');

const UNKNOWN_MESSAGE = "I couldn't find this information in the college knowledge base.";

/**
 * Generate answer using Google Gemini or Fallback synthesizer
 */
const generateAnswer = async (question, contextText, chunks = []) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!chunks || chunks.length === 0 || !contextText || contextText.trim().length === 0) {
    return {
      answer: UNKNOWN_MESSAGE,
      isUnknown: true,
      confidence: 0,
    };
  }

  const systemPrompt = `You are an intelligent, helpful RAG-based College Chatbot assistant.
Answer the student's question accurately, directly, and politely BASED STRICTLY ON THE PROVIDED COLLEGE DOCUMENTS CONTEXT BELOW.

RULES:
1. Use ONLY the information supplied in the Context section below.
2. If the context does not contain enough details to answer the student's question accurately, state: "${UNKNOWN_MESSAGE}"
3. Do NOT make up or hallucinate fees, dates, rules, or contact information.
4. Keep the answer clear, structured, and easy to read.

--- CONTEXT START ---
${contextText}
--- CONTEXT END ---

STUDENT QUESTION: ${question}

Provide your clear grounded answer:`;

  if (apiKey && apiKey.trim().length > 0 && apiKey !== 'your_gemini_api_key_here') {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(systemPrompt);
      const responseText = result.response.text().trim();

      return {
        answer: responseText,
        isUnknown: responseText.includes(UNKNOWN_MESSAGE),
        confidence: 0.95,
      };
    } catch (error) {
      console.warn(`[LLM Service Warning]: Gemini Generation API error (${error.message}). Using local synthesis fallback.`);
    }
  }

  // Local fallback synthesis if API key is not configured
  const primaryDocTitle = chunks[0]?.metadata?.title || 'College Knowledge Base';
  const combinedExcerpts = chunks
    .slice(0, 3)
    .map((chunk, i) => `📌 **${chunk.metadata?.title || 'Document Excerpt'}** (${chunk.metadata?.category || 'General'}):\n${chunk.text}`)
    .join('\n\n');

  const summaryAnswer = `Here is the official information retrieved from the college knowledge base ("${primaryDocTitle}"):\n\n${combinedExcerpts}`;

  return {
    answer: summaryAnswer,
    isUnknown: false,
    confidence: 0.9,
  };
};

module.exports = {
  generateAnswer,
  UNKNOWN_MESSAGE,
};
