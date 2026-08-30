import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatAPI } from '../services/api';
import { History as HistoryIcon, Search, Trash2, MessageSquare, ArrowRight, Calendar } from 'lucide-react';

const History = () => {
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await chatAPI.getConversations();
      if (res.data.success) {
        setConversations(res.data.conversations);
      }
    } catch (err) {
      console.error('Error fetching chat history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation session?')) {
      try {
        await chatAPI.deleteConversation(id);
        fetchHistory();
      } catch (err) {
        console.error('Failed to delete history item', err);
      }
    }
  };

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-brand-400" /> Previous AI Chat Sessions
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review past questions, AI answers, and document citations</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading chat history...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40 text-brand-400" />
          <h3 className="text-base font-semibold text-white mb-1">No Chat History Found</h3>
          <p className="text-xs text-slate-400 mb-6">You haven't started any conversations matching your criteria yet.</p>
          <button
            onClick={() => navigate('/chat')}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-600/30"
          >
            Start a New Chat
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((conv) => (
            <div
              key={conv._id}
              onClick={() => navigate('/chat')}
              className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-brand-500/40 flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-semibold text-white truncate group-hover:text-brand-300 transition-colors">
                    {conv.title}
                  </h4>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>Session ID: {conv._id.substring(18)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={(e) => handleDelete(conv._id, e)}
                  title="Delete session"
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="p-2 text-slate-500 group-hover:text-brand-400 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default History;
