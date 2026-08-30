import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { documentAPI } from '../services/api';
import DocumentUpload from '../components/DocumentUpload';
import { LayoutDashboard, FileText, Database, CheckCircle2, RefreshCw, AlertCircle, ArrowUpRight } from 'lucide-react';

const Admin = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await documentAPI.getDocuments();
      if (res.data.success) {
        setDocuments(res.data.documents);
      }
    } catch (err) {
      console.error('Error fetching admin document metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalDocs = documents.length;
  const readyDocs = documents.filter((d) => d.status === 'READY').length;
  const totalChunks = documents.reduce((sum, d) => sum + (d.chunkCount || 0), 0);
  const totalChars = documents.reduce((sum, d) => sum + (d.extractedTextLength || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-purple-400" /> Admin Knowledge Base Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage documents, view vector store metrics, and upload official college policies</p>
        </div>

        <Link
          to="/admin/documents"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shrink-0"
        >
          <span>Manage All Documents</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Ingested Documents',
            value: totalDocs,
            icon: FileText,
            color: 'text-brand-400',
            bg: 'bg-brand-500/10',
          },
          {
            label: 'Indexed & Ready in Vector DB',
            value: readyDocs,
            icon: CheckCircle2,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
          },
          {
            label: 'Total Vector Chunks',
            value: totalChunks,
            icon: Database,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
          },
          {
            label: 'Extracted Characters',
            value: (totalChars / 1000).toFixed(1) + 'k',
            icon: RefreshCw,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
          },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">{stat.label}</span>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main Content Layout: Upload Form + Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quick Upload */}
        <div className="lg:col-span-1">
          <DocumentUpload onUploadSuccess={fetchDocuments} />
        </div>

        {/* Right Column: Recent Knowledge Documents */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" /> Recent College Documents
            </h3>
            <span className="text-xs text-slate-400">{documents.length} files</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">Loading documents...</div>
          ) : documents.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">No documents uploaded yet. Use the upload panel to add PDFs or text files.</div>
          ) : (
            <div className="space-y-3">
              {documents.slice(0, 5).map((doc) => (
                <div
                  key={doc._id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs uppercase shrink-0">
                      {doc.fileType}
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-semibold text-white truncate">{doc.title}</h4>
                      <p className="text-[11px] text-slate-400">
                        {doc.category} • {doc.chunkCount || 0} chunks indexed
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase font-mono ${
                      doc.status === 'READY'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : doc.status === 'PROCESSING'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Admin;
