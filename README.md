# 🎓 CampusRAG - Full-Stack AI-Powered RAG College Chatbot

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.19-blue.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-v18.3-cyan.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v5.2-purple.svg)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6+-brightgreen.svg)](https://www.mongodb.com/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini_API-Generative_AI-orange.svg)](https://ai.google.dev/)

An intelligent, full-stack college information assistant built using **Retrieval-Augmented Generation (RAG)** and **Specification-Driven Development (SDD)**. The platform allows administrators to upload official college documents (PDFs, DOCX files, notices, FAQs, fee structures), which are extracted, split into overlapping chunks, embedded into vector representations, and indexed. When students ask questions, the chatbot retrieves top relevant context chunks using vector similarity search, passes the grounded context to Google Gemini AI, generates accurate answers, and cites exact document sources.

---

## 🌟 Key Features

- 🔐 **Authentication & Authorization**: Full JWT authentication with role-based access control (`student` and `admin`).
- 📁 **Document Processing Pipeline**: Upload PDF, DOCX, or TXT documents. Automatically clean text, extract content, divide into sliding window chunks, and store vector embeddings.
- 🔍 **Vector Similarity Search**: Hybrid vector similarity calculation (cosine similarity + keyword weighting) over chunk vector representations with configurable Top-K context retrieval.
- 🤖 **Strict RAG Grounding**: Powered by Google Gemini (`gemini-1.5-flash` / `text-embedding-004`). Answers are strictly bound to retrieved college context with unknown-question fallback protection (*"I couldn't find this information in the college knowledge base"*).
- 📚 **Source & Reference Display**: Interactively lists verified source cards showing document titles, categories, file names, vector match percentages, and excerpt snippets.
- 💬 **Conversation Session Management**: Create, view, search, and delete chat sessions and message histories.
- 🛡️ **Admin Governance Dashboard**: Dashboard tracking uploaded documents, total chunk counts, character extraction volume, and processing status (`PROCESSING`, `READY`, `FAILED`).
- 🎨 **Modern Dark Glassmorphic UI**: Tailored with React, Tailwind CSS, Lucide icons, glassmorphic panels, and smooth micro-interactions.

---

## 📁 Project Architecture & Folder Structure

```
chatbotwebsite/
├── backend/
│   ├── src/
│   │   ├── config/             # Database connection setup
│   │   ├── controllers/        # Request handlers (auth, document, chat, rag)
│   │   ├── middleware/         # Auth, role (admin), upload (multer), & error middlewares
│   │   ├── models/             # Mongoose schemas (User, Document, DocumentChunk, Conversation, Message)
│   │   ├── rag/                # RAG Core Subsystem
│   │   │   ├── documentProcessor.js # PDF & DOCX text extraction
│   │   │   ├── textChunker.js       # Sliding window text chunking
│   │   │   ├── embeddingService.js  # Vector embedding generation (Gemini / Fallback)
│   │   │   ├── vectorSearchService.js# Cosine similarity vector search
│   │   │   ├── retrievalService.js   # Top-K relevance filtering & context builder
│   │   │   ├── llmService.js         # Gemini 1.5 Flash grounded prompt execution
│   │   │   └── ragService.js        # RAG pipeline orchestrator
│   │   ├── routes/             # API Endpoints (/api/auth, /api/documents, /api/chat, /api/rag, /api/health)
│   │   ├── scripts/            # Database seed script
│   │   └── server.js           # Express app server entry point
│   ├── uploads/                # Local document storage directory
│   ├── .env.example            # Environment variables template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, MessageBubble, SourceCard, ChatWindow, etc.)
│   │   ├── context/            # React AuthContext state provider
│   │   ├── pages/              # Views (Home, Login, Register, Chat, History, Admin, Documents, Profile)
│   │   ├── services/           # Axios API client
│   │   ├── App.jsx             # Router navigation setup
│   │   ├── main.jsx            # React root DOM renderer
│   │   └── index.css           # Tailwind CSS & glassmorphic utility styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── chatbot.md                  # Single Source of Truth Specification
├── implementation_plan.md      # Implementation plan artifact
├── README.md                   # Setup and usage guide
└── .gitignore
```

---

## 🛠️ Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (v9.0.0 or higher)
- **MongoDB** (Local MongoDB Community Server running on `mongodb://127.0.0.1:27017` OR a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string).
- *(Optional but Recommended)* **Google Gemini API Key**: Get a free API key from [Google AI Studio](https://aistudio.google.com/). *(Note: The application includes a deterministic local vector feature generator fallback if no API key is provided).*

---

## 🚀 How to Run the Project Locally

Follow these step-by-step instructions to get the application up and running locally.

### Step 1: Clone or Open Project Directory

Open your terminal or command prompt and navigate to the root project directory:
```bash
cd c:\Users\Moham\OneDrive\Desktop\website\chatbotwebsite
```

---

### Step 2: Configure Environment & Seed Database

1. **Configure Environment Variables**:
   Ensure `backend/.env` is set up with your MongoDB connection string (`MONGODB_URI`) and optional Google Gemini API key (`GEMINI_API_KEY`).

2. **Seed Database (Admin/Student Users & College Documents)**:
   From the root project directory, run:
   ```bash
   npm run seed
   ```
   *This automatically creates:*
   - **Student Account**: `student@college.edu` / `studentpassword123`
   - **Admin Account**: `admin@college.edu` / `adminpassword123`
   - **Sample Knowledge Base**: Fee structures, admissions policy, and examination calendar parsed & indexed into vector database.

---

### Step 3: Run Backend and Frontend Simultaneously (Single Command)

From the root project directory (`chatbotwebsite/`), run:

```bash
npm run dev
```

> ⚡ **Single Command Execution**: `npm run dev` automatically launches both the **Backend Express API** (on port `5000`) and **Frontend React Vite Client** (on port `5173`) concurrently in a single terminal window!

4. **Open Application in Browser**:
   Navigate to **[http://localhost:5173](http://localhost:5173)** in your browser!

---

### Alternative: Run Backend and Frontend In Separate Terminals

If you prefer running servers in separate terminal windows:

- **Terminal 1 (Backend)**:
  ```bash
  cd backend
  npm run dev
  ```

- **Terminal 2 (Frontend)**:
  ```bash
  cd frontend
  npm run dev
  ```

---

## 📡 Key API Endpoint Documentation

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Backend status & timestamp | Public |
| `POST` | `/api/auth/register` | Register new student or admin account | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | Public |
| `GET` | `/api/auth/me` | Fetch active user profile | Private |
| `GET` | `/api/documents` | List uploaded college documents | Private |
| `POST` | `/api/documents/upload` | Upload PDF/DOCX/TXT file & trigger RAG pipeline | Private (Admin) |
| `POST` | `/api/documents/:id/reprocess` | Re-extract & re-embed document vectors | Private (Admin) |
| `DELETE` | `/api/documents/:id` | Delete document & associated vector chunks | Private (Admin) |
| `POST` | `/api/chat` | Send question, run RAG pipeline, get answer + sources | Private |
| `GET` | `/api/chat/conversations` | Get user chat session history | Private |
| `POST` | `/api/rag/query` | Standalone RAG query execution test endpoint | Public / Private |

---

## 🧪 Verification & Testing Workflow

1. **Test Authentication**:
   - Sign in as Student (`student@college.edu` / `studentpassword123`).
   - Sign in as Admin (`admin@college.edu` / `adminpassword123`). Verify that `/admin` and `/admin/documents` routes are protected.
2. **Test Document Upload & Indexing**:
   - In Admin portal (`/admin/documents`), upload a custom `.pdf`, `.docx`, or `.txt` document (e.g. *Scholarships 2026*).
   - Verify status transitions to `READY` and vector chunks appear in the document inspector modal.
3. **Test RAG Query & Citations**:
   - Navigate to `/chat` and ask: *"What is the tuition fee for B.Tech Computer Science?"* or *"What are the hostel room charges?"*
   - Verify the AI returns an accurate response grounded in the document context and displays verified source cards.
4. **Test Unknown Question Protection**:
   - Ask an out-of-scope question such as *"What is the price of space rocket tickets?"*
   - Confirm the bot responds: *"I couldn't find this information in the college knowledge base."* without hallucination.

---

## 📄 License

Distributed under the ISC License. Free to use and modify for academic and research projects.
