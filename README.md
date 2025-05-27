Here's your full `README.md` file written in clean markdown for your PersonaForge project:

---

```md
# 🧬 PersonaForge

**AI-Powered Business Intelligence Dashboard for Startups**  
Upload raw CSVs or connect APIs — PersonaForge cleans your data, summarizes insights, visualizes charts, and predicts future trends using AI.

---

## 🚀 Features

- 🔐 User authentication (Register/Login)
- 📁 CSV upload or API import
- 🧼 Automated data cleaning
- 🧠 OpenAI-powered business summaries
- 📊 Auto-generated visual dashboards (Recharts)
- 🔮 Predictive analytics
- 💾 MongoDB storage per project
- 💳 Stripe donation support
- 🌐 About & Contact pages

---

## 🏗️ Tech Stack

| Layer      | Tech Used                             |
| ---------- | ------------------------------------- |
| Frontend   | React (Vite), Tailwind CSS, Recharts  |
| Backend    | Node.js, Express, Mongoose            |
| Database   | MongoDB Atlas                         |
| AI / ML    | OpenAI API, regression-js (or custom) |
| Deployment | Vercel (frontend), Render (backend)   |

---

## 📁 Folder Structure
```

persona-forge/
├── client/ # React + Vite frontend
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── hooks/
│ │ └── App.jsx
├── server/ # Express backend
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── utils/
│ ├── server.js
│ └── .env

````

---

## 🧪 Local Development

### 📦 Install dependencies

```bash
cd client
npm install

cd ../server
npm install
````

### 🔑 Add environment variables

Create `.env` in `server/`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_key
```

---

## ⚙️ Run the app

### 📡 Backend

```bash
cd server
npm run dev
```

### 🌐 Frontend

```bash
cd client
npm run dev
```

App runs at [http://localhost:5173](http://localhost:5173)

---

## 📌 Pages & Routes

| Path             | Description                    |
| ---------------- | ------------------------------ |
| `/`              | Landing page                   |
| `/login`         | Login form                     |
| `/register`      | Register form                  |
| `/dashboard`     | Project list + Upload button   |
| `/dashboard/new` | Upload CSV or API input        |
| `/dashboard/:id` | View summary, charts, raw data |
| `/donate`        | Stripe/PayPal donation page    |
| `/about`         | Info about the app             |
| `/contact`       | Contact page or support email  |

---

## 🤖 AI Prompts (OpenAI)

- **Summary:**
  _"Summarize trends, outliers, and patterns in this business data. Focus on what a startup founder should know."_

- **Header Renaming (optional):**
  _"Replace unreadable column headers with clean, understandable names."_

---

## ✅ MVP Progress

- [x] Auth system
- [x] Upload flow
- [x] Data cleaning
- [x] AI Summary
- [x] Charts
- [x] Predictions
- [x] Dashboard UI
- [x] About/Donate pages

---

## 📬 Contact

Made with ❤️ by Christopher Piggott
github - https://github.com/Cpiggott-lab
linkedIn - https://www.linkedin.com/in/christopher-piggott-3bbb54351/

```

```
