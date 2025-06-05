# AiAnalyst 🧠📊

**AiAnalyst** is an AI-powered data intelligence platform that transforms raw CSV data into actionable insights. Built with the MERN stack (MongoDB, Express, React, Node.js) and OpenAI, AiAnalyst allows users to upload datasets, get auto-generated summaries, ask analytical questions, and visualize their findings—all through an intuitive web interface.

---

## 🚀 Features

- 🔐 **User Authentication** — Register, login, and securely manage your data.
- 📁 **CSV Upload** — Drag-and-drop or select CSV files for instant ingestion.
- 🤖 **AI-Powered Summaries** — Receive smart summaries of your data using OpenAI.
- ❓ **Ask the AI** — Type custom questions about your dataset and get contextual answers.
- 📊 **Dashboard View** — See all your uploaded projects, manage them, and get insights.
- 🗑️ **Delete Projects** — Clean up and manage data with one click.
- ⚡ **Responsive UI** — Fast, mobile-ready interface built with Tailwind CSS and React Router.

---

## 🧱 Tech Stack

| Layer        | Tools                     |
| ------------ | ------------------------- |
| Frontend     | React, Vite, Tailwind CSS |
| Backend      | Node.js, Express.js       |
| Database     | MongoDB with Mongoose     |
| AI Engine    | OpenAI API (GPT-4)        |
| File Parsing | PapaParse, Multer         |
| Auth         | JWT + Context API         |

---

## 📂 Folder Structure

ai-analyst/
├── client/ # React frontend
│ ├── components/ # Reusable UI parts
│ ├── context/ # Auth provider
│ ├── pages/ # Route pages (Dashboard, Upload, etc.)
│ ├── services/ # Axios-based API wrappers
│ └── App.jsx
├── server/ # Node + Express backend
│ ├── routes/ # API routes (auth, projects)
│ ├── models/ # Mongoose schemas
│ ├── middleware/ # JWT auth checker
│ ├── utils/ # OpenAI logic & CSV parsing
│ └── app.js

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-analyst.git
cd ai-analyst

2. Environment Setup

Backend .env file (inside /server):

PORT=5001
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key

Frontend .env file (inside /client):

VITE_API_URL=http://localhost:5001


⸻

3. Install Dependencies

# Backend
cd server
npm install

# Frontend
cd ../client
npm install


⸻

4. Start the App

# Start backend
cd server
npm run dev

# In new terminal, start frontend
cd ../client
npm run dev


⸻

🔑 API Endpoints

Auth

Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login and return JWT
GET	/api/auth/me	Get logged-in user

Projects

Method	Endpoint	Description
POST	/api/projects/upload	Upload and parse CSV file
GET	/api/projects	Fetch all user projects
GET	/api/projects/:id	Get one project by ID
POST	/api/projects/:id/summary	Generate AI summary
POST	/api/projects/:id/question	Ask AI a custom question
DELETE	/api/projects/:id	Delete a project


⸻

🧠 How AI is Used
	•	On upload, OpenAI is called with a custom prompt to summarize the dataset.
	•	Users can ask follow-up questions, which are routed to OpenAI for context-based answers.
	•	All AI interactions are designed to be dataset-aware and insight-driven.

⸻

📌 Roadmap
	•	📈 Charts and visual data graphs
	•	🧾 Downloadable summaries (PDF/CSV)
	•	🧠 Smarter AI with user feedback loop
	•	🔗 Team sharing & collaboration
	•	🧪 Unit + integration testing

⸻

🧪 Sample Prompt to OpenAI

“You are a business analyst. Summarize the key insights, trends, or outliers in the following dataset in plain English. Focus on areas relevant to sales performance, customer behavior, or operational issues.”

⸻

🧑‍💻 Developed By

Christopher Piggott
📧 crpiggottburner@gmail.com

⸻

📄 License

Licensed under MIT. Free to use and modify.

⸻

💬 Feedback

Found a bug? Want a feature? Open an issue or submit a PR!
```
