import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, Tag, Sparkles } from 'lucide-react';

const SourceCard = ({ source }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card rounded-xl p-3 border border-slate-700/60 bg-slate-800/40 text-slate-300 hover:border-brand-500/40 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h5 className="text-xs font-semibold text-white truncate" title={source.title}>
              {source.title}
            </h5>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
              <span className="flex items-center gap-1 bg-slate-700/60 px-1.5 py-0.5 rounded text-slate-300 text-[10px]">
                <Tag className="w-2.5 h-2.5" />
                {source.category}
              </span>
              <span className="truncate">{source.fileName}</span>
            </div>
          </div>
        </div>

        {source.similarity && (
          <div className="shrink-0 flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full font-mono">
            <Sparkles className="w-2.5 h-2.5" />
            {Math.round(source.similarity * 100)}% match
          </div>
        )}
      </div>

      {source.snippet && (
        <div className="mt-2 pt-2 border-t border-slate-700/40">
          <p className={`text-xs text-slate-300 leading-relaxed font-sans ${!expanded ? 'line-clamp-2' : ''}`}>
            "{source.snippet}"
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 flex items-center gap-1 text-[11px] font-medium text-brand-400 hover:text-brand-300 transition-colors"
          >
            {expanded ? (
              <>
                Show less <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                Read excerpt <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default SourceCard;
