import React, { useState } from 'react';
import { documentAPI } from '../services/api';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const CATEGORIES = [
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

const DocumentUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      if (!title) {
        // Auto populate title from file name without extension
        const nameWithoutExt = selected.name.substring(0, selected.name.lastIndexOf('.')) || selected.name;
        setTitle(nameWithoutExt);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setIsError(true);
      setStatusMessage('Please select a file to upload (.pdf, .docx, or .txt).');
      return;
    }

    setLoading(true);
    setStatusMessage(null);
    setIsError(false);

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('title', title);
      formData.append('category', category);

      const res = await documentAPI.upload(formData);
      if (res.data.success) {
        setIsError(false);
        setStatusMessage('Document uploaded successfully! Indexing into vector store.');
        setFile(null);
        setTitle('');
        setCategory('General');
        if (onUploadSuccess) onUploadSuccess();
      }
    } catch (err) {
      setIsError(true);
      setStatusMessage(err.response?.data?.message || 'Failed to upload document.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-700/80">
      <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
        <Upload className="w-5 h-5 text-brand-400" /> Upload College Knowledge Document
      </h3>
      <p className="text-xs text-slate-400 mb-5">
        Upload official college PDF, DOCX, or TXT documents. Documents will automatically be parsed, chunked, and embedded for AI retrieval.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Document Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Student Hostel Fee Rules 2026"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors"
            required
          />
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500 transition-colors"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* File Input Dropzone */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Select File (.pdf, .docx, .txt)</label>
          <div className="relative border-2 border-dashed border-slate-700 hover:border-brand-500/60 rounded-2xl p-4 text-center transition-colors bg-slate-900/40">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <FileText className="w-8 h-8 text-brand-400" />
              {file ? (
                <div className="text-xs text-emerald-400 font-medium truncate max-w-xs">
                  Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                </div>
              ) : (
                <div className="text-xs text-slate-400">
                  <span className="font-semibold text-brand-400">Click to browse</span> or drag and drop file here
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              isError
                ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
            }`}
          >
            {isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:bg-slate-700 text-white font-semibold text-sm shadow-md shadow-brand-600/30 transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing & Indexing Vector Embeddings...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Upload & Index Document</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default DocumentUpload;
