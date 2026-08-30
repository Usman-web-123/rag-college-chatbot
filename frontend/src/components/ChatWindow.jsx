import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { Send, Loader2, Sparkles, HelpCircle, AlertCircle } from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'What is the academic fee for B.Tech Computer Science?',
  'What are the hostel room types and mess fee structure?',
  'When do the autumn and end-semester exams start?',
  'What are the eligibility criteria and scholarships for admissions?',
];

const ChatWindow = ({ messages, loading, onSendMessage, onSelectSuggested }) => {
  const [question, setQuestion] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || loading) return;
    onSendMessage(question);
    setQuestion('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/30 mb-4 animate-bounce">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">How can I assist you with college information today?</h2>
            <p className="text-xs text-slate-400 max-w-md mb-6">
              Ask any question regarding admissions, hostel fees, course details, exam dates, or college rules. All answers are grounded in official documents.
            </p>

            {/* Suggested Questions */}
            <div className="w-full max-w-lg space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-brand-400" /> Suggested Questions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectSuggested(q)}
                    className="p-3 rounded-xl glass-card text-xs text-slate-300 hover:text-white hover:border-brand-500/50 transition-all cursor-pointer text-left"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => <MessageBubble key={index} message={msg} />)
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center space-x-3 p-4 glass-card rounded-2xl max-w-xs text-brand-300 text-xs animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
            <span>Searching vector knowledge base & synthesizing answer...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Question Input Form */}
      <div className="p-4 border-t border-slate-800 glass-panel">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about fees, admissions, exams, hostel, courses..."
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold shadow-md shadow-brand-600/30 transition-all flex items-center gap-2 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>
      </div>

    </div>
  );
};

export default ChatWindow;
