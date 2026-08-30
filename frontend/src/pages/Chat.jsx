import React, { useState, useEffect } from 'react';
import { chatAPI } from '../services/api';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await chatAPI.getConversations();
      if (res.data.success) {
        setConversations(res.data.conversations);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  const handleSelectConversation = async (id) => {
    setActiveConversationId(id);
    setLoading(true);
    try {
      const res = await chatAPI.getConversationById(id);
      if (res.data.success) {
        setMessages(res.data.messages || []);
      }
    } catch (err) {
      console.error('Error loading conversation messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
    setMessages([]);
  };

  const handleDeleteConversation = async (id) => {
    try {
      await chatAPI.deleteConversation(id);
      if (activeConversationId === id) {
        handleNewConversation();
      }
      fetchConversations();
    } catch (err) {
      console.error('Error deleting conversation:', err);
    }
  };

  const handleSendMessage = async (questionText) => {
    // Optimistically add user message to list
    const tempUserMsg = {
      role: 'user',
      content: questionText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await chatAPI.sendMessage({
        question: questionText,
        conversationId: activeConversationId,
      });

      if (res.data.success) {
        if (!activeConversationId) {
          setActiveConversationId(res.data.conversationId);
          fetchConversations();
        }
        setMessages((prev) => [...prev, res.data.assistantMessage]);
      }
    } catch (err) {
      console.error('Error sending RAG query message:', err);
      const errorMsg = {
        role: 'assistant',
        content: 'An error occurred while attempting to process your question. Please check backend log or try again.',
        metadata: { isUnknownResponse: true },
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] max-w-7xl mx-auto px-2 sm:px-4 py-3 flex gap-3 overflow-hidden">
      
      {/* Sidebar - Conversation Sessions */}
      <div className="w-64 sm:w-80 shrink-0 hidden md:block h-full">
        <ConversationList
          conversations={conversations}
          activeId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
        />
      </div>

      {/* Main Chat Workspace Window */}
      <div className="flex-1 h-full">
        <ChatWindow
          messages={messages}
          loading={loading}
          onSendMessage={handleSendMessage}
          onSelectSuggested={handleSendMessage}
        />
      </div>

    </div>
  );
};

export default Chat;
