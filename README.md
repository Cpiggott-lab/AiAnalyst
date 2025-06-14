# AiAnalyst

[Try AiAnalyst Live](https://aianalyst.netlify.app/

AiAnalyst is a full-stack MERN application that converts CSV datasets into actionable insights. Users can register, upload CSV files, and let the app generate summaries and chart recommendations using the OpenAI API. The dashboard allows you to view projects, add notes, and ask follow-up questions about your data.

---

## 🔧 Features

- **Authentication** – Register/login with secure JWT-based tokens
- **CSV Upload** – Drag-and-drop upload with PapaParse backend cleaning
- **AI Summaries & Q&A** – Executive summaries and Q&A powered by OpenAI
- **Chart Suggestions** – Bar, pie, line, and histogram suggestions in JSON format
- **Notes and Download** – Add notes to each project and download cleaned data
- **Responsive UI** – Built with React, Tailwind CSS, and Recharts

---

## 🧱 Tech Stack

- **Frontend**: React + Vite, Tailwind CSS, Recharts
- **Backend**: Node.js + Express.js, MongoDB via Mongoose
- **AI Integration**: OpenAI API
- **Authentication**: JWT (stored via cookies & localStorage)

---

## 📁 Directory Overview

```

/client   – React frontend (components, pages, hooks, services)
/server   – Express backend (routes, controllers, models, middleware)

```

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-analyst.git
cd ai-analyst
```

### 2. Environment Variables

Create a `.env` file inside the `/server` directory:

```
PORT=5001
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
CLIENT_URL=http://localhost:5173
```

Create a `.env` file inside the `/client` directory:

```
VITE_API_BASE_URL=http://localhost:5001
```

### 3. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 4. Run the App

```bash
# Start backend
cd server
npm run dev

# In a separate terminal, start frontend
cd ../client
npm run dev
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

To contribute:

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📡 Core API Endpoints

| Method | Endpoint                               | Description                   |
| ------ | -------------------------------------- | ----------------------------- |
| POST   | /api/auth/register                     | Register a new user           |
| POST   | /api/auth/login                        | Login and receive JWT         |
| GET    | /api/auth/me                           | Verify current user           |
| POST   | /api/projects/upload                   | Upload CSV and create project |
| GET    | /api/projects                          | Get all projects for the user |
| GET    | /api/projects/\:id                     | Get a specific project        |
| POST   | /api/projects/\:id/summary             | Generate AI executive summary |
| POST   | /api/projects/\:id/question            | Ask a follow-up question      |
| GET    | /api/projects/\:id/chartdata-universal | Generate chart suggestions    |
| PUT    | /api/projects/\:id/note                | Add a note to a project       |
| DELETE | /api/projects/\:id                     | Delete a project              |

---

## 🤖 How AI Is Used

- On upload, a prompt is sent to OpenAI with a preview of your dataset.
- An executive summary is generated, identifying key points and trends.
- Follow-up questions are processed via OpenAI using the same dataset context.
- Chart suggestions are returned in JSON format for use in Recharts.

---

## 🛣️ Roadmap Ideas

- Advanced visual dashboards with more chart types
- Exportable summaries (PDF, CSV)
- Team collaboration and project sharing
- Automated data quality checks
- Unit & integration testing

---

## 👤 Author

**Christopher Piggott**
📧 [crpiggottburner@gmail.com](mailto:crpiggottburner@gmail.com)

---

## 📄 License

MIT License. Contributions and feedback welcome!

![License](https://img.shields.io/badge/license-MIT-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-integrated-brightgreen)
