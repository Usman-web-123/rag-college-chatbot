const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    sources: [
      {
        documentId: mongoose.Schema.Types.ObjectId,
        title: String,
        fileName: String,
        category: String,
        chunkIndex: Number,
        similarity: Number,
        snippet: String,
      },
    ],
    metadata: {
      confidence: Number,
      isUnknownResponse: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Message', messageSchema);
