# 🚀 Deployment Guide: Render (Backend) & Vercel (Frontend)

This guide provides step-by-step instructions for deploying your RAG-Based College Chatbot:
- **Backend API & RAG Pipeline**: Deployed on [Render](https://render.com)
- **Frontend Client**: Deployed on [Vercel](https://vercel.com)
- **Database**: [MongoDB Atlas](https://cloud.mongodb.com)

---

## 📌 Step 1: Push Code to GitHub

1. Open your terminal in the root project directory:
   ```bash
   cd c:\Users\Moham\OneDrive\Desktop\website\chatbotwebsite
   ```

2. Initialize Git (if not already done) and stage all files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Full-stack RAG College Chatbot"
   ```

3. Create a new repository on **[GitHub](https://github.com/new)** named `rag-college-chatbot`.

4. Link your local repo and push to GitHub:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/rag-college-chatbot.git
   git push -u origin main
   ```

---

## 📌 Step 2: Deploy Backend to Render

1. Go to **[Render.com](https://render.com)** and sign in / sign up with GitHub.
2. Click **New +** -> Select **Web Service**.
3. Connect your `rag-college-chatbot` repository.
4. Configure the Web Service:
   - **Name**: `rag-college-chatbot-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (or `node src/server.js`)
5. Add **Environment Variables** under the *Environment* tab:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `mongodb+srv://admin:Password123@cluster0.tldqaxe.mongodb.net/college-chatbot?retryWrites=true&w=majority`
   - `JWT_SECRET`: `supersecret_jwt_key_rag_college_chatbot_2026`
   - `GEMINI_API_KEY`: `your_actual_gemini_api_key`
   - `CLIENT_URL`: `https://your-frontend-app.vercel.app` (you will update this after deploying to Vercel).

6. Click **Create Web Service**.
7. Copy your deployed Backend URL (e.g. `https://rag-college-chatbot-backend.onrender.com`).

---

## 📌 Step 3: Deploy Frontend to Vercel

1. Go to **[Vercel.com](https://vercel.com)** and log in with GitHub.
2. Click **Add New...** -> Select **Project**.
3. Import your `rag-college-chatbot` repository.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://rag-college-chatbot-backend.onrender.com/api` *(replace with your actual Render backend URL)*
6. Click **Deploy**.

---

## 📌 Step 4: Final Link & Seeding

1. **Update Render `CLIENT_URL`**:
   - Go back to your Render dashboard -> Web Service -> **Environment**.
   - Set `CLIENT_URL` to your Vercel URL (e.g. `https://rag-college-chatbot.vercel.app`).
   - Save changes (Render will automatically redeploy).

2. **Seed Initial College Documents & Admin User**:
   - You can run the seed script locally pointing to your production MongoDB Atlas string:
     ```bash
     cd backend
     npm run seed
     ```
   - Or trigger a manual document upload directly via the Admin dashboard on your live deployed Vercel URL!

---

## 🎉 You're Live!

- **Frontend URL**: `https://your-app.vercel.app`
- **Backend API**: `https://your-app.onrender.com/api/health`
