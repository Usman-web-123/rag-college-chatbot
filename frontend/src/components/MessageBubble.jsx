import React from 'react';
import { Bot, User, BookOpen, AlertTriangle } from 'lucide-react';
import SourceCard from './SourceCard';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  const isUnknown = message.metadata?.isUnknownResponse || message.content.includes("couldn't find this information");

  return (
    <div className={`flex gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      
      {/* Avatar for Bot */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-brand-500/20">
          <Bot className="w-5 h-5" />
        </div>
      )}

      {/* Message Content Container */}
      <div className={`max-w-2xl rounded-2xl p-4 shadow-sm ${
        isUser
          ? 'bg-brand-600 text-white rounded-tr-none'
          : isUnknown
          ? 'glass-card border-amber-500/30 bg-amber-500/5 text-slate-200 rounded-tl-none'
          : 'glass-card text-slate-100 rounded-tl-none border-slate-700/80'
      }`}>
        
        {/* Role header for bot */}
        {!isUser && (
          <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-700/50">
            <span className="text-xs font-semibold text-brand-300 flex items-center gap-1.5">
              Campus AI Assistant
            </span>
            {isUnknown && (
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Unverified / Not in KB
              </span>
            )}
          </div>
        )}

        {/* Text message */}
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>

        {/* Sources / Citations list */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-700/50">
            <h6 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-brand-400" />
              Verified College Knowledge Sources ({message.sources.length})
            </h6>
            <div className="grid grid-cols-1 gap-2">
              {message.sources.map((source, index) => (
                <SourceCard key={index} source={source} />
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className={`text-[10px] mt-2 text-right ${isUser ? 'text-brand-200' : 'text-slate-500'}`}>
          {new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 shrink-0">
          <User className="w-5 h-5" />
        </div>
      )}

    </div>
  );
};

export default MessageBubble;
