import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Sparkles, BookOpen, Database, ShieldCheck, Cpu, Search, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Next-Generation Spec-Driven RAG AI Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Intelligent College Information Assistant Grounded in <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Official Documents</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Ask questions about admissions, fees, exams, hostel rules, and academic schedules. Our Retrieval-Augmented Generation (RAG) engine scans verified college documents to deliver instant, grounded answers with citations.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/chat"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-brand-600/30 transition-all flex items-center space-x-2"
          >
            <span>Launch AI Chatbot</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/admin/documents"
            className="px-6 py-3.5 rounded-xl glass-card text-slate-300 hover:text-white font-semibold text-sm transition-all border border-slate-700"
          >
            Admin Document Management
          </Link>
        </div>
      </section>

      {/* RAG Pipeline Diagram / Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">How the RAG Architecture Works</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Unlike standard LLMs that hallucinate, our 9-step pipeline indexes official college documents into vector embeddings before generating responses.
          </p>
        </div>

        {/* Pipeline Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Document Ingestion',
              desc: 'Admins upload PDFs, DOCX, & TXT files containing college policies & fee structures.',
              icon: BookOpen,
              color: 'text-brand-400',
            },
            {
              step: '02',
              title: 'Text Extraction & Chunking',
              desc: 'Readable text is cleaned & split into overlapping chunks with metadata retention.',
              icon: Layers,
              color: 'text-purple-400',
            },
            {
              step: '03',
              title: 'Vector Embedding Search',
              desc: 'Chunks are converted into vector embeddings and matched using similarity search.',
              icon: Search,
              color: 'text-emerald-400',
            },
            {
              step: '04',
              title: 'Grounded AI Answer',
              desc: 'Gemini LLM synthesizes an accurate response attached with verified document citations.',
              icon: Cpu,
              color: 'text-amber-400',
            },
          ].map((item, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-6 border border-slate-800 relative group">
              <span className="text-3xl font-extrabold text-slate-700 font-mono mb-2 block">{item.step}</span>
              <item.icon className={`w-8 h-8 ${item.color} mb-3`} />
              <h3 className="text-base font-bold text-white mb-1.5">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-snug">
                Built for Students, Administrators, and Academic Governance
              </h2>
              <ul className="space-y-3">
                {[
                  'Strict Source Grounding & Unknown Question Protection',
                  'Role-Based Controls for Student & Administrator Portals',
                  'Support for PDF, DOCX, and Text Official Announcements',
                  'Full Conversation Session History & Search',
                  'Vector Similarity Top-K Context Aggregation',
                ].map((feat, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="glass-card rounded-2xl p-6 border border-slate-700/60 bg-slate-800/40">
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-700">
                <Database className="w-5 h-5 text-brand-400" />
                <span className="text-sm font-semibold text-white">College Knowledge Topics Included</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Admissions', 'Departments', 'Courses', 'Fees', 'Exams', 
                  'Academic Calendar', 'Hostel', 'Library', 'Clubs', 'Placements', 
                  'Scholarships', 'Policies', 'Events', 'Notices', 'FAQs'
                ].map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
