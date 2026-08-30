import React, { useState, useEffect } from 'react';
import { documentAPI } from '../services/api';
import DocumentUpload from '../components/DocumentUpload';
import { FileText, Search, Filter, RefreshCw, Trash2, Tag, Eye, X, CheckCircle2, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Admissions',
  'Departments',
  'Courses',
  'Fees',
  'Exams',
  'Academic Calendar',
  'Hostel',
  'Library',
  'Clubs',
  'Placements',
  'Scholarships',
  'Policies',
  'Events',
  'Notices',
  'FAQs',
  'General',
];

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docChunks, setDocChunks] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [category]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (search) params.search = search;

      const res = await documentAPI.getDocuments(params);
      if (res.data.success) {
        setDocuments(res.data.documents);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDocuments();
  };

  const handleReprocess = async (id, e) => {
    e.stopPropagation();
    try {
      await documentAPI.reprocess(id);
      fetchDocuments();
    } catch (err) {
      console.error('Failed to trigger reprocess:', err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this document and all its vector embeddings?')) {
      try {
        await documentAPI.deleteDocument(id);
        fetchDocuments();
      } catch (err) {
        console.error('Failed to delete document:', err);
      }
    }
  };

  const handleViewDetails = async (id) => {
    setLoadingModal(true);
    try {
      const res = await documentAPI.getDocumentById(id);
      if (res.data.success) {
        setSelectedDoc(res.data.document);
        setDocChunks(res.data.chunks || []);
      }
    } catch (err) {
      console.error('Failed to load document details', err);
    } finally {
      setLoadingModal(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" /> College Knowledge Base Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Upload, search, filter, reprocess, or delete indexed documents</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel rounded-2xl p-4 mb-8 border border-slate-800 flex flex-col md:flex-row items-center gap-4">
        
        <form onSubmit={handleSearchSubmit} className="flex-1 relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search document title or file name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </form>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <div className="flex items-center space-x-1.5">
            {CATEGORIES.slice(0, 7).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  category === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main Grid: Document Upload + Documents List Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Upload Dropzone */}
        <div className="lg:col-span-1">
          <DocumentUpload onUploadSuccess={fetchDocuments} />
        </div>

        {/* Right Column: Documents List Table */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Indexed Documents ({documents.length})</h3>
            <button
              onClick={fetchDocuments}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh List
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs">Loading document store...</div>
          ) : documents.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">No documents matching filter. Upload a new document to get started.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 px-2">Document Title</th>
                    <th className="pb-3 px-2">Category</th>
                    <th className="pb-3 px-2">Chunks</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                  {documents.map((doc) => (
                    <tr key={doc._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-2 font-medium text-white max-w-xs truncate">
                        <div className="truncate font-semibold">{doc.title}</div>
                        <div className="text-[10px] text-slate-500 truncate">{doc.fileName}</div>
                      </td>
                      <td className="py-3 px-2">
                        <span className="inline-flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300">
                          <Tag className="w-2.5 h-2.5" /> {doc.category}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-mono text-slate-400">{doc.chunkCount || 0}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase font-mono ${
                            doc.status === 'READY'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : doc.status === 'PROCESSING'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => handleViewDetails(doc._id)}
                            title="View Chunks"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-slate-800 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleReprocess(doc._id, e)}
                            title="Reprocess Vector Embedding"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(doc._id, e)}
                            title="Delete Document"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Document Chunks Inspector Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl glass-card rounded-3xl p-6 border border-slate-700 max-h-[85vh] flex flex-col shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">{selectedDoc.title}</h3>
                <p className="text-xs text-slate-400">
                  {selectedDoc.fileName} • {docChunks.length} Vector Chunks
                </p>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {docChunks.map((chunk, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center justify-between mb-1.5 text-slate-500 font-mono text-[10px]">
                    <span>Chunk #{chunk.chunkIndex + 1}</span>
                    <span>Length: {chunk.text.length} chars</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{chunk.text}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Documents;
