import React from 'react';
import { MessageSquare, Plus, Trash2, Clock } from 'lucide-react';

const ConversationList = ({
  conversations,
  activeId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}) => {
  return (
    <div className="flex flex-col h-full glass-panel border-r border-slate-800 p-3">
      {/* New Conversation Button */}
      <button
        onClick={onNewConversation}
        className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-md shadow-brand-600/20 transition-all mb-4"
      >
        <Plus className="w-4 h-4" />
        <span>New Conversation</span>
      </button>

      {/* Conversations List Header */}
      <div className="flex items-center justify-between px-2 mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Previous Chats</span>
        <span className="text-xs text-slate-500">{conversations.length}</span>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {conversations.length === 0 ? (
          <div className="text-center py-8 px-4 text-slate-500 text-xs">
            <Clock className="w-6 h-6 mx-auto mb-2 opacity-50" />
            No previous chat sessions yet. Ask a question to start!
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = activeId === conv._id;
            return (
              <div
                key={conv._id}
                onClick={() => onSelectConversation(conv._id)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                  isActive
                    ? 'bg-brand-600/20 text-white border border-brand-500/40 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-medium truncate">{conv.title || 'Untitled Chat'}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv._id);
                  }}
                  title="Delete Conversation"
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
