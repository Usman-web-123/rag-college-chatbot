/**
 * Chunk text using sliding window with configurable chunkSize and chunkOverlap
 */
const createChunks = (text, options = {}) => {
  const chunkSize = options.chunkSize || 600; // characters
  const chunkOverlap = options.chunkOverlap || 120; // characters

  if (!text || text.trim().length === 0) {
    return [];
  }

  const cleanText = text.trim();
  const chunks = [];

  let start = 0;
  let chunkIndex = 0;

  while (start < cleanText.length) {
    let end = start + chunkSize;

    // Adjust end position to avoid breaking sentences/words when possible
    if (end < cleanText.length) {
      const lastPeriod = cleanText.lastIndexOf('.', end);
      const lastNewline = cleanText.lastIndexOf('\n', end);
      const lastSpace = cleanText.lastIndexOf(' ', end);

      const bestBreak = Math.max(lastPeriod, lastNewline);
      if (bestBreak > start + chunkSize * 0.5) {
        end = bestBreak + 1;
      } else if (lastSpace > start + chunkSize * 0.5) {
        end = lastSpace + 1;
      }
    } else {
      end = cleanText.length;
    }

    const chunkContent = cleanText.slice(start, end).trim();
    if (chunkContent.length > 0) {
      chunks.push({
        text: chunkContent,
        chunkIndex: chunkIndex++,
      });
    }

    if (end >= cleanText.length) break;

    start = end - chunkOverlap;
    if (start < 0) start = 0;
  }

  return chunks;
};

module.exports = {
  createChunks,
};
