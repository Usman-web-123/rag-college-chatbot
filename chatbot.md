1. Introduction
Build a full-stack AI-powered RAG-Based College Chatbot that acts as an intelligent college information assistant. The application will answer student questions using information retrieved from an administrator-managed college knowledge base.
Topics include Admissions, Departments, Courses, Fees, Exams, Academic Calendar, Hostel, Library, Clubs, Placements, Scholarships, Policies, Events, Notices, and FAQs.
2. What Spec Driven Development Means
Spec Driven Development (SDD) is an approach where the specification is written before code is produced. The core principle is: Specification first, Code second.
The specification acts as the single source of truth for the implementation. It defines the product purpose, users, technology stack, features, pages, database models, authentication, RAG pipeline, APIs, folder structure, security requirements, deployment, and verification.
3. Why SDD Matters
A vague prompt such as “Build me a college chatbot using AI” does not define how documents should be processed, how information should be retrieved, how unknown questions should be handled, or how sources should be displayed.
For a RAG application, the coding agent must implement an actual retrieval pipeline rather than simply connecting the application directly to an LLM.
The required pipeline is: College Documents → Text Extraction → Chunking → Embeddings → Vector Database → Similarity Search → Relevant Context → LLM → Final Answer + Source.
4. What We Are Going to Build Today
We are going to build a full-stack AI-powered application called RAG-Based College Chatbot.
The platform will allow administrators to upload official college documents such as PDFs, DOCX files, notices, FAQs, academic documents, policy documents, course information, and other supported resources.
When a student asks a question, the system will generate a query embedding, search the vector database, retrieve relevant document chunks, pass the retrieved context to the LLM, generate an answer grounded in that context, and display the sources used.
Required flow:
Student Question → Query Embedding → Vector Database Search → Relevant Document Chunks → Context Construction → LLM → Generated Answer → Sources / References.
5. The Parameters of a Good Specification
Clarity: Every requirement must have one clear meaning.
Completeness: The specification must define the product purpose, technology stack, features, authentication, frontend pages, backend architecture, database, document processing, RAG pipeline, vector search, APIs, folder structure, deployment, security, testing, and verification.
Consistency: Names used by the frontend must match backend APIs and database models.
Concrete Technology Choices: Technologies must be explicitly defined.
Structured Sections: Related requirements must be organized under clear headings.
Phased Delivery: The application must be developed in reviewable phases.
Authoritative Tone: Mandatory requirements should use must, required, and shall.
6. Complete Specification
6.1 Project Overview & Tech Stack
Project Overview: Build a full-stack AI-powered RAG-Based College Chatbot that allows students to ask questions about college information and receive answers grounded in an administrator-managed document knowledge base.
Required capabilities: user registration and login; protected authentication; admin and student roles; document upload; PDF/DOCX text extraction; text cleaning; text chunking; embedding generation; vector database storage; semantic similarity search; Retrieval-Augmented Generation; AI-generated answers; source/reference display; unknown-question handling; conversation history; admin document management; responsive frontend; backend API; database persistence; and production deployment.
Frontend: React, Vite, Tailwind CSS, Axios, React Router, Lucide React, and Context API or Zustand.
Backend: Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens, bcryptjs, Multer, CORS, Helmet, and Express Validator.
RAG / AI Layer: LangChain, an embedding model, a vector database, and an LLM API. A suitable implementation may use Google Gemini for LLM generation and Google Generative AI embeddings or another supported embedding provider. MongoDB Atlas Vector Search or another configured vector database may be used.
Document Processing: PDF text extraction, DOCX text extraction, text cleaning, chunking, and metadata extraction.
6.2 Authentication
The authentication system must support registration, login, logout, current-user retrieval, protected routes, and role-based access.
Registration: POST /api/auth/register. Users register with name, email, and password.
Login: POST /api/auth/login. Successful authentication returns a JWT.
Logout: The frontend clears the authenticated session.
Current User: GET /api/auth/me.
Roles: student and admin.
Students must only access student functionality. Administrators must have access to document management and administrative functionality.
Passwords must never be stored in plain text and must be hashed using bcrypt.
6.3 College Knowledge Base
The college knowledge base is the primary information source for the chatbot.
Documents may contain Admissions, Departments, Courses, Fees, Examinations, Academic Calendar, Hostel, Library, Clubs, Placements, Scholarships, Policies, Events, Notices, and FAQs.
Document metadata must include documentId, title, fileName, fileType, category, uploadedBy, uploadDate, and status.
6.4 Document Management
Administrators must be able to upload, view, search, filter, delete, replace/update, and monitor the processing status of documents.
Initial supported formats: PDF, DOCX, and TXT.
Processing pipeline: Upload → Validate File → Extract Text → Clean Text → Split Into Chunks → Generate Embeddings → Store Chunks → Store Vectors → Mark Document Ready.
If processing fails, the document must be marked as failed and an appropriate error must be returned.
6.5 Document Processing
The backend must extract readable text from uploaded documents. PDF files must be processed through PDF text extraction, DOCX files through DOCX text extraction, and the resulting content must be cleaned before chunking.
The system should remove unnecessary whitespace and normalize extracted content.
6.6 Text Chunking
Large documents must not be sent directly to the LLM. Extracted text must be divided into smaller chunks using a configurable chunk size and overlap.
Each chunk should contain chunkId, documentId, text, chunkIndex, metadata, and embedding.
Chunk metadata must retain the relationship between each chunk and its original document.
6.7 Embedding Generation
Each document chunk must be converted into a vector representation and stored in the configured vector database.
During retrieval, the student's question must also be converted into an embedding.
Flow: Text Chunk → Embedding Model → Vector; User Question → Embedding Model → Query Vector.
6.8 Vector Database & Semantic Search
The application must use vector similarity search. When a student asks a question, the system must generate a query embedding and retrieve the most relevant chunks from the vector database.
The number of retrieved chunks must be configurable, for example TOP_K = 5.
The retrieval layer must preserve document metadata for each retrieved chunk.
6.9 RAG Pipeline
The RAG pipeline is the most important component of the application.
Mandatory architecture: College Documents → Text Extraction → Chunking → Embeddings → Vector Database → Similarity Search → Relevant Context → LLM → Final Answer + Source.
The chatbot must retrieve relevant information before generating the final answer. Retrieved context must be passed to the LLM.
The system prompt must instruct the LLM to answer using the supplied context.
6.10 Unknown Question Handling
If vector search does not find sufficiently relevant information, the chatbot must not invent an answer.
The system should respond with a clear message such as: “I couldn't find this information in the college knowledge base.”
The chatbot must distinguish between information available and information not available, and must not hallucinate college-specific information.
6.11 AI Answer Generation
The LLM must receive system instructions, the user's question, and the retrieved context.
The generated answer must be clear, concise, direct, grounded in the retrieved context, and free of unsupported claims.
6.12 Source / Reference Display
Every RAG answer should display the sources used to generate the answer.
Source information should include document title, file name, relevant chunk or page where available, and category.
Example: Answer: The hostel fee is ₹XXXX. Sources: Hostel Fee Structure 2026.pdf; Student Handbook.pdf.
6.13 Chat Interface
The chatbot interface must provide a message input, send button, user messages, AI responses, loading state, error state, source cards, conversation history, and suggested questions.
The interface must visually separate user messages, AI answers, and sources.
6.14 Chat History & Conversation Context
The application must store conversations and messages.
Conversation fields: conversationId, userId, title, createdAt, updatedAt.
Message fields: messageId, conversationId, role, content, sources, createdAt, metadata.
Roles are user and assistant.
Students must be able to view previous conversations, open and continue a conversation, start a new conversation, and delete a conversation.
6.15 Frontend Pages
/ — Landing page with chatbot introduction, features, how RAG works, login, register, and responsive layout.
/login — Email/password login with validation and error handling.
/register — Name, email, password, confirm password, and validation.
/chat — Main chatbot with conversation list, message area, sources, and suggested questions.
/history — Previous conversations with search, open, and delete.
/admin — Admin dashboard with document, user, processing, and activity metrics.
/admin/documents — Upload, document list, search, category filter, status, delete, update, and reprocess.
/profile — User information, account information, and logout.
6.16 Backend Architecture
The backend must follow: Routes → Controllers → Services → Database / RAG / AI Services.
Routes handle HTTP endpoints, authentication middleware, and validation.
Controllers receive requests, validate data, call services, and return responses. Controllers must not contain large business logic.
Services contain authentication, document processing, chunking, embedding generation, vector search, RAG, chat management, source generation, and document management logic.
RAG layer should contain documentProcessor, textChunker, embeddingService, vectorSearchService, retrievalService, ragService, and llmService.
6.17 Database Collections
Users: name, email, password, role, createdAt, updatedAt. Roles: student | admin.
Documents: title, fileName, fileType, category, uploadedBy, status, filePath, createdAt, updatedAt. Status: PROCESSING | READY | FAILED.
DocumentChunks: documentId, text, chunkIndex, embedding, metadata, createdAt.
Conversations: userId, title, createdAt, updatedAt.
Messages: conversationId, role, content, sources, createdAt, metadata.
6.18 API Endpoints
Health: GET /api/health.
Authentication: POST /api/auth/register; POST /api/auth/login; POST /api/auth/logout; GET /api/auth/me.
Documents: GET /api/documents; GET /api/documents/:id; POST /api/documents/upload; PUT /api/documents/:id; DELETE /api/documents/:id; POST /api/documents/:id/reprocess.
Chat: POST /api/chat; GET /api/chat/conversations; POST /api/chat/conversations; GET /api/chat/conversations/:id; DELETE /api/chat/conversations/:id.
RAG: POST /api/rag/query.
The RAG endpoint must receive a question, generate a query embedding, search the vector database, retrieve relevant chunks, construct context, call the LLM, generate an answer, and return the answer and sources.
Example response fields: answer, sources, confidence, conversationId.
6.19 Folder Structure
rag-college-chatbot/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   ├── ChatWindow/
│   │   │   ├── MessageBubble/
│   │   │   ├── SourceCard/
│   │   │   ├── ConversationList/
│   │   │   ├── DocumentUpload/
│   │   │   └── ProtectedRoute/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Admin.jsx
│   │   │   └── Documents.jsx
│   │   ├── services/api.js
│   │   ├── store/
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── rag/
│   │   │   ├── documentProcessor.js
│   │   │   ├── textChunker.js
│   │   │   ├── embeddingService.js
│   │   │   ├── vectorSearchService.js
│   │   │   ├── retrievalService.js
│   │   │   ├── ragService.js
│   │   │   └── llmService.js
│   │   └── server.js
│   └── package.json
├── README.md
├── .gitignore
└── spec.md
6.20 Development Phases
Phase 1 — Project Setup & Authentication: Frontend, backend, MongoDB, JWT, signup, login, logout, protected routes, student/admin roles, and basic UI. Verification: login and registration must work.
Phase 2 — Document Management: Admin dashboard, upload, file validation, PDF/DOCX extraction, metadata, deletion, and processing status. Verification: an uploaded document must successfully extract text.
Phase 3 — Chunking & Embeddings: Text cleaning, chunking, metadata, embedding generation, and vector storage. Verification: a document must produce chunks and corresponding embeddings.
Phase 4 — Semantic Search: Query embeddings, vector similarity search, Top-K retrieval, relevance filtering, and metadata retrieval. Verification: questions must retrieve relevant chunks.
Phase 5 — RAG Chatbot: Prompt construction, context injection, answer generation, unknown-question handling, and source extraction. Verification: answers must be based on uploaded documents.
Phase 6 — Chat History: Conversations, messages, previous conversations, context, and deletion. Verification: users must be able to access previous conversations after logging in again.
Phase 7 — UI/UX & Bonus Features: Suggested questions, feedback, multilingual support, streaming responses, confidence score, hybrid search, OCR, or summarization. Bonus features must only be implemented after core features work.
Phase 8 — Deployment: GitHub, Vercel frontend, Render backend, MongoDB Atlas, production environment variables, README, screenshots, and live URLs.
6.21 UI and UX Requirements
The UI must be responsive on desktop and mobile, provide clear navigation, loading states, error messages, empty states, consistent typography, accessible controls, and role-specific interfaces.
The chatbot must visually separate user messages, AI answers, and sources.
Document processing must show Processing, Ready, and Failed states.
6.22 Security Requirements
The application must hash passwords with bcrypt, use JWT authentication, protect private APIs, validate request bodies, restrict admin APIs to administrators, use environment variables for secrets, never expose API keys, never commit .env, validate uploaded file types, limit file sizes, use Helmet, configure CORS, and never log API keys or database credentials.
Required environment variable names may include MONGODB_URI, JWT_SECRET, GEMINI_API_KEY, VECTOR_DATABASE_URL, VECTOR_DATABASE_KEY, and CLIENT_URL. Actual values must never be committed to GitHub.
6.23 Final Expected Outcome
The completed application must allow an admin to upload college documents, process them, extract text, create chunks, generate embeddings, and store vectors.
A student must be able to ask a question, generate a query embedding, perform vector search, retrieve relevant college information, send context to the LLM, receive an answer, and view sources.
The final product must be a real RAG application, not a simple chatbot connected directly to an LLM. It must be deployed and accessible online.
6.24 AI Coding Agent Implementation Instructions
The AI coding agent must read spec.md before writing code; follow the defined folder structure and technology stack; implement phase by phase; never skip the vector database; never replace RAG with direct LLM calls; keep controllers thin; put business logic inside services; keep RAG components separated; validate uploaded documents; protect admin APIs; never hardcode secrets; use environment variables; store document metadata; preserve document-to-chunk relationships; return sources with RAG answers; handle unknown questions explicitly; implement error handling; test every phase before continuing; and list every file created or modified after each phase.
7. Where Each Specification Parameter Shows Up
Clarity: The RAG pipeline and required system behavior are explicitly defined.
Completeness: Frontend, backend, database, authentication, documents, embeddings, vector search, RAG, LLM, sources, and deployment are covered.
Consistency: Documents, DocumentChunks, Conversations, and Messages are consistently defined across the architecture and APIs.
Concrete Technology Choices: React, Node.js, Express, MongoDB, LangChain, embeddings, vector search, and an LLM provider are identified.
Structured Sections: Each major subsystem has its own specification.
Phased Delivery: The application is divided into eight implementation phases.
Authoritative Tone: Mandatory behavior is described using must and required.
8. Setting Up Codex Chat or GitHub Copilot in VS Code
Create the project folder: rag-college-chatbot.
Create a file named spec.md at the project root and place this specification inside it.
Open the project in VS Code and use an AI coding agent that can read and modify the workspace.
First ask the agent to read spec.md and summarize the architecture, technology stack, frontend pages, backend architecture, database models, RAG pipeline, APIs, and development phases.
Then ask the agent to implement only Phase 1, test it, fix errors, list files created or modified, and explain how it was verified.
9. How to Properly Write Specs for AI Coding Agents
Define the target user first.
Lock the technology stack early.
Specify exact interfaces and API contracts.
Define database field names.
Define the RAG pipeline explicitly.
Define fallback and unknown-question behavior.
Define security requirements.
Define phased implementation and verification.
10. How to Build the Project Using the Specification
Execute development phase by phase. Never ask the agent to build the entire application in a single prompt.
Verify each phase before moving to the next.
Require the AI agent to list every file created or modified after each phase.
Example prompt: Read spec.md. Implement Phase 1 only. Do not implement later phases. Run the application, test the implemented functionality, fix errors, list every file created or modified, and explain how Phase 1 was verified.
11. Why a Single Spec Is Not Enough
As the project becomes larger, dedicated specifications can be created for complex subsystems while the main spec remains the source of truth.
Possible subsystem specifications include rag-spec.md, authentication-spec.md, document-processing-spec.md, vector-search-spec.md, and deployment-spec.md.
12. Closing Thought
The goal of this project is not simply to create an AI chatbot. The goal is to build a complete Retrieval-Augmented Generation system where college information is uploaded, processed, embedded, indexed, retrieved, and used as context for AI-generated answers.
Core principle: College Knowledge → Retrieval → Context → AI → Answer + Source.
A successful implementation must demonstrate that the chatbot can retrieve information from the college knowledge base and provide an answer grounded in those retrieved documents.