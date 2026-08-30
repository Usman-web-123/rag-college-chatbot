const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { processRagQuery } = require('../rag/ragService');

// @desc    Send message & run RAG query pipeline
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { question, conversationId, category } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Question text is required.' });
    }

    // 1. Get or create conversation session
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId: req.user._id,
      });
    }

    if (!conversation) {
      // Auto generate conversation title from first 30 chars of question
      const title = question.length > 35 ? `${question.substring(0, 35)}...` : question;
      conversation = await Conversation.create({
        userId: req.user._id,
        title,
      });
    }

    // 2. Save User Message
    const userMessage = await Message.create({
      conversationId: conversation._id,
      role: 'user',
      content: question,
    });

    // 3. Execute RAG query pipeline
    const ragResult = await processRagQuery(question, { category });

    // 4. Save Assistant Message with sources & confidence
    const assistantMessage = await Message.create({
      conversationId: conversation._id,
      role: 'assistant',
      content: ragResult.answer,
      sources: ragResult.sources,
      metadata: {
        confidence: ragResult.confidence,
        isUnknownResponse: ragResult.isUnknown,
      },
    });

    // Update conversation timestamp
    conversation.updatedAt = new Date();
    await conversation.save();

    return res.status(200).json({
      success: true,
      conversationId: conversation._id,
      userMessage,
      assistantMessage,
      sources: ragResult.sources,
      confidence: ragResult.confidence,
      isUnknown: ragResult.isUnknown,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user conversations list
// @route   GET /api/chat/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user._id })
      .sort({ updatedAt: -1 });

    return res.json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new conversation
// @route   POST /api/chat/conversations
// @access  Private
const createConversation = async (req, res) => {
  try {
    const { title } = req.body;
    const conversation = await Conversation.create({
      userId: req.user._id,
      title: title || 'New Conversation',
    });

    return res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single conversation messages
// @route   GET /api/chat/conversations/:id
// @access  Private
const getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 });

    return res.json({
      success: true,
      conversation,
      messages,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete conversation and messages
// @route   DELETE /api/chat/conversations/:id
// @access  Private
const deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    await Message.deleteMany({ conversationId: conversation._id });
    await conversation.deleteOne();

    return res.json({
      success: true,
      message: 'Conversation and message history deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  sendMessage,
  getConversations,
  createConversation,
  getConversationById,
  deleteConversation,
};
